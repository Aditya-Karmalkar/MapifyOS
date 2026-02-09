const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const axios = require('axios');

admin.initializeApp();

// ============================================
// PERFORMANCE: API Key Caching (A-01)
// ============================================

// Simple in-memory cache for verified API keys
// TTL: 5 minutes - balances freshness with performance
const apiKeyCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get a cached API key document reference
 * @param {string} apiKey - The API key to look up
 * @returns {Object|null} Cached data with docRef, or null if not cached/expired
 */
function getCachedKey(apiKey) {
  const cached = apiKeyCache.get(apiKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached;
  }
  // Expired or not found - clean up
  apiKeyCache.delete(apiKey);
  return null;
}

/**
 * Cache an API key lookup result
 * @param {string} apiKey - The API key
 * @param {Object} docRef - Firestore document reference
 */
function setCachedKey(apiKey, docRef) {
  // Prevent unbounded cache growth - limit to 1000 keys
  if (apiKeyCache.size >= 1000) {
    // Remove oldest entry
    const firstKey = apiKeyCache.keys().next().value;
    apiKeyCache.delete(firstKey);
  }
  apiKeyCache.set(apiKey, { docRef, timestamp: Date.now() });
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

      // A-01: Check cache first to avoid Firestore read on repeated requests
      let keyDocRef;
      const cached = getCachedKey(apiKey);
      
      if (cached) {
        // Cache hit - use cached reference
        keyDocRef = cached.docRef;
      } else {
        // Cache miss - query Firestore
        const keysSnapshot = await admin.firestore()
          .collectionGroup('keys')
          .where('key', '==', apiKey)
          .where('active', '==', true)
          .limit(1)
          .get();

        if (keysSnapshot.empty) {
          return res.status(401).json({ error: 'Invalid or inactive API key' });
        }

        keyDocRef = keysSnapshot.docs[0].ref;
        // Cache for future requests
        setCachedKey(apiKey, keyDocRef);
      }

      // Get search parameters
      const { lat, lon, type = 'hospital', radius = 3000 } = req.query;

      if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
      }

      // Build Overpass query
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="${type}"](around:${radius},${lat},${lon});
          way["amenity"="${type}"](around:${radius},${lat},${lon});
          relation["amenity"="${type}"](around:${radius},${lat},${lon});
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
          name: element.tags?.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
          type: element.tags?.amenity || type,
          lat: element.lat || element.center?.lat,
          lng: element.lon || element.center?.lon,
          address: element.tags?.['addr:full'] || element.tags?.['addr:street'] || '',
          phone: element.tags?.phone || '',
          website: element.tags?.website || '',
          opening_hours: element.tags?.opening_hours || ''
        }))
        .slice(0, 50); // Limit results

      // Update usage count (still per-request, but read is now cached)
      await keyDocRef.update({
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
