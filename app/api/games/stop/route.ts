import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';
import { updateGameSession, getGameSession } from '@/lib/database';
import type { ApiResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'sessionId is required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Verify ownership
    const gameSession = await getGameSession(sessionId);
    if (gameSession.streamer_id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 403 }
      );
    }

    const updatedSession = await updateGameSession(sessionId, {
      status: 'ended',
      ended_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: updatedSession,
    } as ApiResponse);
  } catch (error) {
    console.error('Error stopping game:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
