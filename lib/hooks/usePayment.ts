'use client';

import { useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

interface PaymentConfig {
  bioGeneration: {
    price: string;
    currency: string;
  };
  dateIdeas: {
    price: string;
    currency: string;
  };
}

interface UsePaymentReturn {
  processPayment: (serviceType: 'bioGeneration' | 'dateIdeas') => Promise<string>;
  isProcessing: boolean;
  error: string | null;
  paymentConfig: PaymentConfig | null;
}

export function usePayment(): UsePaymentReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  
  const { address } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  // Fetch payment configuration
  const fetchPaymentConfig = async (): Promise<PaymentConfig> => {
    if (paymentConfig) return paymentConfig;
    
    try {
      const response = await fetch('/api/process-payment');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch payment config');
      }
      
      setPaymentConfig(result.data);
      return result.data;
    } catch (err) {
      throw new Error('Failed to load payment configuration');
    }
  };

  const processPayment = async (serviceType: 'bioGeneration' | 'dateIdeas'): Promise<string> => {
    if (!address) {
      throw new Error('Please connect your wallet first');
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get payment configuration
      const config = await fetchPaymentConfig();
      const serviceConfig = config[serviceType];
      
      if (!serviceConfig) {
        throw new Error('Invalid service type');
      }

      // For demo purposes, we'll use a fixed recipient address
      // In production, this should be your contract or treasury address
      const recipientAddress = '0x742d35Cc6634C0532925a3b8D0C9e3e0C0C0C0C0'; // Replace with actual address
      
      // Send transaction
      const txHash = await sendTransactionAsync({
        to: recipientAddress as `0x${string}`,
        value: parseEther(serviceConfig.price),
      });

      // Verify payment on backend
      const verifyResponse = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          transactionHash: txHash,
          serviceType,
        }),
      });

      const verifyResult = await verifyResponse.json();
      
      if (!verifyResult.success) {
        throw new Error(verifyResult.error || 'Payment verification failed');
      }

      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing,
    error,
    paymentConfig,
  };
}
