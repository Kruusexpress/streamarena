'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Game {
  type: string;
  name: string;
  description: string;
  icon: string;
}

export const GameSelector = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/games/list');
        const data = await res.json();
        if (data.success) {
          setGames(data.data);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <div className="text-white">Loading games...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Choose a Game</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map((game, index) => (
          <motion.div
            key={game.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/games/${game.type}`}>
              <Card hover className="cursor-pointer h-full">
                <div className="text-center">
                  <div className="text-5xl mb-4">{game.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{game.description}</p>
                  <Badge variant="primary">Play Now</Badge>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
