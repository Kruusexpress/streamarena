import { TriviaGame } from './trivia/trivia-game';
import { GuessNumberGame } from './guess-number/guess-number-game';
import { SpinWheelGame } from './spin-wheel/spin-wheel-game';
import { ReactionGame } from './reaction/reaction-game';
import type { GameConfig, GameType } from '@/types';
import { BaseGame } from './base-game';

/**
 * Game factory to create game instances
 */
export function createGame(
  gameId: string,
  streamerId: string,
  gameType: GameType,
  config: GameConfig
): BaseGame {
  switch (gameType) {
    case 'trivia':
      return new TriviaGame(gameId, streamerId, config);
    case 'guess-number':
      return new GuessNumberGame(gameId, streamerId, config);
    case 'spin-wheel':
      return new SpinWheelGame(gameId, streamerId, config);
    case 'reaction':
      return new ReactionGame(gameId, streamerId, config);
    default:
      throw new Error(`Unknown game type: ${gameType}`);
  }
}

/**
 * Get available games
 */
export function getAvailableGames() {
  return [
    {
      type: 'trivia',
      name: 'Trivia',
      description: 'Answer trivia questions to earn points',
      icon: '🧠',
    },
    {
      type: 'guess-number',
      name: 'Guess the Number',
      description: 'Guess a random number to win',
      icon: '🎯',
    },
    {
      type: 'spin-wheel',
      name: 'Spin the Wheel',
      description: 'Spin the wheel to win points',
      icon: '🎡',
    },
    {
      type: 'reaction',
      name: 'Reaction Game',
      description: 'Test your reaction time',
      icon: '⚡',
    },
  ];
}
