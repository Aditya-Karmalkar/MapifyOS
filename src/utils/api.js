// API utility functions for Mapify OS

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * Search for nearby POIs using the Mapify OS API
 * @param {string} apiKey - User's API key
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} type - POI type (hospital, pharmacy, etc.)
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Object>} Search results
 */
export const searchPOIs = async (apiKey, lat, lon, type = 'hospital', radius = 3000) => {
  try {
    const url = `${API_BASE_URL}/search?lat=${lat}&lon=${lon}&type=${type}&radius=${radius}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching POIs:', error);
    throw error;
  }
};

/**
 * Generate a new API key
 * @param {string} idToken - Firebase ID token
 * @param {string} name - Key name
 * @returns {Promise<Object>} Generated key info
 */
export const generateApiKey = async (idToken, name) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generateKey`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      throw new Error(`Failed to generate API key: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating API key:', error);
    throw error;
  }
};

/**
 * Revoke an API key
 * @param {string} idToken - Firebase ID token
 * @param {string} keyId - Key ID to revoke
 * @returns {Promise<Object>} Success response
 */
export const revokeApiKey = async (idToken, keyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/revokeKey`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ keyId })
    });

    if (!response.ok) {
      throw new Error(`Failed to revoke API key: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error revoking API key:', error);
    throw error;
  }
};

/**
 * Get usage statistics
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object>} Usage statistics
 */
export const getUsageStats = async (idToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usage`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get usage stats: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting usage stats:', error);
    throw error;
  }
};

// POI type mappings for search queries
export const POI_TYPES = {
  hospital: 'hospital',
  pharmacy: 'pharmacy',
  clinic: 'clinic',
  restaurant: 'restaurant',
  fuel: 'fuel',
  bank: 'bank',
  school: 'school',
  police: 'police',
  fire_station: 'fire_station',
  atm: 'atm',
  hotel: 'hotel',
  gas_station: 'fuel',
  drugstore: 'pharmacy'
};

/**
 * Parse search query to determine POI type
 * @param {string} query - Search query
 * @returns {string} POI type
 */
export const parsePOIType = (query) => {
  const lowerQuery = query.toLowerCase();
  
  for (const [key, value] of Object.entries(POI_TYPES)) {
    if (lowerQuery.includes(key)) {
      return value;
    }
  }
  
  return 'hospital'; // Default fallback
};
