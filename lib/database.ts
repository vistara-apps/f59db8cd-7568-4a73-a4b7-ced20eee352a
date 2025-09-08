// Database utilities for SoulConnect
// This is a production-ready database abstraction layer
// Replace with your preferred database solution (PostgreSQL, MongoDB, etc.)

import type { User, BioGeneration, DateIdea, ProfileData, UserPreferences } from './types';

// In-memory storage for development (replace with real database in production)
class InMemoryDatabase {
  private users = new Map<string, User>();
  private bioGenerations = new Map<string, BioGeneration>();
  private dateIdeas = new Map<string, DateIdea>();
  private paymentRecords = new Map<string, PaymentRecord>();

  // User operations
  async createUser(userData: Omit<User, 'userId' | 'creationDate'>): Promise<User> {
    const user: User = {
      userId: this.generateId(),
      ...userData,
      creationDate: new Date(),
    };
    
    this.users.set(user.walletAddress, user);
    return user;
  }

  async getUserByWallet(walletAddress: string): Promise<User | null> {
    return this.users.get(walletAddress) || null;
  }

  async updateUser(walletAddress: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(walletAddress);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(walletAddress, updatedUser);
    return updatedUser;
  }

  async deleteUser(walletAddress: string): Promise<boolean> {
    return this.users.delete(walletAddress);
  }

  // Bio generation operations
  async storeBioGeneration(data: Omit<BioGeneration, 'generationId' | 'timestamp'>): Promise<BioGeneration> {
    const bioGeneration: BioGeneration = {
      generationId: this.generateId(),
      ...data,
      timestamp: new Date(),
    };

    this.bioGenerations.set(bioGeneration.generationId, bioGeneration);
    return bioGeneration;
  }

  async getBioGenerationsByUser(userId: string): Promise<BioGeneration[]> {
    return Array.from(this.bioGenerations.values())
      .filter(bio => bio.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Date idea operations
  async storeDateIdea(data: Omit<DateIdea, 'ideaId' | 'timestamp'>): Promise<DateIdea> {
    const dateIdea: DateIdea = {
      ideaId: this.generateId(),
      ...data,
      timestamp: new Date(),
    };

    this.dateIdeas.set(dateIdea.ideaId, dateIdea);
    return dateIdea;
  }

  async getDateIdeasByUser(userId: string): Promise<DateIdea[]> {
    return Array.from(this.dateIdeas.values())
      .filter(idea => idea.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Payment operations
  async storePaymentRecord(data: PaymentRecord): Promise<PaymentRecord> {
    this.paymentRecords.set(data.transactionHash, data);
    return data;
  }

  async getPaymentRecord(transactionHash: string): Promise<PaymentRecord | null> {
    return this.paymentRecords.get(transactionHash) || null;
  }

  async getPaymentsByUser(walletAddress: string): Promise<PaymentRecord[]> {
    return Array.from(this.paymentRecords.values())
      .filter(payment => payment.walletAddress === walletAddress)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Analytics operations
  async getAnalytics(): Promise<DatabaseAnalytics> {
    const totalUsers = this.users.size;
    const totalBioGenerations = this.bioGenerations.size;
    const totalDateIdeas = this.dateIdeas.size;
    const totalPayments = this.paymentRecords.size;

    const totalRevenue = Array.from(this.paymentRecords.values())
      .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

    return {
      totalUsers,
      totalBioGenerations,
      totalDateIdeas,
      totalPayments,
      totalRevenue,
      averageRevenuePerUser: totalUsers > 0 ? totalRevenue / totalUsers : 0,
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

// Payment record interface
export interface PaymentRecord {
  transactionHash: string;
  walletAddress: string;
  serviceType: 'bio' | 'date-ideas';
  amount: string;
  timestamp: Date;
  verified: boolean;
}

// Analytics interface
export interface DatabaseAnalytics {
  totalUsers: number;
  totalBioGenerations: number;
  totalDateIdeas: number;
  totalPayments: number;
  totalRevenue: number;
  averageRevenuePerUser: number;
}

// Database instance
export const database = new InMemoryDatabase();

// Production database connection (example with PostgreSQL)
/*
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export class PostgreSQLDatabase {
  async createUser(userData: Omit<User, 'userId' | 'creationDate'>): Promise<User> {
    const query = `
      INSERT INTO users (wallet_address, profile_data, preferences, creation_date)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      userData.walletAddress,
      JSON.stringify(userData.profileData),
      JSON.stringify(userData.preferences),
    ]);
    
    return this.mapUserFromDB(result.rows[0]);
  }

  async getUserByWallet(walletAddress: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE wallet_address = $1';
    const result = await pool.query(query, [walletAddress]);
    
    return result.rows.length > 0 ? this.mapUserFromDB(result.rows[0]) : null;
  }

  private mapUserFromDB(row: any): User {
    return {
      userId: row.user_id,
      walletAddress: row.wallet_address,
      profileData: row.profile_data ? JSON.parse(row.profile_data) : undefined,
      preferences: row.preferences ? JSON.parse(row.preferences) : undefined,
      creationDate: row.creation_date,
    };
  }
}
*/

// Database schema for production (SQL)
export const DATABASE_SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  profile_data JSONB,
  preferences JSONB,
  creation_date TIMESTAMP DEFAULT NOW(),
  updated_date TIMESTAMP DEFAULT NOW()
);

-- Bio generations table
CREATE TABLE IF NOT EXISTS bio_generations (
  generation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  wallet_address VARCHAR(42) NOT NULL,
  input_prompt TEXT NOT NULL,
  generated_bio TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Date ideas table
CREATE TABLE IF NOT EXISTS date_ideas (
  idea_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  wallet_address VARCHAR(42) NOT NULL,
  interests TEXT[] NOT NULL,
  location VARCHAR(255) NOT NULL,
  generated_ideas JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Payment records table
CREATE TABLE IF NOT EXISTS payment_records (
  transaction_hash VARCHAR(66) PRIMARY KEY,
  wallet_address VARCHAR(42) NOT NULL,
  service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('bio', 'date-ideas')),
  amount DECIMAL(18, 8) NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_bio_generations_user ON bio_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_bio_generations_wallet ON bio_generations(wallet_address);
CREATE INDEX IF NOT EXISTS idx_date_ideas_user ON date_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_date_ideas_wallet ON date_ideas(wallet_address);
CREATE INDEX IF NOT EXISTS idx_payment_records_wallet ON payment_records(wallet_address);
CREATE INDEX IF NOT EXISTS idx_payment_records_timestamp ON payment_records(timestamp);
`;

// Export database utilities
export {
  InMemoryDatabase,
};

// Helper functions for database operations
export const dbHelpers = {
  async ensureUser(walletAddress: string, profileData?: ProfileData, preferences?: UserPreferences): Promise<User> {
    let user = await database.getUserByWallet(walletAddress);
    
    if (!user) {
      user = await database.createUser({
        walletAddress,
        profileData,
        preferences,
      });
    } else if (profileData || preferences) {
      user = await database.updateUser(walletAddress, {
        profileData: profileData ? { ...user.profileData, ...profileData } : user.profileData,
        preferences: preferences ? { ...user.preferences, ...preferences } : user.preferences,
      }) || user;
    }
    
    return user;
  },

  async recordBioGeneration(walletAddress: string, inputPrompt: string, generatedBio: string): Promise<BioGeneration> {
    const user = await dbHelpers.ensureUser(walletAddress);
    
    return database.storeBioGeneration({
      userId: user.userId,
      inputPrompt,
      generatedBio,
    });
  },

  async recordDateIdea(walletAddress: string, interests: string[], location: string, generatedIdeas: any[]): Promise<DateIdea> {
    const user = await dbHelpers.ensureUser(walletAddress);
    
    return database.storeDateIdea({
      userId: user.userId,
      interests,
      location,
      generatedIdeas,
    });
  },

  async recordPayment(transactionHash: string, walletAddress: string, serviceType: 'bio' | 'date-ideas', amount: string): Promise<PaymentRecord> {
    const paymentRecord: PaymentRecord = {
      transactionHash,
      walletAddress,
      serviceType,
      amount,
      timestamp: new Date(),
      verified: true,
    };
    
    return database.storePaymentRecord(paymentRecord);
  },
};
