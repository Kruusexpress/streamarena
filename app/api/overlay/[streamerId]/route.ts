import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/database';
import type { ApiResponse } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { streamerId: string } }
) {
  try {
    const { streamerId } = params;

    // Verify overlay token
    const token = req.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing token' } as ApiResponse,
        { status: 400 }
      );
    }

    const { data: overlay, error } = await supabaseServer
      .from('stream_overlays')
      .select('*')
      .eq('streamer_id', streamerId)
      .eq('token', token)
      .single();

    if (error || !overlay) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' } as ApiResponse,
        { status: 401 }
      );
    }

    // Get active game session
    const { data: gameSession } = await supabaseServer
      .from('game_sessions')
      .select('*')
      .eq('streamer_id', streamerId)
      .eq('status', 'active')
      .single();

    return NextResponse.json({
      success: true,
      data: {
        overlay,
        gameSession,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error getting overlay data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
