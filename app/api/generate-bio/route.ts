import { NextRequest, NextResponse } from 'next/server';
import { generateDatingBio } from '@/lib/ai';
import { validateBioInput } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interests, personalityTraits, lookingFor, age } = body;

    // Validate input
    const validation = validateBioInput({
      interests: interests || [],
      personalityTraits: personalityTraits || [],
      lookingFor: lookingFor || '',
    });

    if (validation) {
      return NextResponse.json(
        { error: validation },
        { status: 400 }
      );
    }

    // Generate bios
    const bios = await generateDatingBio({
      interests,
      personalityTraits,
      lookingFor,
      age,
    });

    return NextResponse.json({ bios });
  } catch (error) {
    console.error('Bio generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate bios. Please try again.' },
      { status: 500 }
    );
  }
}
