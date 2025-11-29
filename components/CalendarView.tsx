import React, { useState } from 'react';
import { Post, SocialPlatform } from '../types';
import { ChevronLeft, ChevronRight, Edit2, Trash2, Send, Loader2 } from 'lucide-react';
import { updatePost, deletePost, getAyrshareKey } from '../services/mockStore';
import { postToAyrshare } from '../services/ayrshareService';

interface CalendarViewProps {
  posts: Post[];
  onUpdatePosts: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ posts, onUpdatePosts }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDay }, (_, i) => i);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getPostsForDay = (day: number) => {
    return posts.filter(post => {
      const d = new Date(post.scheduledDate);
      return (
        d.getDate() === day &&
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsEditing(true);
    setPublishStatus(null);
  };

  const saveEditedPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPost) {
      updatePost(selectedPost);
      
      // If saving as Scheduled or Published, try to send to API
      if (selectedPost.status !== 'draft') {
          await handleRealPublish(selectedPost, false);
      }
      
      setIsEditing(false);
      setSelectedPost(null);
      onUpdatePosts();
    }
  };

  const handleRealPublish = async (post: Post, closeOnSuccess = true) => {
      const apiKey = getAyrshareKey();
      if (!apiKey) return; // Stay in local mode if no key

      setPublishing(true);
      setPublishStatus('Syncing with social networks...');

      try {
          await postToAyrshare(apiKey, post);
          
          // Update local status to published if successful
          const updated = { ...post, status: 'published' as const };
          updatePost(updated);
          onUpdatePosts();
          
          setPublishStatus('Successfully published!');
          if (closeOnSuccess) {
              setTimeout(() => {
                  setIsEditing(false);
                  setSelectedPost(null);
              }, 1500);
          }
      } catch (err: any) {
          console.error(err);
          setPublishStatus(`Error: ${err.message || 'Failed to publish'}`);
      } finally {
          setPublishing(false);
      }
  };

  const handleDelete = () => {
    if (selectedPost) {
       deletePost(selectedPost.id);
       setIsEditing(false);
       setSelectedPost(null);
       onUpdatePosts();
    }
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
            <ChevronLeft />
          </button>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden flex-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 dark:bg-slate-900 p-2 text-center text-sm font-semibold text-gray-500">
            {day}
          </div>
        ))}

        {padding.map(i => (
          <div key={`pad-${i}`} className="bg-white dark:bg-slate-950" />
        ))}

        {days.map(day => {
          const dayPosts = getPostsForDay(day);
          const isToday = 
            day === new Date().getDate() && 
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div key={day} className={`bg-white dark:bg-slate-950 p-2 min-h-[100px] hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors relative group border-t border-gray-100 dark:border-gray-800 ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}>{day}</div>
              <div className="space-y-1">
                {dayPosts.map(post => (
                  <button
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    className={`w-full text-left p-1.5 rounded text-xs truncate border-l-2 shadow-sm ${
                      post.status === 'published' ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                      'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-300'
                    }`}
                  >
                    {post.content}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {isEditing && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">Edit Post</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <form onSubmit={saveEditedPost} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-1">
                   {selectedPost.image && (
                     <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                       <img src={selectedPost.image} className="w-full h-full object-cover" alt="Post visual" />
                     </div>
                   )}
                   <div className="mt-2 text-xs text-gray-500">
                     Drag & drop from Asset Library (Coming Soon)
                   </div>
                 </div>
                 <div className="col-span-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scheduled Date</label>
                      <input 
                        type="datetime-local" 
                        className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        value={new Date(selectedPost.scheduledDate).toISOString().slice(0, 16)}
                        onChange={(e) => setSelectedPost({...selectedPost, scheduledDate: new Date(e.target.value).toISOString()})}
                      />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                       <select 
                         className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                         value={selectedPost.status}
                         onChange={(e) => setSelectedPost({...selectedPost, status: e.target.value as any})}
                       >
                         <option value="draft">Draft</option>
                         <option value="scheduled">Scheduled</option>
                         <option value="published">Published</option>
                       </select>
                    </div>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Caption</label>
                <textarea 
                  className="w-full px-3 py-2 rounded border h-32 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  value={selectedPost.content}
                  onChange={(e) => setSelectedPost({...selectedPost, content: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platforms</label>
                <div className="flex gap-2 flex-wrap">
                  {['facebook', 'instagram', 'linkedin', 'pinterest', 'googleBusiness'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        const newPlatforms = selectedPost.platforms.includes(p as SocialPlatform)
                          ? selectedPost.platforms.filter(pl => pl !== p)
                          : [...selectedPost.platforms, p as SocialPlatform];
                        setSelectedPost({...selectedPost, platforms: newPlatforms});
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        selectedPost.platforms.includes(p as SocialPlatform)
                          ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                          : 'bg-gray-50 border-gray-300 text-gray-500'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {publishStatus && (
                 <div className={`p-3 rounded text-sm ${publishStatus.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    {publishStatus}
                 </div>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <button 
                  type="button" 
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => handleRealPublish(selectedPost)}
                      disabled={publishing || !getAyrshareKey()}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!getAyrshareKey() ? "Add API Key in Settings to publish" : "Publish now via Ayrshare"}
                    >
                        {publishing ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
                        Publish Now
                    </button>
                    <button 
                    type="submit"
                    className="bg-primary hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                    >
                    <Edit2 size={16} /> Save Changes
                    </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};