'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GameSession {
  id: string;
  gameType: string;
  status: string;
  players: any[];
  scores: Record<string, number>;
}

export const DashboardHeader = () => {
  const { data: session } = useSession();
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // This would fetch active game sessions
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {session?.user?.name}!</h1>
        <p className="text-gray-400">Manage your games and engage with your Twitch viewers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Games Played</p>
              <p className="text-3xl font-bold text-white mt-2">12</p>
            </div>
            <div className="text-4xl">🎮</div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Viewers Engaged</p>
              <p className="text-3xl font-bold text-white mt-2">2,345</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Streak</p>
              <p className="text-3xl font-bold text-neon-cyan mt-2">7 days</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </Card>
      </div>
    </div>
  );
};
