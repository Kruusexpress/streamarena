import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';
import { createGameSession } from '@/lib/database';
import { createGame } from '@/games';
import type { ApiResponse, GameType } from '@/types';

const games = new Map();

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
    const { gameType, duration = 30, settings = {} } = body;

    if (!gameType) {
      return NextResponse.json(
        { success: false, error: 'gameType is required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Create database session
    const dbSession = await createGameSession(session.user.id, gameType as GameType, {
      duration,
      ...settings,
    });

    // Create game instance
    const game = createGame(dbSession.id, session.user.id, gameType as GameType, {
      type: gameType,
      duration,
      settings,
    });

    games.set(dbSession.id, game);

    return NextResponse.json({
      success: true,
      data: {
        sessionId: dbSession.id,
        gameType,
        status: 'idle',
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error creating game session:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
