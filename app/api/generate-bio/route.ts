import { NextRequest, NextResponse } from 'next/server';
import { generateDatingBio } from '@/lib/ai';
import { validateBioInput } from '@/lib/utils';
import { recordBioGeneration } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
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
        { success: false, error: validation },
        { status: 400 }
      );
    }

    // Generate bios
    const bios = await generateDatingBio({
      interests,
      personalityTraits,
      lookingFor,
      age: age ? parseInt(age) : undefined,
    });

    // Record generation in database if wallet address provided
    if (walletAddress) {
      await recordBioGeneration(walletAddress, {
        interests,
        personalityTraits,
        lookingFor,
        age,
      }, bios);
    }

    return NextResponse.json({
      success: true,
      data: bios,
    });
  } catch (error) {
    console.error('Bio generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate bios' 
      },
      { status: 500 }
    );
  }
}
