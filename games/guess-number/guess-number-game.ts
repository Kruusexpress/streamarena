import { BaseGame } from '../base-game';
import type { GameConfig } from '@/types';

export class GuessNumberGame extends BaseGame {
  private secretNumber: number;
  private guesses: Map<string, number[]> = new Map();
  private range: { min: number; max: number };
  private winner: string | null = null;

  constructor(gameId: string, streamerId: string, config: GameConfig) {
    super(gameId, streamerId, config);
    this.duration = config.duration || 60; // 60 seconds to guess
    this.range = config.settings?.range || { min: 1, max: 100 };
    this.secretNumber = this.generateSecretNumber();
  }

  /**
   * Start guess number game
   */
  async start() {
    await super.start();
    this.emit('game-started-with-range', {
      gameId: this.gameId,
      range: this.range,
      hint: `Guess a number between ${this.range.min} and ${this.range.max}`,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle player guess
   */
  handlePlayerAction(playerId: string, action: any) {
    if (action.type === 'guess' && this.status === 'active') {
      const guess = action.guess;

      if (!this.guesses.has(playerId)) {
        this.guesses.set(playerId, []);
      }
      this.guesses.get(playerId)!.push(guess);

      const diff = Math.abs(guess - this.secretNumber);
      let hint = '';
      let correct = false;

      if (guess === this.secretNumber) {
        correct = true;
        hint = 'Correct!';
        this.winner = playerId;
        this.addPoints(playerId, 50);
      } else if (guess < this.secretNumber) {
        hint = 'Higher!';
      } else {
        hint = 'Lower!';
      }

      this.emit('guess-feedback', {
        gameId: this.gameId,
        playerId,
        guess,
        hint,
        correct,
        closeness: diff,
        timestamp: Date.now(),
      });

      if (correct) {
        setTimeout(() => this.stop(), 2000);
      }
    }
  }

  /**
   * Generate secret number
   */
  private generateSecretNumber(): number {
    return Math.floor(Math.random() * (this.range.max - this.range.min + 1)) + this.range.min;
  }

  /**
   * Get current game state
   */
  getState() {
    return {
      gameId: this.gameId,
      type: 'guess-number',
      status: this.status,
      range: this.range,
      players: this.players.length,
      guesses: Object.fromEntries(this.guesses),
      winner: this.winner,
      leaderboard: this.getLeaderboard(),
      timestamp: Date.now(),
    };
  }
}
