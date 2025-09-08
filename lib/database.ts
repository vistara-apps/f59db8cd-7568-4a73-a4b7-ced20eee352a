// In-memory database simulation for demo purposes
// In production, you would use a real database like PostgreSQL, MongoDB, etc.

import { User, BioGeneration, DateIdea, ProfileData, UserPreferences } from './types';

class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private bioGenerations: Map<string, BioGeneration> = new Map();
  private dateIdeas: Map<string, DateIdea> = new Map();

  // User operations
  async createUser(walletAddress: string, profileData?: ProfileData): Promise<User> {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user: User = {
      userId,
      walletAddress: walletAddress.toLowerCase(),
      profileData,
      creationDate: new Date(),
    };

    this.users.set(userId, user);
    return user;
  }

  async getUserByWallet(walletAddress: string): Promise<User | null> {
    const normalizedAddress = walletAddress.toLowerCase();
    for (const user of this.users.values()) {
      if (user.walletAddress === normalizedAddress) {
        return user;
      }
    }
    return null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Bio generation operations
  async saveBioGeneration(
    userId: string,
    inputPrompt: string,
    generatedBio: string
  ): Promise<BioGeneration> {
    const generationId = `bio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const bioGeneration: BioGeneration = {
      generationId,
      userId,
      inputPrompt,
      generatedBio,
      timestamp: new Date(),
    };

    this.bioGenerations.set(generationId, bioGeneration);
    return bioGeneration;
  }

  async getUserBioGenerations(userId: string): Promise<BioGeneration[]> {
    const generations: BioGeneration[] = [];
    for (const generation of this.bioGenerations.values()) {
      if (generation.userId === userId) {
        generations.push(generation);
      }
    }
    return generations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Date idea operations
  async saveDateIdea(
    userId: string,
    interests: string[],
    location: string,
    generatedIdeas: any[]
  ): Promise<DateIdea> {
    const ideaId = `date_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const dateIdea: DateIdea = {
      ideaId,
      userId,
      interests,
      location,
      generatedIdeas,
      timestamp: new Date(),
    };

    this.dateIdeas.set(ideaId, dateIdea);
    return dateIdea;
  }

  async getUserDateIdeas(userId: string): Promise<DateIdea[]> {
    const ideas: DateIdea[] = [];
    for (const idea of this.dateIdeas.values()) {
      if (idea.userId === userId) {
        ideas.push(idea);
      }
    }
    return ideas.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Analytics and stats
  async getStats() {
    return {
      totalUsers: this.users.size,
      totalBioGenerations: this.bioGenerations.size,
      totalDateIdeas: this.dateIdeas.size,
      recentActivity: {
        bioGenerationsToday: Array.from(this.bioGenerations.values()).filter(
          gen => gen.timestamp.toDateString() === new Date().toDateString()
        ).length,
        dateIdeasToday: Array.from(this.dateIdeas.values()).filter(
          idea => idea.timestamp.toDateString() === new Date().toDateString()
        ).length,
      }
    };
  }

  // Cleanup old data (for demo purposes)
  async cleanup(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // Remove old bio generations
    for (const [id, generation] of this.bioGenerations.entries()) {
      if (generation.timestamp < cutoffDate) {
        this.bioGenerations.delete(id);
      }
    }

    // Remove old date ideas
    for (const [id, idea] of this.dateIdeas.entries()) {
      if (idea.timestamp < cutoffDate) {
        this.dateIdeas.delete(id);
      }
    }
  }
}

// Export singleton instance
export const database = new InMemoryDatabase();

// Helper functions for common operations
export async function getOrCreateUser(walletAddress: string, profileData?: ProfileData): Promise<User> {
  let user = await database.getUserByWallet(walletAddress);
  if (!user) {
    user = await database.createUser(walletAddress, profileData);
  }
  return user;
}

export async function recordBioGeneration(
  walletAddress: string,
  inputData: any,
  generatedBios: string[]
): Promise<void> {
  const user = await getOrCreateUser(walletAddress);
  const inputPrompt = JSON.stringify(inputData);
  
  // Save each bio as a separate generation
  for (const bio of generatedBios) {
    await database.saveBioGeneration(user.userId, inputPrompt, bio);
  }
}

export async function recordDateIdeaGeneration(
  walletAddress: string,
  inputData: any,
  generatedIdeas: any[]
): Promise<void> {
  const user = await getOrCreateUser(walletAddress);
  
  await database.saveDateIdea(
    user.userId,
    inputData.interests || [],
    inputData.location || '',
    generatedIdeas
  );
}
