import { NextRequest, NextResponse } from 'next/server';
import { generateDateIdeas } from '@/lib/ai';
import { validateDateIdeaInput } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interests, location, vibe, budget } = body;

    // Validate input
    const validation = validateDateIdeaInput({
      interests: interests || [],
      location: location || '',
      vibe: vibe || '',
    });

    if (validation) {
      return NextResponse.json(
        { error: validation, success: false },
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

    return NextResponse.json({
      data: ideas,
      success: true,
      message: 'Date ideas generated successfully',
    });

  } catch (error) {
    console.error('Date idea generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate date ideas. Please try again.',
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed', success: false },
    { status: 405 }
  );
}
