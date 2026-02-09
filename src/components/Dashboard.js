import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { Key, Plus, Trash2, Copy, Eye, EyeOff, Map, ExternalLink, Activity } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const keysRef = collection(db, 'apiKeys', user.uid, 'keys');
        const q = query(keysRef);

        const unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const keys = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setApiKeys(keys);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching API keys:', error);
            // Set loading to false even on error to prevent infinite loading
            setLoading(false);
            setApiKeys([]);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up API keys listener:', error);
        setLoading(false);
        setApiKeys([]);
      }
    };

    fetchApiKeys();
  }, [user.uid]);

  const generateApiKey = async () => {
    setGenerating(true);
    try {
      const newKey = uuidv4();
      const keysRef = collection(db, 'apiKeys', user.uid, 'keys');
      
      await addDoc(keysRef, {
        key: newKey,
        active: true,
        createdAt: new Date().toISOString(),
        usageCount: 0,
        name: `API Key ${apiKeys.length + 1}`
      });
    } catch (error) {
      console.error('Error generating API key:', error);
    }
    setGenerating(false);
  };

  const deleteApiKey = async (keyId, keyName) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `⚠️ Delete API Key "${keyName}"?\n\n` +
      `This action cannot be undone. Once deleted, this API key will be permanently removed and cannot be retrieved again.\n\n` +
      `Any applications using this key will stop working immediately.\n\n` +
      `Are you sure you want to continue?`
    );

    if (!confirmed) return;

    try {
      const keyRef = doc(db, 'apiKeys', user.uid, 'keys', keyId);
      await deleteDoc(keyRef);
      
      // Show success message
      alert('✅ API Key deleted successfully!\n\nThe key has been permanently removed from the database.');
    } catch (error) {
      console.error('Error deleting API key:', error);
      alert('❌ Error deleting API key. Please try again.');
    }
  };

  const copyToClipboard = async (key, keyId) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const formatKey = (key, keyId) => {
    if (visibleKeys[keyId]) {
      return key;
    }
    return key.substring(0, 8) + '•'.repeat(24) + key.substring(key.length - 4);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Manage your API keys and explore the map interface
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              to="/map"
              className="bg-white dark:bg-slate-950 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Map className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Explore Maps
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        Open Interactive Map
                      </dd>
                    </dl>
                  </div>
                  <div className="flex-shrink-0">
                    <ExternalLink className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-white dark:bg-slate-950 overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total API Calls
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {apiKeys.reduce((sum, key) => sum + key.usageCount, 0)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* API Keys Section */}
          <div className="bg-white dark:bg-slate-950 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">API Keys</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Generate and manage API keys for your applications
                  </p>
                </div>
                <button
                  onClick={generateApiKey}
                  disabled={generating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {generating ? 'Generating...' : 'Generate Key'}
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              {apiKeys.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No API keys</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by generating your first API key.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={generateApiKey}
                      disabled={generating}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-950"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Generate API Key
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className={`border rounded-lg p-4 ${
                        apiKey.active 
                          ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900' 
                          : 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {apiKey.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                apiKey.active
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                              }`}
                            >
                              {apiKey.active ? 'Active' : 'Revoked'}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>Created: {formatDate(apiKey.createdAt)}</span>
                            <span>Usage: {apiKey.usageCount} calls</span>
                          </div>
                          <div className="mt-3 flex items-center space-x-2">
                            <code className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1 rounded text-sm font-mono">
                              {formatKey(apiKey.key, apiKey.id)}
                            </code>
                            <button
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {visibleKeys[apiKey.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                              className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            {copiedKey === apiKey.id && (
                              <span className="text-xs text-green-600 dark:text-green-400">Copied!</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteApiKey(apiKey.id, apiKey.name)}
                          className="ml-4 p-2 text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400"
                          title="Delete API Key"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SDK Documentation */}
          <div className="mt-8 bg-white dark:bg-slate-950 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">SDK Integration</h2>
            </div>
            <div className="px-6 py-4">
              <div className="prose max-w-none">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Quick Start</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Embed interactive maps in your website with just a few lines of code.
                </p>
                <div className="mt-4 bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-white overflow-x-auto">
                  <code className="text-sm">
                    {`<!-- Include Leaflet CSS -->`}<br/>
                    {`<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />`}<br/><br/>
                    {`<!-- Include Leaflet JS -->`}<br/>
                    {`<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>`}<br/><br/>
                    {`<!-- Include Mapify OS SDK -->`}<br/>
                    {`<script src="https://mapifysdk.netlify.app/v1/mapify.js"></script>`}<br/><br/>
                    {`<!-- Create map container -->`}<br/>
                    {`<div id="map" style="height: 500px;"></div>`}<br/><br/>
                    {`<!-- Initialize map -->`}<br/>
                    {`<script>`}<br/>
                    {`  MapifyOS.init("map", {`}<br/>
                    {`    apiKey: "YOUR_API_KEY_HERE"`}<br/>
                    {`  });`}<br/>
                    {`</script>`}
                  </code>
                </div>
                <div className="mt-4 flex space-x-4">
                  <a 
                    href="/documentation" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    📚 Full Documentation
                  </a>
                  <a 
                    href="https://mapifysdk.netlify.app" 
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    🔗 SDK Homepage
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">Terms of Use</Link>
              <Link to="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</Link>
              <Link to="/documentation" className="hover:text-gray-700 dark:hover:text-gray-300">Documentation</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
