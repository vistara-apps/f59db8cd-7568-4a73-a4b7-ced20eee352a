// Local storage utilities for user data and generation history
// In a production app, this would be replaced with a proper database

export interface UserProfile {
  walletAddress: string;
  preferences: {
    interests: string[];
    personalityTraits: string[];
    location: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BioGeneration {
  id: string;
  userId: string;
  input: {
    interests: string[];
    personalityTraits: string[];
    lookingFor: string;
    age?: number;
  };
  generatedBios: string[];
  timestamp: string;
  paymentHash?: string;
}

export interface DateIdeaGeneration {
  id: string;
  userId: string;
  input: {
    interests: string[];
    location: string;
    vibe: string;
    budget?: string;
  };
  generatedIdeas: Array<{
    title: string;
    description: string;
    category: string;
    estimatedCost: string;
    duration: string;
  }>;
  timestamp: string;
  paymentHash?: string;
}

// User Profile Management
export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`soulconnect_profile_${profile.walletAddress}`, JSON.stringify(profile));
}

export function getUserProfile(walletAddress: string): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(`soulconnect_profile_${walletAddress}`);
  return stored ? JSON.parse(stored) : null;
}

// Bio Generation History
export function saveBioGeneration(generation: BioGeneration): void {
  if (typeof window === 'undefined') return;
  const key = `soulconnect_bios_${generation.userId}`;
  const existing = getBioGenerations(generation.userId);
  const updated = [generation, ...existing].slice(0, 10); // Keep last 10
  localStorage.setItem(key, JSON.stringify(updated));
}

export function getBioGenerations(userId: string): BioGeneration[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`soulconnect_bios_${userId}`);
  return stored ? JSON.parse(stored) : [];
}

// Date Idea Generation History
export function saveDateIdeaGeneration(generation: DateIdeaGeneration): void {
  if (typeof window === 'undefined') return;
  const key = `soulconnect_dates_${generation.userId}`;
  const existing = getDateIdeaGenerations(generation.userId);
  const updated = [generation, ...existing].slice(0, 10); // Keep last 10
  localStorage.setItem(key, JSON.stringify(updated));
}

export function getDateIdeaGenerations(userId: string): DateIdeaGeneration[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`soulconnect_dates_${userId}`);
  return stored ? JSON.parse(stored) : [];
}

// Utility functions
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function clearUserData(walletAddress: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`soulconnect_profile_${walletAddress}`);
  localStorage.removeItem(`soulconnect_bios_${walletAddress}`);
  localStorage.removeItem(`soulconnect_dates_${walletAddress}`);
}
