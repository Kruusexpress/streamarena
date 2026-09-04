export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          name?: string;
          avatar?: string | null;
          updated_at?: string;
        };
      };
      twitch_accounts: {
        Row: {
          id: string;
          user_id: string;
          twitch_id: string;
          twitch_username: string;
          display_name: string;
          profile_image_url: string | null;
          access_token: string;
          refresh_token: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          twitch_id: string;
          twitch_username: string;
          display_name: string;
          profile_image_url?: string | null;
          access_token: string;
          refresh_token?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string;
          profile_image_url?: string | null;
          access_token?: string;
          refresh_token?: string | null;
          expires_at?: string | null;
          updated_at?: string;
        };
      };
      game_sessions: {
        Row: {
          id: string;
          streamer_id: string;
          game_type: 'trivia' | 'guess-number' | 'spin-wheel' | 'reaction';
          status: 'idle' | 'starting' | 'active' | 'ending' | 'ended';
          players: any[];
          scores: Record<string, number>;
          winner: string | null;
          settings: Record<string, any>;
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          streamer_id: string;
          game_type: 'trivia' | 'guess-number' | 'spin-wheel' | 'reaction';
          status?: 'idle' | 'starting' | 'active' | 'ending' | 'ended';
          players?: any[];
          scores?: Record<string, number>;
          winner?: string | null;
          settings: Record<string, any>;
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'idle' | 'starting' | 'active' | 'ending' | 'ended';
          players?: any[];
          scores?: Record<string, number>;
          winner?: string | null;
          settings?: Record<string, any>;
          started_at?: string | null;
          ended_at?: string | null;
          updated_at?: string;
        };
      };
      stream_overlays: {
        Row: {
          id: string;
          streamer_id: string;
          token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          streamer_id: string;
          token: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          token?: string;
          updated_at?: string;
        };
      };
    };
  };
}
