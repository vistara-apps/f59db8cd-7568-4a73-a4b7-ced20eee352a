import { NextRequest, NextResponse } from 'next/server';
import { verifyMessage } from 'viem';

// Payment configuration
const PAYMENT_CONFIG = {
  BIO_GENERATION_COST: '0.001', // ETH
  DATE_IDEAS_COST: '0.001', // ETH
  RECIPIENT_ADDRESS: '0x742d35Cc6634C0532925a3b8D0C9e3e0C0C0C0C0', // Replace with actual recipient
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      walletAddress, 
      transactionHash, 
      serviceType, 
      signature,
      message 
    } = body;

    // Validate required fields
    if (!walletAddress || !transactionHash || !serviceType) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Validate service type
    if (!['bio', 'dateIdeas'].includes(serviceType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid service type' },
        { status: 400 }
      );
    }

    // In a production app, you would:
    // 1. Verify the transaction on-chain
    // 2. Check the transaction amount matches the service cost
    // 3. Ensure the transaction is to the correct recipient address
    // 4. Store the payment record in a database
    // 5. Prevent double-spending by checking if the transaction was already used

    // For this demo, we'll simulate payment verification
    const expectedCost = serviceType === 'bio' 
      ? PAYMENT_CONFIG.BIO_GENERATION_COST 
      : PAYMENT_CONFIG.DATE_IDEAS_COST;

    // Simulate payment verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        paymentId: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: expectedCost,
        serviceType,
        walletAddress,
        transactionHash,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Payment verification failed' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      costs: PAYMENT_CONFIG,
      supportedServices: ['bio', 'dateIdeas'],
    },
  });
}
