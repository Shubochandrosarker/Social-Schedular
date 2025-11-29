import React, { useState, useEffect } from 'react';
import { SocialAccount, SocialPlatform } from '../types';
import { getAccounts, saveAccounts, getAyrshareKey, saveAyrshareKey } from '../services/mockStore';
import { getAyrshareProfile } from '../services/ayrshareService';
import { Link2, Check, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';

export const Settings = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [ayrshareKey, setAyrshareKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    setAccounts(getAccounts());
    setAyrshareKey(getAyrshareKey());
  }, []);

  const handleSaveKey = () => {
      saveAyrshareKey(ayrshareKey);
      setStatusMsg({ type: 'success', text: 'API Key saved locally.' });
      setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleSync = async () => {
      if (!ayrshareKey) {
          setStatusMsg({ type: 'error', text: 'Please enter an API Key first.' });
          return;
      }
      
      setLoading(true);
      setStatusMsg(null);
      
      try {
          const userProfile = await getAyrshareProfile(ayrshareKey);
          
          // Map Ayrshare active profiles to our internal state
          // Ayrshare returns active profiles in the 'profiles' array or fields like 'facebook: 1'
          const activeProfiles = userProfile.profiles || []; // Array of profile objects or keys
          
          const newAccounts = accounts.map(acc => {
              // Simple check if the platform code exists in the active profiles list
              // Note: Ayrshare returns 'gmb' for googleBusiness
              const searchKey = acc.platform === 'googleBusiness' ? 'gmb' : acc.platform;
              const isConnected = activeProfiles.some((p: any) => p.title?.toLowerCase() === searchKey || p === searchKey);
              
              return {
                  ...acc,
                  connected: isConnected,
                  username: isConnected ? 'Connected' : undefined
              };
          });
          
          setAccounts(newAccounts);
          saveAccounts(newAccounts);
          setStatusMsg({ type: 'success', text: 'Social profiles synced successfully!' });
      } catch (err) {
          console.error(err);
          setStatusMsg({ type: 'error', text: 'Failed to sync. Check your API Key.' });
      } finally {
          setLoading(false);
      }
  };

  const platforms: {type: SocialPlatform; label: string; color: string}[] = [
    { type: 'facebook', label: 'Facebook Page', color: 'bg-blue-600' },
    { type: 'instagram', label: 'Instagram Business', color: 'bg-pink-600' },
    { type: 'linkedin', label: 'LinkedIn Page', color: 'bg-blue-700' },
    { type: 'pinterest', label: 'Pinterest', color: 'bg-red-600' },
    { type: 'googleBusiness', label: 'Google Business', color: 'bg-blue-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage your connected social media profiles.</p>
      </div>

      {/* API Key Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <div className="p-1 bg-green-100 rounded">
            <Link2 size={18} className="text-green-600" />
          </div>
          Ayrshare API Connection
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Enter your Ayrshare API key to enable live scheduling. 
          <a href="https://app.ayrshare.com/" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline ml-1 inline-flex items-center gap-1">
             Get Key <ExternalLink size={12} />
          </a>
        </p>
        <div className="flex gap-2 mb-2">
          <input 
            type="password" 
            placeholder="Enter AYRSHARE_API_KEY"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            value={ayrshareKey}
            onChange={(e) => setAyrshareKey(e.target.value)}
          />
          <button 
            onClick={handleSaveKey}
            className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-medium"
          >
            Save Key
          </button>
        </div>
        {statusMsg && (
            <p className={`text-sm ${statusMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {statusMsg.text}
            </p>
        )}
      </div>

      {/* Platform List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Connected Platforms</h3>
            <div className="flex gap-3">
                <a 
                   href="https://app.ayrshare.com/social-accounts" 
                   target="_blank" 
                   rel="noreferrer"
                   className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300"
                >
                    <ExternalLink size={16} /> Manage Connections
                </a>
                <button 
                    onClick={handleSync}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-70"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 
                    {loading ? 'Syncing...' : 'Sync Profiles'}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map(p => {
            const account = accounts.find(a => a.platform === p.type);
            const isConnected = account?.connected;

            return (
                <div key={p.type} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${p.color}`}>
                        {p.label.charAt(0)}
                    </div>
                    <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{p.label}</h4>
                    <p className="text-xs text-gray-500">
                        {isConnected ? <span className="text-green-600 font-medium flex items-center gap-1"><Check size={12}/> Connected</span> : 'Not connected'}
                    </p>
                    </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
            );
            })}
        </div>
      </div>

      {/* Info Banner */}
      {!ayrshareKey && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/50 rounded-lg flex gap-3">
            <AlertTriangle className="text-yellow-600 dark:text-yellow-500 shrink-0" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium">Setup Required</p>
            <p>To use this app live, please enter your Ayrshare API Key above and click "Sync Profiles". You must connect your social accounts via the Ayrshare Dashboard first.</p>
            </div>
        </div>
      )}
    </div>
  );
};