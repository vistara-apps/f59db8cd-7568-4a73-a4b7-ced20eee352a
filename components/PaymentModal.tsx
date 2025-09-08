'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Card } from './Card';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: 'bio' | 'date-ideas';
  onPaymentSuccess: () => void;
}

const PAYMENT_CONFIG = {
  bio: {
    cost: '0.001',
    title: 'AI Bio Generation',
    description: 'Generate 3 unique, engaging dating app bios',
  },
  'date-ideas': {
    cost: '0.001',
    title: 'Personalized Date Ideas',
    description: 'Get 4 creative, tailored date ideas',
  },
};

export function PaymentModal({ isOpen, onClose, serviceType, onPaymentSuccess }: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const config = PAYMENT_CONFIG[serviceType];
  const recipientAddress = process.env.NEXT_PUBLIC_PAYMENT_RECIPIENT_ADDRESS as `0x${string}`;

  const handlePayment = async () => {
    if (!address || !recipientAddress) {
      setError('Wallet not connected or recipient address not configured');
      return;
    }

    try {
      setPaymentStatus('pending');
      setError(null);

      // Send ETH transaction
      writeContract({
        to: recipientAddress,
        value: parseEther(config.cost),
        data: '0x',
      });

    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
      setPaymentStatus('error');
    }
  };

  const verifyPayment = async () => {
    if (!hash) return;

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionHash: hash,
          serviceType,
          walletAddress: address,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentStatus('success');
        setTimeout(() => {
          onPaymentSuccess();
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Payment verification failed');
        setPaymentStatus('error');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError('Failed to verify payment');
      setPaymentStatus('error');
    }
  };

  // Auto-verify payment when transaction is confirmed
  if (isConfirmed && paymentStatus === 'pending') {
    verifyPayment();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text">Complete Payment</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Service Details */}
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-text">{config.title}</h3>
            <p className="text-sm text-gray-600">{config.description}</p>
            <div className="text-2xl font-bold text-primary">{config.cost} ETH</div>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'idle' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Secure Payment on Base Network</p>
                    <p className="text-blue-700 mt-1">
                      Your payment will be processed securely on the Base blockchain.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full"
                disabled={!address || isPending}
              >
                {isPending ? 'Processing...' : `Pay ${config.cost} ETH`}
              </Button>
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className="text-center space-y-4">
              <LoadingSpinner />
              <div>
                <p className="font-medium text-text">Processing Payment...</p>
                <p className="text-sm text-gray-600 mt-1">
                  {isConfirming ? 'Confirming transaction...' : 'Waiting for confirmation...'}
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <p className="font-medium text-text">Payment Successful!</p>
                <p className="text-sm text-gray-600 mt-1">
                  Your service will be activated shortly.
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-red-900">Payment Failed</p>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  setPaymentStatus('idle');
                  setError(null);
                }}
                variant="secondary"
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Transaction Hash */}
          {hash && (
            <div className="text-center">
              <p className="text-xs text-gray-500">Transaction Hash:</p>
              <p className="text-xs font-mono text-gray-700 break-all">{hash}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
