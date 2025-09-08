import { NextRequest, NextResponse } from 'next/server';
import { verifyMessage } from 'viem';
import { base } from 'viem/chains';

// Payment configuration
const PAYMENT_CONFIG = {
  bioGeneration: {
    price: '0.001', // 0.001 ETH per bio generation
    currency: 'ETH',
  },
  dateIdeas: {
    price: '0.0005', // 0.0005 ETH per date idea generation
    currency: 'ETH',
  },
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
        { error: 'Missing required payment information', success: false },
        { status: 400 }
      );
    }

    // Validate service type
    if (!PAYMENT_CONFIG[serviceType as keyof typeof PAYMENT_CONFIG]) {
      return NextResponse.json(
        { error: 'Invalid service type', success: false },
        { status: 400 }
      );
    }

    // Verify signature if provided (for additional security)
    if (signature && message) {
      try {
        const isValid = await verifyMessage({
          address: walletAddress as `0x${string}`,
          message,
          signature: signature as `0x${string}`,
        });

        if (!isValid) {
          return NextResponse.json(
            { error: 'Invalid signature', success: false },
            { status: 401 }
          );
        }
      } catch (error) {
        console.error('Signature verification error:', error);
        return NextResponse.json(
          { error: 'Signature verification failed', success: false },
          { status: 401 }
        );
      }
    }

    // In a production app, you would:
    // 1. Verify the transaction on Base blockchain
    // 2. Check the transaction amount matches the service price
    // 3. Store the payment record in your database
    // 4. Update user's credit/usage balance

    // For now, we'll simulate payment verification
    const paymentRecord = {
      id: `payment_${Date.now()}`,
      walletAddress,
      transactionHash,
      serviceType,
      amount: PAYMENT_CONFIG[serviceType as keyof typeof PAYMENT_CONFIG].price,
      currency: PAYMENT_CONFIG[serviceType as keyof typeof PAYMENT_CONFIG].currency,
      status: 'confirmed',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      data: paymentRecord,
      success: true,
      message: 'Payment processed successfully',
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process payment. Please try again.',
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    data: PAYMENT_CONFIG,
    success: true,
    message: 'Payment configuration retrieved',
  });
}
