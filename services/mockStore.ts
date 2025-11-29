import { Post, SocialAccount, BusinessProfile } from "../types";

// Keys for localStorage
const POSTS_KEY = 'markyclone_posts';
const PROFILE_KEY = 'markyclone_profile';
const ACCOUNTS_KEY = 'markyclone_accounts';
const AYRSHARE_KEY_STORAGE = 'markyclone_ayrshare_key';

const DEFAULT_ACCOUNTS: SocialAccount[] = [
  { id: '1', platform: 'facebook', connected: false },
  { id: '2', platform: 'instagram', connected: false },
  { id: '3', platform: 'linkedin', connected: false },
  { id: '4', platform: 'pinterest', connected: false },
  { id: '5', platform: 'googleBusiness', connected: false },
];

export const getStoredPosts = (): Post[] => {
  const data = localStorage.getItem(POSTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePosts = (posts: Post[]) => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

export const addPosts = (newPosts: Post[]) => {
  const current = getStoredPosts();
  const updated = [...current, ...newPosts];
  savePosts(updated);
  return updated;
};

export const updatePost = (updatedPost: Post) => {
  const current = getStoredPosts();
  const index = current.findIndex(p => p.id === updatedPost.id);
  if (index !== -1) {
    current[index] = updatedPost;
    savePosts(current);
  }
  return current;
};

export const deletePost = (postId: string) => {
    const current = getStoredPosts();
    const updated = current.filter(p => p.id !== postId);
    savePosts(updated);
    return updated;
};

export const getProfile = (): BusinessProfile | null => {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveProfile = (profile: BusinessProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getAccounts = (): SocialAccount[] => {
  const data = localStorage.getItem(ACCOUNTS_KEY);
  return data ? JSON.parse(data) : DEFAULT_ACCOUNTS;
};

export const saveAccounts = (accounts: SocialAccount[]) => {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const toggleAccount = (id: string, connected: boolean) => {
  const accounts = getAccounts();
  const index = accounts.findIndex(a => a.id === id);
  if (index !== -1) {
    accounts[index].connected = connected;
    accounts[index].username = connected ? `user_${Math.floor(Math.random() * 9999)}` : undefined;
    saveAccounts(accounts);
  }
  return accounts;
};

// API Key Management
export const getAyrshareKey = (): string => {
    return localStorage.getItem(AYRSHARE_KEY_STORAGE) || '';
}

export const saveAyrshareKey = (key: string) => {
    localStorage.setItem(AYRSHARE_KEY_STORAGE, key);
}
