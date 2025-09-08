import { NextRequest, NextResponse } from 'next/server';
import { generateDateIdeas } from '@/lib/ai';
import { validateDateIdeaInput } from '@/lib/utils';
import { recordDateIdeaGeneration } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interests, location, vibe, budget, walletAddress } = body;

    // Validate input
    const validation = validateDateIdeaInput({
      interests: interests || [],
      location: location || '',
      vibe: vibe || '',
    });

    if (validation) {
      return NextResponse.json(
        { success: false, error: validation },
        { status: 400 }
      );
    }

    // Generate date ideas
    const ideas = await generateDateIdeas({
      interests,
      location,
      vibe,
      budget,
    });

    // Record generation in database if wallet address provided
    if (walletAddress) {
      await recordDateIdeaGeneration(walletAddress, {
        interests,
        location,
        vibe,
        budget,
      }, ideas);
    }

    return NextResponse.json({
      success: true,
      data: ideas,
    });
  } catch (error) {
    console.error('Date ideas generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate date ideas' 
      },
      { status: 500 }
    );
  }
}
