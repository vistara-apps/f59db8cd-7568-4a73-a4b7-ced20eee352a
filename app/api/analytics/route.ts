import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const stats = await database.getStats();
    
    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        // Add some demo metrics for the UI
        metrics: {
          profilesCreated: stats.totalBioGenerations,
          dateIdeasGenerated: stats.totalDateIdeas,
          activeUsers: stats.totalUsers,
          successRate: '94%', // Demo metric
          averageRating: 4.8, // Demo metric
        }
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics data' 
      },
      { status: 500 }
    );
  }
}
