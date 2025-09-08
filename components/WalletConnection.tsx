'use client';

import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { Card } from './Card';
import { Wallet as WalletIcon } from 'lucide-react';

export function WalletConnection() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <WalletIcon className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold text-text">Connect Wallet</h3>
            <p className="text-sm text-gray-500">Connect to start generating content</p>
          </div>
        </div>
        
        <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
        </Wallet>
      </div>
    </Card>
  );
}
