const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const axios = require('axios');

admin.initializeApp();

// ============================================
// SECURITY: Input Validation Constants (S-02)
// ============================================

// Allowed POI types for search queries (prevents OQL injection)
const ALLOWED_POI_TYPES = new Set([
  'hospital', 'pharmacy', 'clinic', 'restaurant', 'fuel',
  'bank', 'school', 'police', 'fire_station', 'atm', 'hotel',
  'cafe', 'fast_food', 'parking', 'bus_station', 'library'
]);

// Radius limits (in meters)
const MIN_RADIUS = 100;
const MAX_RADIUS = 10000;

/**
 * Validates and sanitizes search parameters
 * @returns {Object} { valid: boolean, error?: string, sanitized?: object }
 */
function validateSearchParams(lat, lon, type, radius) {
  // Validate coordinates
  const parsedLat = parseFloat(lat);
  const parsedLon = parseFloat(lon);
  
  if (isNaN(parsedLat) || isNaN(parsedLon)) {
    return { valid: false, error: 'Invalid coordinates' };
  }
  
  if (parsedLat < -90 || parsedLat > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }
  
  if (parsedLon < -180 || parsedLon > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }
  
  // Validate and sanitize POI type (strict allowlist)
  const sanitizedType = String(type).toLowerCase().trim();
  if (!ALLOWED_POI_TYPES.has(sanitizedType)) {
    return { 
      valid: false, 
      error: `Invalid POI type. Allowed types: ${[...ALLOWED_POI_TYPES].join(', ')}` 
    };
  }
  
  // Validate radius
  const parsedRadius = parseInt(radius, 10);
  if (isNaN(parsedRadius) || parsedRadius < MIN_RADIUS || parsedRadius > MAX_RADIUS) {
    return { 
      valid: false, 
      error: `Radius must be a number between ${MIN_RADIUS} and ${MAX_RADIUS} meters` 
    };
  }
  
  return {
    valid: true,
    sanitized: {
      lat: parsedLat,
      lon: parsedLon,
      type: sanitizedType,
      radius: parsedRadius
    }
  };
}

// API Key Verification Endpoint for SDK
exports.verify = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const apiKey = req.query.key;
      if (!apiKey) {
        return res.status(400).json({ valid: false, error: 'API key is required' });
      }

      // Check if API key exists and is active
      const keysSnapshot = await admin.firestore()
        .collectionGroup('keys')
        .where('key', '==', apiKey)
        .where('active', '==', true)
        .limit(1)
        .get();

      if (keysSnapshot.empty) {
        return res.status(200).json({ valid: false });
      }

      // Key is valid, optionally increment usage counter
      const keyDoc = keysSnapshot.docs[0];
      await keyDoc.ref.update({
        lastUsed: admin.firestore.FieldValue.serverTimestamp()
      });

      res.status(200).json({ valid: true });

    } catch (error) {
      console.error('Error verifying API key:', error);
      res.status(500).json({ valid: false, error: 'Internal server error' });
    }
  });
});

// Generate API Key
exports.generateKey = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Check if user is authenticated
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      // Generate new API key
      const { v4: uuidv4 } = require('uuid');
      const newKey = uuidv4();

      // Store in Firestore
      const keyData = {
        key: newKey,
        active: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        usageCount: 0,
        name: req.body.name || `API Key ${Date.now()}`
      };

      const keyRef = await admin.firestore()
        .collection('apiKeys')
        .doc(uid)
        .collection('keys')
        .add(keyData);

      res.status(200).json({
        success: true,
        keyId: keyRef.id,
        key: newKey
      });

    } catch (error) {
      console.error('Error generating API key:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Revoke API Key
exports.revokeKey = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Check if user is authenticated
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { keyId } = req.body;
      if (!keyId) {
        return res.status(400).json({ error: 'Key ID is required' });
      }

      // Update key status
      await admin.firestore()
        .collection('apiKeys')
        .doc(uid)
        .collection('keys')
        .doc(keyId)
        .update({ active: false });

      res.status(200).json({ success: true });

    } catch (error) {
      console.error('Error revoking API key:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Search API
exports.search = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      // Check API key
      const apiKey = req.headers['x-api-key'];
      if (!apiKey) {
        return res.status(401).json({ error: 'API key is required' });
      }

      // Validate API key
      const keysSnapshot = await admin.firestore()
        .collectionGroup('keys')
        .where('key', '==', apiKey)
        .where('active', '==', true)
        .limit(1)
        .get();

      if (keysSnapshot.empty) {
        return res.status(401).json({ error: 'Invalid or inactive API key' });
      }

      const keyDoc = keysSnapshot.docs[0];

      // Get and validate search parameters (S-02: OQL Injection Prevention)
      const { lat, lon, type = 'hospital', radius = 3000 } = req.query;
      
      const validation = validateSearchParams(lat, lon, type, radius);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
      
      const { lat: safeLat, lon: safeLon, type: safeType, radius: safeRadius } = validation.sanitized;

      // Build Overpass query with sanitized inputs
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="${safeType}"](around:${safeRadius},${safeLat},${safeLon});
          way["amenity"="${safeType}"](around:${safeRadius},${safeLat},${safeLon});
          relation["amenity"="${safeType}"](around:${safeRadius},${safeLat},${safeLon});
        );
        out center;
      `;

      // Query Overpass API
      const overpassResponse = await axios.post(
        'https://overpass-api.de/api/interpreter',
        `data=${encodeURIComponent(overpassQuery)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 30000
        }
      );

      // Process results
      const results = overpassResponse.data.elements
        .filter(element => element.lat && element.lon)
        .map(element => ({
          id: element.id,
          name: element.tags?.name || `${safeType.charAt(0).toUpperCase() + safeType.slice(1)}`,
          type: element.tags?.amenity || safeType,
          lat: element.lat || element.center?.lat,
          lng: element.lon || element.center?.lon,
          address: element.tags?.['addr:full'] || element.tags?.['addr:street'] || '',
          phone: element.tags?.phone || '',
          website: element.tags?.website || '',
          opening_hours: element.tags?.opening_hours || ''
        }))
        .slice(0, 50); // Limit results

      // Update usage count
      await keyDoc.ref.update({
        usageCount: admin.firestore.FieldValue.increment(1)
      });

      res.status(200).json({
        success: true,
        results: results,
        count: results.length
      });

    } catch (error) {
      console.error('Error in search API:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Get usage statistics
exports.usage = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Check if user is authenticated
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      // Get all user's API keys
      const keysSnapshot = await admin.firestore()
        .collection('apiKeys')
        .doc(uid)
        .collection('keys')
        .get();

      const keys = keysSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
      }));

      const totalUsage = keys.reduce((sum, key) => sum + (key.usageCount || 0), 0);
      const activeKeys = keys.filter(key => key.active).length;

      res.status(200).json({
        success: true,
        keys: keys,
        totalUsage: totalUsage,
        activeKeys: activeKeys
      });

    } catch (error) {
      console.error('Error getting usage stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});
