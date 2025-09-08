'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Card } from './Card';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { paymentService } from '@/lib/payment';
import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: 'bio' | 'dateIdeas';
  onPaymentSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, serviceType, onPaymentSuccess }: PaymentModalProps) {
  const { address } = useAccount();
  const [paymentStep, setPaymentStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
  const [error, setError] = useState<string | null>(null);

  const { 
    data: hash, 
    sendTransaction, 
    isPending: isSending,
    error: sendError 
  } = useSendTransaction();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  });

  const cost = paymentService.getServiceCost(serviceType);
  const serviceName = paymentService.getServiceName(serviceType);

  useEffect(() => {
    if (sendError) {
      setError(sendError.message);
      setPaymentStep('error');
    }
  }, [sendError]);

  useEffect(() => {
    if (hash && !isConfirming && !isConfirmed) {
      setPaymentStep('processing');
    }
  }, [hash, isConfirming, isConfirmed]);

  useEffect(() => {
    if (isConfirmed && hash) {
      handlePaymentVerification(hash);
    }
  }, [isConfirmed, hash]);

  const handlePaymentVerification = async (transactionHash: string) => {
    try {
      const result = await paymentService.verifyPayment(
        address!,
        transactionHash,
        serviceType
      );

      if (result.success) {
        setPaymentStep('success');
        setTimeout(() => {
          onPaymentSuccess();
          onClose();
          resetModal();
        }, 2000);
      } else {
        setError(result.error || 'Payment verification failed');
        setPaymentStep('error');
      }
    } catch (err) {
      setError('Failed to verify payment');
      setPaymentStep('error');
    }
  };

  const handlePayment = async () => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setError(null);
      setPaymentStep('processing');

      await sendTransaction({
        to: '0x742d35Cc6634C0532925a3b8D0C9e3e0C0C0C0C0', // Replace with actual recipient
        value: parseEther(cost),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      setPaymentStep('error');
    }
  };

  const resetModal = () => {
    setPaymentStep('confirm');
    setError(null);
  };

  const handleClose = () => {
    if (paymentStep !== 'processing') {
      onClose();
      resetModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text">Payment Required</h3>
          {paymentStep !== 'processing' && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {paymentStep === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <CreditCard className="w-12 h-12 text-primary mx-auto" />
              <h4 className="font-medium text-text">Pay for {serviceName}</h4>
              <p className="text-sm text-gray-600">
                Complete your payment to generate personalized content
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Service:</span>
                <span className="text-sm font-medium text-text">{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cost:</span>
                <span className="text-sm font-medium text-text">{cost} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Network:</span>
                <span className="text-sm font-medium text-text">Base</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              onClick={handlePayment}
              className="w-full"
              disabled={!address || isSending}
              isLoading={isSending}
            >
              {isSending ? 'Confirming Payment...' : `Pay ${cost} ETH`}
            </Button>
          </div>
        )}

        {paymentStep === 'processing' && (
          <div className="text-center space-y-4">
            <LoadingSpinner />
            <div>
              <h4 className="font-medium text-text mb-2">Processing Payment</h4>
              <p className="text-sm text-gray-600">
                {isConfirming ? 'Confirming transaction...' : 'Verifying payment...'}
              </p>
            </div>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <div>
              <h4 className="font-medium text-text mb-2">Payment Successful!</h4>
              <p className="text-sm text-gray-600">
                Your {serviceName.toLowerCase()} will begin shortly...
              </p>
            </div>
          </div>
        )}

        {paymentStep === 'error' && (
          <div className="space-y-4">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <div>
                <h4 className="font-medium text-text mb-2">Payment Failed</h4>
                <p className="text-sm text-gray-600 mb-4">
                  {error || 'Something went wrong with your payment'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  resetModal();
                  setPaymentStep('confirm');
                }}
                className="flex-1"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
