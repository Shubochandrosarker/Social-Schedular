export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'pinterest' | 'googleBusiness';

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  connected: boolean;
  username?: string;
}

export interface Post {
  id: string;
  content: string;
  image?: string; // URL or placeholder
  platforms: SocialPlatform[];
  scheduledDate: string; // ISO string
  status: 'draft' | 'scheduled' | 'published';
  stats?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface BusinessProfile {
  name: string;
  website: string;
  description: string;
  tone: string;
  logo?: string;
}

export interface GenerationRequest {
  businessName: string;
  description: string;
  website: string;
  startDate: string;
  platformPreference: SocialPlatform[];
}

export interface Asset {
  id: string;
  url: string;
  name: string;
  createdAt: string;
}