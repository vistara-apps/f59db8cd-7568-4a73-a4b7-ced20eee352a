'use client';

import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { PaymentRequest, formatPaymentAmount } from '@/lib/payments';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentRequest: PaymentRequest;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  paymentRequest,
  onPaymentSuccess,
  onPaymentError,
}: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const { address, isConnected } = useAccount();
  
  const { sendTransaction, data: hash, error: sendError } = useSendTransaction();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePayment = async () => {
    if (!isConnected || !address) {
      onPaymentError('Please connect your wallet first');
      return;
    }

    try {
      setPaymentStatus('pending');
      
      await sendTransaction({
        to: paymentRequest.recipient as `0x${string}`,
        value: paymentRequest.amount,
      });
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      onPaymentError(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  // Handle transaction confirmation
  if (isConfirmed && paymentStatus !== 'success') {
    setPaymentStatus('success');
    onPaymentSuccess();
  }

  // Handle transaction errors
  if (sendError && paymentStatus !== 'error') {
    setPaymentStatus('error');
    onPaymentError(sendError.message);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text">Complete Payment</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-center space-y-2">
            <CreditCard className="w-12 h-12 text-primary mx-auto" />
            <h4 className="font-medium text-text">{paymentRequest.description}</h4>
            <p className="text-2xl font-bold text-primary">
              {formatPaymentAmount(paymentRequest.amount)}
            </p>
            <p className="text-sm text-gray-600">
              Payment will be processed on Base network
            </p>
          </div>

          {paymentStatus === 'idle' && (
            <Button
              onClick={handlePayment}
              className="w-full"
              disabled={!isConnected}
            >
              {isConnected ? 'Pay with ETH' : 'Connect Wallet First'}
            </Button>
          )}

          {paymentStatus === 'pending' && (
            <div className="text-center space-y-2">
              <LoadingSpinner />
              <p className="text-sm text-gray-600">
                {isConfirming ? 'Confirming transaction...' : 'Processing payment...'}
              </p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center space-y-2">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <p className="font-medium text-green-600">Payment Successful!</p>
              <p className="text-sm text-gray-600">
                Your AI generation will begin shortly
              </p>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="text-center space-y-2">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <p className="font-medium text-red-600">Payment Failed</p>
              <Button
                onClick={() => setPaymentStatus('idle')}
                variant="secondary"
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            <p>Secure payment powered by Base blockchain</p>
            <p>Transaction fees may apply</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
