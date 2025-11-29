import React, { useState, useEffect } from 'react';
import { Asset } from '../types';
import { getAssets, addAsset, deleteAsset } from '../services/mockStore';
import { Trash2, Plus, Image as ImageIcon, ExternalLink, Copy } from 'lucide-react';

interface AssetLibraryProps {
  onSelect?: (url: string) => void;
  isModal?: boolean;
}

export const AssetLibrary: React.FC<AssetLibraryProps> = ({ onSelect, isModal = false }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setAssets(getAssets());
  }, []);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const asset: Asset = {
      id: Date.now().toString(),
      url: newUrl,
      name: newName || 'Untitled Image',
      createdAt: new Date().toISOString()
    };

    const updated = addAsset(asset);
    setAssets(updated);
    setNewUrl('');
    setNewName('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteAsset(id);
    setAssets(updated);
  };

  return (
    <div className={`${isModal ? '' : 'max-w-6xl mx-auto space-y-6'}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Asset Library</h2>
           {!isModal && <p className="text-gray-500 dark:text-gray-400">Manage your media assets for posts.</p>}
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          {showAddForm ? 'Cancel' : <><Plus size={20} /> Add Image URL</>}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg mb-6 animate-in slide-in-from-top-2">
          <form onSubmit={handleAddAsset} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
              <input 
                type="url" 
                required
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name (Optional)</label>
              <input 
                type="text" 
                placeholder="Summer Promo Banner"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium whitespace-nowrap"
            >
              Save Asset
            </button>
          </form>
        </div>
      )}

      {assets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 mb-4">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No assets yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2">
            Add image URLs from Unsplash, your website, or other hosting services to use them in your posts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map(asset => (
            <div 
              key={asset.id} 
              onClick={() => onSelect && onSelect(asset.url)}
              className={`group relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 ${onSelect ? 'cursor-pointer hover:ring-2 hover:ring-indigo-500' : ''}`}
            >
              <img 
                src={asset.url} 
                alt={asset.name} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400?text=Error+Loading')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white font-medium text-sm truncate">{asset.name}</p>
                <div className="flex justify-between items-center mt-2">
                  <a 
                    href={asset.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-white/80 hover:text-white p-1"
                    title="Open in new tab"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button 
                    onClick={(e) => handleDelete(asset.id, e)}
                    className="text-red-400 hover:text-red-300 p-1 bg-white/10 rounded"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};