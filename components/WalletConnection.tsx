'use client';

import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { Card } from './Card';
import { useUser } from '@/lib/hooks/useUser';
import { usePayment } from '@/lib/hooks/usePayment';
import { Wallet as WalletIcon, User, DollarSign } from 'lucide-react';

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { user, isLoading: userLoading } = useUser();
  const { paymentConfig } = usePayment();

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <WalletIcon className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold text-text">Wallet Connection</h3>
              <p className="text-sm text-gray-500">
                {isConnected ? 'Connected to Base' : 'Connect to start generating content'}
              </p>
            </div>
          </div>
          
          <Wallet>
            <ConnectWallet>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
          </Wallet>
        </div>

        {/* User Profile Status */}
        {isConnected && !userLoading && (
          <div className="flex items-center space-x-3 pt-2 border-t border-gray-100">
            <div className="w-6 h-6 bg-accent bg-opacity-10 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600">
                {user ? 'Profile data saved' : 'New user - data will be saved automatically'}
              </p>
            </div>
          </div>
        )}

        {/* Payment Info */}
        {isConnected && paymentConfig && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Service Pricing</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Bio Generation:</span>
                <span className="ml-1 font-medium">{paymentConfig.bioGeneration.price} ETH</span>
              </div>
              <div>
                <span className="text-gray-600">Date Ideas:</span>
                <span className="ml-1 font-medium">{paymentConfig.dateIdeas.price} ETH</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
