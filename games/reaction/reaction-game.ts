import { BaseGame } from '../base-game';
import type { GameConfig } from '@/types';

export class ReactionGame extends BaseGame {
  private reactionTimes: Map<string, number> = new Map();
  private hasStarted = false;
  private readyCounter = 3;
  private winner: string | null = null;

  constructor(gameId: string, streamerId: string, config: GameConfig) {
    super(gameId, streamerId, config);
    this.duration = config.duration || 10; // 10 seconds total
  }

  /**
   * Start reaction game
   */
  async start() {
    await super.start();
    await this.countdownReady();
  }

  /**
   * Countdown before reaction challenge
   */
  private async countdownReady() {
    for (let i = 3; i > 0; i--) {
      this.emit('countdown', {
        gameId: this.gameId,
        count: i,
        timestamp: Date.now(),
      });
      await this.sleep(1000);
    }

    this.hasStarted = true;
    const startTime = Date.now();

    this.emit('go', {
      gameId: this.gameId,
      startTime,
      timestamp: startTime,
    });

    // Wait for reactions
    setTimeout(() => {
      this.determineWinnerFromReactions();
      this.stop();
    }, 5000); // 5 seconds to react
  }

  /**
   * Handle player reaction
   */
  handlePlayerAction(playerId: string, action: any) {
    if (action.type === 'react' && this.hasStarted && !this.winner) {
      const reactionTime = action.reactionTime || 0;
      this.reactionTimes.set(playerId, reactionTime);

      this.emit('reaction-recorded', {
        gameId: this.gameId,
        playerId,
        reactionTime,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Determine winner from reaction times
   */
  private determineWinnerFromReactions() {
    if (this.reactionTimes.size === 0) return;

    let fastestPlayer = '';
    let fastestTime = Infinity;

    this.reactionTimes.forEach((time, playerId) => {
      if (time < fastestTime) {
        fastestTime = time;
        fastestPlayer = playerId;
      }
    });

    this.winner = fastestPlayer;
    this.addPoints(fastestPlayer, 100);
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current game state
   */
  getState() {
    return {
      gameId: this.gameId,
      type: 'reaction',
      status: this.status,
      hasStarted: this.hasStarted,
      players: this.players.length,
      reactions: Object.fromEntries(this.reactionTimes),
      winner: this.winner,
      leaderboard: this.getLeaderboard(),
      timestamp: Date.now(),
    };
  }
}
