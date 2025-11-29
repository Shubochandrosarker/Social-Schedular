import React, { useMemo } from 'react';
import { Post } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  posts: Post[];
}

export const Dashboard: React.FC<DashboardProps> = ({ posts }) => {
  const stats = useMemo(() => {
    const scheduled = posts.filter(p => p.status === 'scheduled').length;
    const published = posts.filter(p => p.status === 'published').length;
    const totalLikes = posts.reduce((acc, curr) => acc + (curr.stats?.likes || 0), 0);
    const totalShares = posts.reduce((acc, curr) => acc + (curr.stats?.shares || 0), 0);
    return { scheduled, published, totalLikes, totalShares };
  }, [posts]);

  // Mock data for charts
  const activityData = [
    { name: 'Mon', likes: 400, shares: 240 },
    { name: 'Tue', likes: 300, shares: 139 },
    { name: 'Wed', likes: 200, shares: 980 },
    { name: 'Thu', likes: 278, shares: 390 },
    { name: 'Fri', likes: 189, shares: 480 },
    { name: 'Sat', likes: 239, shares: 380 },
    { name: 'Sun', likes: 349, shares: 430 },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>
        <Link to="/generate" className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <TrendingUp size={18} />
          Create New Posts
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Likes" value={stats.totalLikes.toLocaleString()} icon={TrendingUp} color="bg-pink-500" />
        <StatCard title="Scheduled Posts" value={stats.scheduled} icon={Calendar} color="bg-blue-500" />
        <StatCard title="Published" value={stats.published} icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Total Shares" value={stats.totalShares.toLocaleString()} icon={Users} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm h-80">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Engagement Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Line type="monotone" dataKey="likes" stroke="#ec4899" strokeWidth={2} />
              <Line type="monotone" dataKey="shares" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm h-80">
           <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Platform Performance</h3>
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="likes" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Recent Posts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Content</th>
                <th className="px-6 py-3">Platforms</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {posts.slice(0, 5).map(post => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.image && <img src={post.image} alt="" className="w-10 h-10 rounded object-cover" />}
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">{post.content}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {post.platforms.map(p => (
                        <span key={p} className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                          {p.slice(0, 2).toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.scheduledDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      post.status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No posts yet. <Link to="/generate" className="text-primary hover:underline">Create your first campaign.</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
