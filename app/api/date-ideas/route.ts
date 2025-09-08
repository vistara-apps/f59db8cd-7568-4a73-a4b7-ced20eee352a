import { NextRequest, NextResponse } from 'next/server';
import { generateDateIdeas } from '@/lib/ai';
import { validateDateIdeaInput } from '@/lib/utils';
import { rateLimit } from '@/lib/rate-limit';
import { dbHelpers } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.ip ?? 'anonymous';
    const { success } = await rateLimit.limit(identifier);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

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
        { error: validation },
        { status: 400 }
      );
    }

    // Generate date ideas using AI
    const ideas = await generateDateIdeas({
      interests,
      location,
      vibe,
      budget,
    });

    // Store generation in database
    await dbHelpers.recordDateIdea(
      walletAddress,
      interests,
      location,
      ideas
    );

    return NextResponse.json({
      success: true,
      data: ideas,
      message: 'Date ideas generated successfully',
    });

  } catch (error) {
    console.error('Date idea generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate date ideas. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Date ideas generation API endpoint' },
    { status: 200 }
  );
}
