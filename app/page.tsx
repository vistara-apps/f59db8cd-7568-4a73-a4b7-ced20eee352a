'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { BioGenerator } from '@/components/BioGenerator';
import { DateIdeaGenerator } from '@/components/DateIdeaGenerator';
import { UserProfile } from '@/components/UserProfile';
import { WalletConnection } from '@/components/WalletConnection';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Sparkles, Heart, Users, Zap, User } from 'lucide-react';

type ActiveTab = 'bio' | 'dates' | 'profile';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('bio');
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Hero Section */}
        <Card>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-text">Welcome to SoulConnect</h1>
            </div>
            <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
              Use AI to craft compelling dating profiles and discover personalized date ideas 
              that spark meaningful connections.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-text">1K+</div>
                <div className="text-sm text-gray-500">Profiles Created</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="w-5 h-5 text-accent" />
                </div>
                <div className="text-2xl font-bold text-text">500+</div>
                <div className="text-sm text-gray-500">Date Ideas</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-text">AI</div>
                <div className="text-sm text-gray-500">Powered</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Wallet Connection */}
        <WalletConnection />

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-surface rounded-lg p-1 border border-gray-100">
          <Button
            variant={activeTab === 'bio' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('bio')}
            className="flex-1"
            size="sm"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Bio Generator</span>
            <span className="sm:hidden">Bio</span>
          </Button>
          <Button
            variant={activeTab === 'dates' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('dates')}
            className="flex-1"
            size="sm"
          >
            <Heart className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Date Ideas</span>
            <span className="sm:hidden">Dates</span>
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('profile')}
            className="flex-1"
            size="sm"
          >
            <User className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Profile</span>
            <span className="sm:hidden">Profile</span>
          </Button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'bio' && <BioGenerator />}
          {activeTab === 'dates' && <DateIdeaGenerator />}
          {activeTab === 'profile' && <UserProfile />}
        </div>

        {/* Features Overview */}
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">How It Works</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-text">Share Your Personality</h4>
                <p className="text-sm text-gray-600">Tell us about your interests, traits, and what you're looking for</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-text">AI Creates Magic</h4>
                <p className="text-sm text-gray-600">Our AI generates personalized bios and date ideas just for you</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-text">Start Connecting</h4>
                <p className="text-sm text-gray-600">Use your new profile and date ideas to make meaningful connections</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
