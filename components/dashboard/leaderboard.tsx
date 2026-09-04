'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  playerId: string;
  score: number;
  player?: {
    displayName: string;
    avatar?: string;
  };
}

export const Leaderboard: React.FC<{ gameId?: string }> = ({ gameId }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([
    {
      playerId: '1',
      score: 450,
      player: { displayName: 'StreamKing', avatar: '👑' },
    },
    {
      playerId: '2',
      score: 380,
      player: { displayName: 'GamerPro', avatar: '🎮' },
    },
    {
      playerId: '3',
      score: 290,
      player: { displayName: 'CoolPlayer', avatar: '😎' },
    },
  ]);

  return (
    <Card>
      <h3 className="text-xl font-bold text-white mb-4">🏆 Leaderboard</h3>
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div key={entry.playerId} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-neon-cyan w-6"># {index + 1}</span>
              <span className="text-2xl">{entry.player?.avatar}</span>
              <div>
                <p className="text-white font-semibold">{entry.player?.displayName}</p>
              </div>
            </div>
            <Badge variant="primary">{entry.score} pts</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};
