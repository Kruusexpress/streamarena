import { NextRequest, NextResponse } from 'next/server';
import { getGameSession, getOrCreateStreamOverlay } from '@/lib/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { ApiResponse } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const overlay = await getOrCreateStreamOverlay(session.user.id);

    return NextResponse.json({
      success: true,
      data: overlay,
    } as ApiResponse);
  } catch (error) {
    console.error('Error getting overlay:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
