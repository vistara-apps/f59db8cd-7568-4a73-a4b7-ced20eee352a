'use client';

import { ReactNode } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-accent" />
              <h1 className="text-xl font-bold text-text">SoulConnect</h1>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-1">
            Craft your perfect dating profile & spark meaningful connections
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-gray-100 mt-12">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-500">
            Powered by AI • Built on Base
          </p>
        </div>
      </footer>
    </div>
  );
}
