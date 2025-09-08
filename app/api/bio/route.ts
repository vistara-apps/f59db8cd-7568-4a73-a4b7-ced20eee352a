import { NextRequest, NextResponse } from 'next/server';
import { generateDatingBio } from '@/lib/ai';
import { validateBioInput } from '@/lib/utils';
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
    const { interests, personalityTraits, lookingFor, age, walletAddress } = body;

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

    // Generate bios using AI
    const bios = await generateDatingBio({
      interests,
      personalityTraits,
      lookingFor,
      age: age ? parseInt(age) : undefined,
    });

    // Store generation in database
    await dbHelpers.recordBioGeneration(
      walletAddress,
      JSON.stringify({ interests, personalityTraits, lookingFor, age }),
      bios.join('\n---\n')
    );

    return NextResponse.json({
      success: true,
      data: bios,
      message: 'Bios generated successfully',
    });

  } catch (error) {
    console.error('Bio generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate bios. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Bio generation API endpoint' },
    { status: 200 }
  );
}
