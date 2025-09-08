import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';
import type { User, ProfileData, UserPreferences } from '@/lib/types';

// In-memory storage (replace with database in production)
const users = new Map<string, User>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, profileData, preferences } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = users.get(walletAddress);
    
    if (!user) {
      // Create new user
      user = {
        userId: generateId(),
        walletAddress,
        profileData: profileData as ProfileData,
        preferences: preferences as UserPreferences,
        creationDate: new Date(),
      };
      users.set(walletAddress, user);
    } else {
      // Update existing user
      if (profileData) {
        user.profileData = { ...user.profileData, ...profileData };
      }
      if (preferences) {
        user.preferences = { ...user.preferences, ...preferences };
      }
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: user ? 'User updated successfully' : 'User created successfully',
    });

  } catch (error) {
    console.error('User management error:', error);
    return NextResponse.json(
      { error: 'Failed to manage user data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const user = users.get(walletAddress);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User retrieved successfully',
    });

  } catch (error) {
    console.error('User retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const deleted = users.delete(walletAddress);

    if (!deleted) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });

  } catch (error) {
    console.error('User deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user data' },
      { status: 500 }
    );
  }
}
