import React, { useState } from 'react';
import { generatePosts } from '../services/geminiService';
import { Post, SocialPlatform } from '../types';
import { Loader2, Wand2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GeneratorProps {
  onPostsGenerated: (posts: Post[]) => void;
}

export const Generator: React.FC<GeneratorProps> = ({ onPostsGenerated }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const apiKey = process.env.API_KEY; 
      if (!apiKey) {
        throw new Error("API Key configuration missing. This is a demo environment.");
      }

      const generated = await generatePosts(
        formData.businessName,
        formData.description,
        formData.startDate,
        apiKey
      );

      // Convert Partial<Post> to full Post with standard defaults
      const fullPosts: Post[] = generated.map(p => ({
        id: p.id!,
        content: p.content || '',
        image: p.image,
        platforms: p.platforms || ['facebook', 'instagram'],
        scheduledDate: p.scheduledDate || new Date().toISOString(),
        status: 'draft',
        stats: { likes: 0, shares: 0, comments: 0 }
      }));

      onPostsGenerated(fullPosts);
      navigate('/calendar');
    } catch (err: any) {
      setError(err.message || "Failed to generate posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
          <Wand2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quick Start Generator</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Tell us about your business, and our AI will create 30 days of content in seconds.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Business Name
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g., The Coffee Nook"
              value={formData.businessName}
              onChange={e => setFormData({ ...formData, businessName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Website URL
            </label>
            <input
              type="url"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="https://example.com"
              value={formData.website}
              onChange={e => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Business Description & Goals
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="We are a cozy coffee shop in Seattle specializing in artisan roasts. We want to attract students and remote workers..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">The more detail, the better the posts.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Campaign Start Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Generating Magic...
              </>
            ) : (
              <>
                <Wand2 size={20} /> Generate 30-Day Plan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
