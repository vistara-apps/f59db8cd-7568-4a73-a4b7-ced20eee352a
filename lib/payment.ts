import { parseEther, formatEther } from 'viem';

export interface PaymentConfig {
  BIO_GENERATION_COST: string;
  DATE_IDEAS_COST: string;
  RECIPIENT_ADDRESS: string;
}

export interface PaymentRequest {
  walletAddress: string;
  serviceType: 'bio' | 'dateIdeas';
  amount: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  transactionHash?: string;
  error?: string;
}

export class PaymentService {
  private config: PaymentConfig;

  constructor() {
    this.config = {
      BIO_GENERATION_COST: '0.001',
      DATE_IDEAS_COST: '0.001',
      RECIPIENT_ADDRESS: '0x742d35Cc6634C0532925a3b8D0C9e3e0C0C0C0C0',
    };
  }

  getServiceCost(serviceType: 'bio' | 'dateIdeas'): string {
    return serviceType === 'bio' 
      ? this.config.BIO_GENERATION_COST 
      : this.config.DATE_IDEAS_COST;
  }

  getServiceCostInWei(serviceType: 'bio' | 'dateIdeas'): bigint {
    const cost = this.getServiceCost(serviceType);
    return parseEther(cost);
  }

  async getPaymentConfig(): Promise<PaymentConfig> {
    try {
      const response = await fetch('/api/payment');
      const result = await response.json();
      
      if (result.success) {
        return result.data.costs;
      }
      
      return this.config;
    } catch (error) {
      console.error('Failed to fetch payment config:', error);
      return this.config;
    }
  }

  async verifyPayment(
    walletAddress: string,
    transactionHash: string,
    serviceType: 'bio' | 'dateIdeas'
  ): Promise<PaymentResult> {
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          transactionHash,
          serviceType,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          paymentId: result.data.paymentId,
          transactionHash,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Payment verification failed',
        };
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: 'Network error during payment verification',
      };
    }
  }

  formatCost(serviceType: 'bio' | 'dateIdeas'): string {
    const cost = this.getServiceCost(serviceType);
    return `${cost} ETH`;
  }

  getServiceName(serviceType: 'bio' | 'dateIdeas'): string {
    return serviceType === 'bio' ? 'Bio Generation' : 'Date Ideas Generation';
  }
}

export const paymentService = new PaymentService();
