import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client-side Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role key
export const supabaseServer = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Get or create user in database
 */
export async function getOrCreateUser(email: string, name: string, avatar?: string) {
  const { data, error } = await supabaseServer
    .from('users')
    .upsert(
      {
        email,
        name,
        avatar,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'email',
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create or update Twitch account
 */
export async function upsertTwitchAccount(
  userId: string,
  twitchId: string,
  twitchUsername: string,
  displayName: string,
  accessToken: string,
  refreshToken?: string,
  profileImageUrl?: string
) {
  const { data, error } = await supabaseServer
    .from('twitch_accounts')
    .upsert(
      {
        user_id: userId,
        twitch_id: twitchId,
        twitch_username: twitchUsername,
        display_name: displayName,
        profile_image_url: profileImageUrl,
        access_token: accessToken,
        refresh_token: refreshToken,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'twitch_id',
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get Twitch account by user ID
 */
export async function getTwitchAccountByUserId(userId: string) {
  const { data, error } = await supabaseServer
    .from('twitch_accounts')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/**
 * Create game session
 */
export async function createGameSession(
  streamerId: string,
  gameType: 'trivia' | 'guess-number' | 'spin-wheel' | 'reaction',
  settings: Record<string, any>
) {
  const { data, error } = await supabaseServer
    .from('game_sessions')
    .insert([
      {
        streamer_id: streamerId,
        game_type: gameType,
        status: 'idle',
        players: [],
        scores: {},
        settings,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update game session
 */
export async function updateGameSession(
  sessionId: string,
  updates: Record<string, any>
) {
  const { data, error } = await supabaseServer
    .from('game_sessions')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get game session by ID
 */
export async function getGameSession(sessionId: string) {
  const { data, error } = await supabaseServer
    .from('game_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create or get stream overlay
 */
export async function getOrCreateStreamOverlay(streamerId: string) {
  const { data: existing } = await supabaseServer
    .from('stream_overlays')
    .select('*')
    .eq('streamer_id', streamerId)
    .single();

  if (existing) return existing;

  const token = `overlay_${streamerId}_${Date.now()}`;
  const { data, error } = await supabaseServer
    .from('stream_overlays')
    .insert([
      {
        streamer_id: streamerId,
        token,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Add player to game session
 */
export async function addPlayerToSession(
  sessionId: string,
  username: string,
  displayName: string,
  avatar?: string
) {
  const { data: session, error: sessionError } = await supabaseServer
    .from('game_sessions')
    .select('players')
    .eq('id', sessionId)
    .single();

  if (sessionError) throw sessionError;

  const players = session?.players || [];
  const playerId = `player_${Date.now()}_${Math.random()}`;
  const newPlayer = {
    id: playerId,
    username,
    displayName,
    avatar,
    joinedAt: new Date().toISOString(),
    score: 0,
    status: 'idle',
  };

  players.push(newPlayer);

  const { data, error } = await supabaseServer
    .from('game_sessions')
    .update({ players })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Record score
 */
export async function recordScore(
  sessionId: string,
  playerId: string,
  points: number
) {
  const { data: session, error: sessionError } = await supabaseServer
    .from('game_sessions')
    .select('scores')
    .eq('id', sessionId)
    .single();

  if (sessionError) throw sessionError;

  const scores = session?.scores || {};
  scores[playerId] = (scores[playerId] || 0) + points;

  const { data, error } = await supabaseServer
    .from('game_sessions')
    .update({ scores })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
