import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function validateBioInput(input: {
  interests: string[];
  personalityTraits: string[];
  lookingFor: string;
}): string | null {
  if (input.interests.length === 0) {
    return 'Please add at least one interest';
  }
  if (input.personalityTraits.length === 0) {
    return 'Please add at least one personality trait';
  }
  if (!input.lookingFor.trim()) {
    return 'Please describe what you\'re looking for';
  }
  return null;
}

export function validateDateIdeaInput(input: {
  interests: string[];
  location: string;
  vibe: string;
}): string | null {
  if (input.interests.length === 0) {
    return 'Please add at least one interest';
  }
  if (!input.location.trim()) {
    return 'Please enter your location';
  }
  if (!input.vibe.trim()) {
    return 'Please describe your desired date vibe';
  }
  return null;
}
