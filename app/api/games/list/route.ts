import { getAvailableGames } from '@/games';
import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

export async function GET() {
  try {
    const games = getAvailableGames();

    return NextResponse.json({
      success: true,
      data: games,
    } as ApiResponse);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
