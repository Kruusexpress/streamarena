'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from 'react';

interface Player {
  id: string;
  displayName: string;
  avatar?: string;
  score: number;
  status: 'idle' | 'answering' | 'correct' | 'incorrect';
}

export const PlayersList: React.FC<{ players: Player[] }> = ({ players }) => {
  const getStatusColor = (status: Player['status']) => {
    switch (status) {
      case 'correct':
        return 'bg-green-500/20 text-green-400';
      case 'incorrect':
        return 'bg-red-500/20 text-red-400';
      case 'answering':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-white mb-4">Players ({players.length})</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {players.map((player) => (
          <div key={player.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg hover:bg-dark-tertiary transition">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{player.avatar || '👤'}</span>
              <div>
                <p className="text-white font-semibold">{player.displayName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={player.status === 'correct' ? 'success' : 'primary'}>
                {player.score} pts
              </Badge>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(player.status)}`}>
                {player.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
