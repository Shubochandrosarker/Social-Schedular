import { Post, SocialPlatform } from '../types';

const API_URL = 'https://app.ayrshare.com/api';

// Map internal types to Ayrshare API types
const PLATFORM_MAP: Record<SocialPlatform, string> = {
  facebook: 'facebook',
  instagram: 'instagram',
  linkedin: 'linkedin',
  pinterest: 'pinterest',
  googleBusiness: 'gmb', // Ayrshare uses 'gmb' for Google Business
};

export const getAyrshareProfile = async (apiKey: string) => {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
        throw new Error('Failed to verify API key');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Ayrshare profile:', error);
    throw error;
  }
};

export const postToAyrshare = async (apiKey: string, post: Post) => {
  // Convert internal platform names to Ayrshare specific codes
  const platforms = post.platforms.map(p => PLATFORM_MAP[p] || p);
  
  const body = {
    post: post.content,
    platforms: platforms,
    mediaUrls: post.image ? [post.image] : [],
    scheduleDate: post.scheduledDate, 
    autoSchedule: false
  };

  console.log("Sending to Ayrshare:", body);

  try {
    const response = await fetch(`${API_URL}/post`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    if (data.status === 'error') {
        throw new Error(data.message || 'Error posting to social networks');
    }
    return data;
  } catch (error) {
    console.error('Error posting to Ayrshare:', error);
    throw error;
  }
};