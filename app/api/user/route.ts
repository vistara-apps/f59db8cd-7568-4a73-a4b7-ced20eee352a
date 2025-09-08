import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';
import { User, ProfileData, UserPreferences } from '@/lib/types';

// In-memory storage for demo purposes
// In production, use a proper database like PostgreSQL, MongoDB, etc.
const users = new Map<string, User>();
const userSessions = new Map<string, string>(); // walletAddress -> userId

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, profileData, preferences } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required', success: false },
        { status: 400 }
      );
    }

    // Check if user already exists
    let userId = userSessions.get(walletAddress);
    let user: User;

    if (userId && users.has(userId)) {
      // Update existing user
      user = users.get(userId)!;
      if (profileData) {
        user.profileData = { ...user.profileData, ...profileData };
      }
      if (preferences) {
        user.preferences = { ...user.preferences, ...preferences };
      }
      users.set(userId, user);
    } else {
      // Create new user
      userId = generateId();
      user = {
        userId,
        walletAddress,
        profileData: profileData || undefined,
        preferences: preferences || undefined,
        creationDate: new Date(),
      };
      users.set(userId, user);
      userSessions.set(walletAddress, userId);
    }

    return NextResponse.json({
      data: user,
      success: true,
      message: 'User data saved successfully',
    });

  } catch (error) {
    console.error('User data error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save user data. Please try again.',
        success: false 
      },
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
        { error: 'Wallet address is required', success: false },
        { status: 400 }
      );
    }

    const userId = userSessions.get(walletAddress);
    if (!userId || !users.has(userId)) {
      return NextResponse.json(
        { error: 'User not found', success: false },
        { status: 404 }
      );
    }

    const user = users.get(userId)!;
    return NextResponse.json({
      data: user,
      success: true,
      message: 'User data retrieved successfully',
    });

  } catch (error) {
    console.error('User retrieval error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve user data. Please try again.',
        success: false 
      },
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
        { error: 'Wallet address is required', success: false },
        { status: 400 }
      );
    }

    const userId = userSessions.get(walletAddress);
    if (userId) {
      users.delete(userId);
      userSessions.delete(walletAddress);
    }

    return NextResponse.json({
      success: true,
      message: 'User data deleted successfully',
    });

  } catch (error) {
    console.error('User deletion error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete user data. Please try again.',
        success: false 
      },
      { status: 500 }
    );
  }
}
