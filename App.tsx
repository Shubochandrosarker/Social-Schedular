import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Generator } from './components/Generator';
import { CalendarView } from './components/CalendarView';
import { Settings } from './components/Settings';
import { getStoredPosts, addPosts, getProfile, saveProfile } from './services/mockStore';
import { Post } from './types';

const AssetLibrary = () => (
    <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-400">Asset Library</h2>
        <p className="text-gray-500">Coming soon: Upload and manage your media assets.</p>
    </div>
);

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load initial data
    setPosts(getStoredPosts());
    
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
    }
  }, []);

  const handlePostsGenerated = (newPosts: Post[]) => {
    const updated = addPosts(newPosts);
    setPosts(updated);
  };

  const handleUpdatePosts = () => {
    setPosts(getStoredPosts());
  };

  return (
    <HashRouter>
      <Layout darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)}>
        <Routes>
          <Route path="/" element={<Dashboard posts={posts} />} />
          <Route path="/generate" element={<Generator onPostsGenerated={handlePostsGenerated} />} />
          <Route path="/calendar" element={<CalendarView posts={posts} onUpdatePosts={handleUpdatePosts} />} />
          <Route path="/assets" element={<AssetLibrary />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
