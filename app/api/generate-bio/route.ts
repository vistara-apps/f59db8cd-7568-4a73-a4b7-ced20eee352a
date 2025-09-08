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
        { error: validation, success: false },
        { status: 400 }
      );
    }

    // Generate bios using AI
    const bios = await generateDatingBio({
      interests,
      personalityTraits,
      lookingFor,
      age: age ? parseInt(age) : undefined,
    });

    return NextResponse.json({
      data: bios,
      success: true,
      message: 'Bios generated successfully',
    });

  } catch (error) {
    console.error('Bio generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate bios. Please try again.',
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
