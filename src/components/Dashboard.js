import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { Key, Plus, Trash2, Copy, Eye, EyeOff, Map, ExternalLink, Activity, Sparkles, Book, ArrowRight } from 'lucide-react';

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
      alert('Failed to generate API key. Please check your connection or try again.');
    }
    setGenerating(false);
  };

  const deleteApiKey = async (keyId, keyName) => {
    const confirmed = window.confirm(
      `⚠️ Delete API Key "${keyName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const keyRef = doc(db, 'apiKeys', user.uid, 'keys', keyId);
      await deleteDoc(keyRef);
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold mb-2">
            Welcome back, <span className="text-primary-100">{user.displayName || user.email?.split('@')[0]}</span>
          </h1>
          <p className="text-primary-50 opacity-90 max-w-2xl">
            Manage your API keys, monitor usage, and explore the capabilities of Mapify OS.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/map"
          className="group glass-card p-6 rounded-2xl hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300">
              <Map className="w-8 h-8" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transform group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Interactive Map</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Explore terrain, satellite, and dark mode maps interactions.
          </p>
        </Link>

        <div className="group glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-8 h-8" />
            </div>
            <div className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wider">
              Active
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">System Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">API Health</span>
              <span className="text-green-600 dark:text-green-400 font-medium">99.9%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '99.9%' }}></div>
            </div>
          </div>
        </div>

        <Link
          to="/docs"
          className="group glass-card p-6 rounded-2xl hover:border-secondary-300 dark:hover:border-secondary-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-secondary-500 to-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
              <Book className="w-8 h-8" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transform group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Documentation</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Learn how to integrate Mapify OS into your applications.
          </p>
        </Link>
      </div>

      {/* API Keys Section */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-primary-500" />
              Your API Keys
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage keys for accessing Mapify OS services
            </p>
          </div>
          <button
            onClick={generateApiKey}
            disabled={generating} // Removed strict limit for now to debug user issue, or keep it but with clearer feedback
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all shadow-md hover:shadow-lg ${generating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700'
              } ${apiKeys.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={apiKeys.length >= 5 ? "Limit reached (5 keys max)" : "Generate new key"}
          >
            {generating ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div> : <Plus className="w-4 h-4" />}
            <span>{generating ? 'Generating...' : 'Generate New Key'}</span>
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-16 px-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4 animate-bounce-slow">
                <Sparkles className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No API keys yet</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                Create your first API key to start building with Mapify OS. It takes less than a second!
              </p>
              <button
                onClick={generateApiKey}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-bold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Key</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                          {visibleKeys[key.id] ? key.key : '•'.repeat(24) + key.key.slice(-4)}
                        </span>
                        <button
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                          title={visibleKeys[key.id] ? "Hide Key" : "Show Key"}
                        >
                          {visibleKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(key.key, key.id)}
                          className={`p-1 transition-colors ${copiedKey === key.id ? 'text-green-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                            }`}
                          title="Copy Key"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>Created: {formatDate(key.createdAt)}</span>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                        <span>{key.name}</span>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                        <span className="font-medium">{key.usageCount} calls</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteApiKey(key.id, key.name)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Revoke</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SDK Documentation */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 dark:bg-primary-900/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Integration</h2>
          <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto shadow-inner border border-gray-800">
            <code className="text-sm font-mono text-gray-300">
              <span className="text-purple-400">import</span> {'{ MapifyOS }'} <span className="text-purple-400">from</span> <span className="text-green-400">'mapify-sdk'</span>;<br /><br />
              MapifyOS.<span className="text-blue-400">init</span>(<span className="text-green-400">"map-container"</span>, {'{'}<br />
              &nbsp;&nbsp;apiKey: <span className="text-green-400">"YOUR_API_KEY"</span>,<br />
              &nbsp;&nbsp;theme: <span className="text-green-400">"modern"</span><br />
              {'}'});
            </code>
          </div>
          <div className="mt-4">
            <Link to="/docs" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center">
              View full documentation <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
