'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { BioGenerator } from '@/components/BioGenerator';
import { DateIdeaGenerator } from '@/components/DateIdeaGenerator';
import { WalletConnection } from '@/components/WalletConnection';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount } from 'wagmi';
import { analytics, trackEvents, performanceMonitor } from '@/lib/analytics';
import { Sparkles, Heart, Users, Zap } from 'lucide-react';

type ActiveTab = 'bio' | 'dates';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('bio');
  const { setFrameReady } = useMiniKit();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setFrameReady();
    
    // Track page view
    analytics.page('home');
    
    // Initialize performance monitoring
    performanceMonitor.trackWebVitals();
  }, [setFrameReady]);

  // Track wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      analytics.identify(address);
      trackEvents.walletConnected(address);
    } else if (!isConnected) {
      trackEvents.walletDisconnected();
    }
  }, [isConnected, address]);

  const handleTabSwitch = (newTab: ActiveTab) => {
    trackEvents.tabSwitched(activeTab, newTab);
    setActiveTab(newTab);
  };

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
        <div className="flex space-x-2 bg-surface rounded-lg p-1 border border-gray-100">
          <Button
            variant={activeTab === 'bio' ? 'primary' : 'secondary'}
            onClick={() => handleTabSwitch('bio')}
            className="flex-1"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Bio Generator
          </Button>
          <Button
            variant={activeTab === 'dates' ? 'primary' : 'secondary'}
            onClick={() => handleTabSwitch('dates')}
            className="flex-1"
          >
            <Heart className="w-4 h-4 mr-2" />
            Date Ideas
          </Button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'bio' && <BioGenerator />}
          {activeTab === 'dates' && <DateIdeaGenerator />}
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
