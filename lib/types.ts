export interface User {
  userId: string;
  walletAddress: string;
  profileData?: ProfileData;
  preferences?: UserPreferences;
  creationDate: Date;
}

export interface ProfileData {
  interests: string[];
  personalityTraits: string[];
  lookingFor: string;
  age?: number;
  location?: string;
}

export interface UserPreferences {
  dateVibes: string[];
  budgetRange: string;
  activityTypes: string[];
}

export interface BioGeneration {
  generationId: string;
  userId: string;
  inputPrompt: string;
  generatedBio: string;
  timestamp: Date;
}

export interface DateIdea {
  ideaId: string;
  userId: string;
  interests: string[];
  location: string;
  generatedIdeas: DateIdeaItem[];
  timestamp: Date;
}

export interface DateIdeaItem {
  title: string;
  description: string;
  category: string;
  estimatedCost: string;
  duration: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}
