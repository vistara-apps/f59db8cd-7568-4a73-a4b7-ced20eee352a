import { parseEther } from 'viem';

// Payment configuration
export const PAYMENT_CONFIG = {
  BIO_GENERATION_COST: parseEther('0.001'), // 0.001 ETH per bio generation
  DATE_IDEAS_COST: parseEther('0.0005'), // 0.0005 ETH per date ideas generation
  RECIPIENT_ADDRESS: '0x742d35Cc6634C0532925a3b8D0Ac6d7d3f8b2c1f', // Replace with actual recipient
} as const;

export interface PaymentRequest {
  amount: bigint;
  recipient: string;
  description: string;
}

export function createBioPaymentRequest(): PaymentRequest {
  return {
    amount: PAYMENT_CONFIG.BIO_GENERATION_COST,
    recipient: PAYMENT_CONFIG.RECIPIENT_ADDRESS,
    description: 'AI Bio Generation',
  };
}

export function createDateIdeasPaymentRequest(): PaymentRequest {
  return {
    amount: PAYMENT_CONFIG.DATE_IDEAS_COST,
    recipient: PAYMENT_CONFIG.RECIPIENT_ADDRESS,
    description: 'AI Date Ideas Generation',
  };
}

export function formatPaymentAmount(amount: bigint): string {
  const eth = Number(amount) / 1e18;
  return `${eth.toFixed(4)} ETH`;
}
