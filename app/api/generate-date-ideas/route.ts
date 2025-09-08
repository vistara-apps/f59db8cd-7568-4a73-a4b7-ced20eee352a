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
        { error: validation },
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

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Date ideas generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate date ideas. Please try again.' },
      { status: 500 }
    );
  }
}
