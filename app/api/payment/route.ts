import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';
import { dbHelpers } from '@/lib/database';

// Base network configuration
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

// Payment configuration
const PAYMENT_CONFIG = {
  BIO_GENERATION_COST: parseEther('0.001'), // 0.001 ETH
  DATE_IDEAS_COST: parseEther('0.001'), // 0.001 ETH
  RECIPIENT_ADDRESS: process.env.PAYMENT_RECIPIENT_ADDRESS as `0x${string}`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionHash, serviceType, walletAddress } = body;

    if (!transactionHash || !serviceType || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the transaction on Base network
    const transaction = await publicClient.getTransaction({
      hash: transactionHash as `0x${string}`,
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Verify transaction details
    const expectedAmount = serviceType === 'bio' 
      ? PAYMENT_CONFIG.BIO_GENERATION_COST 
      : PAYMENT_CONFIG.DATE_IDEAS_COST;

    if (transaction.value < expectedAmount) {
      return NextResponse.json(
        { error: 'Insufficient payment amount' },
        { status: 400 }
      );
    }

    if (transaction.to?.toLowerCase() !== PAYMENT_CONFIG.RECIPIENT_ADDRESS?.toLowerCase()) {
      return NextResponse.json(
        { error: 'Invalid recipient address' },
        { status: 400 }
      );
    }

    // Get transaction receipt to confirm it was successful
    const receipt = await publicClient.getTransactionReceipt({
      hash: transactionHash as `0x${string}`,
    });

    if (receipt.status !== 'success') {
      return NextResponse.json(
        { error: 'Transaction failed' },
        { status: 400 }
      );
    }

    // Store payment record in database
    await dbHelpers.recordPayment(
      transactionHash,
      walletAddress,
      serviceType,
      formatEther(transaction.value)
    );

    return NextResponse.json({
      success: true,
      data: {
        transactionHash,
        amount: formatEther(transaction.value),
        serviceType,
        verified: true,
      },
      message: 'Payment verified successfully',
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Payment verification API endpoint',
    config: {
      bioGenerationCost: formatEther(PAYMENT_CONFIG.BIO_GENERATION_COST),
      dateIdeasCost: formatEther(PAYMENT_CONFIG.DATE_IDEAS_COST),
      recipientAddress: PAYMENT_CONFIG.RECIPIENT_ADDRESS,
      network: 'Base',
    },
  });
}
