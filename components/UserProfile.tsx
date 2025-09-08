'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card } from './Card';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { User, History, Clock, Copy, Heart } from 'lucide-react';

interface UserStats {
  totalBioGenerations: number;
  totalDateIdeas: number;
  joinDate: string;
  lastActivity: string;
}

interface GenerationHistory {
  id: string;
  type: 'bio' | 'dateIdea';
  content: string;
  timestamp: string;
}

export function UserProfile() {
  const { address, isConnected } = useAccount();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'history'>('stats');

  useEffect(() => {
    if (isConnected && address) {
      loadUserData();
    }
  }, [isConnected, address]);

  const loadUserData = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      // In a real app, you would fetch user data from your API
      // For demo purposes, we'll simulate this data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalBioGenerations: Math.floor(Math.random() * 10) + 1,
        totalDateIdeas: Math.floor(Math.random() * 8) + 1,
        joinDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      });

      // Simulate generation history
      const mockHistory: GenerationHistory[] = [
        {
          id: '1',
          type: 'bio',
          content: 'Adventure-seeking photographer who believes the best stories are found off the beaten path...',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          type: 'dateIdea',
          content: 'Sunset Photography Walk at Golden Gate Park - Capture the golden hour together...',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      setHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600">
            Connect your wallet to view your profile and generation history
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <User className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-text">Your Profile</h2>
        </div>

        {/* Wallet Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected Wallet</p>
              <p className="font-mono text-sm text-text">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(address || '')}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1 mb-6">
          <Button
            variant={activeTab === 'stats' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('stats')}
            className="flex-1"
            size="sm"
          >
            Stats
          </Button>
          <Button
            variant={activeTab === 'history' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('history')}
            className="flex-1"
            size="sm"
          >
            History
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <LoadingSpinner />
            <p className="text-sm text-gray-600 mt-2">Loading your data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'stats' && stats && (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary bg-opacity-5 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stats.totalBioGenerations}
                  </div>
                  <div className="text-sm text-gray-600">Bios Created</div>
                </div>
                
                <div className="text-center p-4 bg-accent bg-opacity-5 rounded-lg">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {stats.totalDateIdeas}
                  </div>
                  <div className="text-sm text-gray-600">Date Ideas</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-text mb-1">
                    {stats.joinDate}
                  </div>
                  <div className="text-sm text-gray-600">Member Since</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-text mb-1">
                    {stats.lastActivity}
                  </div>
                  <div className="text-sm text-gray-600">Last Active</div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No generation history yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Start creating bios and date ideas to see your history here
                    </p>
                  </div>
                ) : (
                  history.map((item) => (
                    <Card key={item.id} variant="elevated">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {item.type === 'bio' ? (
                              <User className="w-4 h-4 text-primary" />
                            ) : (
                              <Heart className="w-4 h-4 text-accent" />
                            )}
                            <span className="text-sm font-medium text-text">
                              {item.type === 'bio' ? 'Bio Generation' : 'Date Idea'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {item.content.length > 150 
                            ? `${item.content.slice(0, 150)}...` 
                            : item.content
                          }
                        </p>
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => copyToClipboard(item.content)}
                          className="w-full"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
