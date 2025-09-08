'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { User, ProfileData, UserPreferences } from '@/lib/types';

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  saveUserData: (data: { profileData?: ProfileData; preferences?: UserPreferences }) => Promise<void>;
  deleteUserData: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { address, isConnected } = useAccount();

  // Fetch user data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [address, isConnected]);

  const fetchUser = async (): Promise<void> => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/user?walletAddress=${address}`);
      const result = await response.json();

      if (response.status === 404) {
        // User doesn't exist yet, that's okay
        setUser(null);
        return;
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch user data');
      }

      setUser(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user data';
      setError(errorMessage);
      console.error('User fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async (data: { 
    profileData?: ProfileData; 
    preferences?: UserPreferences 
  }): Promise<void> => {
    if (!address) {
      throw new Error('Please connect your wallet first');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          ...data,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save user data');
      }

      setUser(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save user data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUserData = async (): Promise<void> => {
    if (!address) {
      throw new Error('Please connect your wallet first');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/user?walletAddress=${address}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete user data');
      }

      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    await fetchUser();
  };

  return {
    user,
    isLoading,
    error,
    saveUserData,
    deleteUserData,
    refreshUser,
  };
}
