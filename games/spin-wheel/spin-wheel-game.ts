import { BaseGame } from '../base-game';
import type { SpinWheelSegment, GameConfig } from '@/types';

const DEFAULT_SEGMENTS: SpinWheelSegment[] = [
  { id: '1', label: '100 Points', color: '#ff6b6b', value: 100 },
  { id: '2', label: '50 Points', color: '#4ecdc4', value: 50 },
  { id: '3', label: '250 Points', color: '#45b7d1', value: 250 },
  { id: '4', label: '75 Points', color: '#96ceb4', value: 75 },
  { id: '5', label: '150 Points', color: '#ffeaa7', value: 150 },
  { id: '6', label: '25 Points', color: '#dfe6e9', value: 25 },
];

export class SpinWheelGame extends BaseGame {
  private segments: SpinWheelSegment[];
  private isSpinning = false;
  private spinHistory: Array<{ winner: string; segment: SpinWheelSegment; timestamp: number }> = [];
  private canSpin = true;
  private spinCooldown = 3000; // 3 seconds between spins

  constructor(gameId: string, streamerId: string, config: GameConfig) {
    super(gameId, streamerId, config);
    this.duration = config.duration || 300; // 5 minutes game time
    this.segments = config.settings?.segments || DEFAULT_SEGMENTS;
  }

  /**
   * Start spin wheel game
   */
  async start() {
    await super.start();
    this.emit('segments-loaded', {
      gameId: this.gameId,
      segments: this.segments,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle spin request
   */
  handlePlayerAction(playerId: string, action: any) {
    if (action.type === 'spin-request' && this.status === 'active') {
      if (!this.canSpin) {
        this.emit('spin-denied', {
          gameId: this.gameId,
          playerId,
          reason: 'Cooldown active',
          timestamp: Date.now(),
        });
        return;
      }

      this.performSpin(playerId);
    }
  }

  /**
   * Perform spin
   */
  private performSpin(playerId: string) {
    this.isSpinning = true;
    this.canSpin = false;

    const spinDuration = 3000; // 3 second spin animation
    const selectedSegment = this.selectRandomSegment();
    const pointsWon = typeof selectedSegment.value === 'number' ? selectedSegment.value : 0;

    this.emit('spin-started', {
      gameId: this.gameId,
      playerId,
      duration: spinDuration,
      timestamp: Date.now(),
    });

    setTimeout(() => {
      this.isSpinning = false;
      this.addPoints(playerId, pointsWon);
      this.spinHistory.push({
        winner: playerId,
        segment: selectedSegment,
        timestamp: Date.now(),
      });

      this.emit('spin-completed', {
        gameId: this.gameId,
        playerId,
        segment: selectedSegment,
        points: pointsWon,
        timestamp: Date.now(),
      });

      // Reset cooldown
      setTimeout(() => {
        this.canSpin = true;
      }, this.spinCooldown);
    }, spinDuration);
  }

  /**
   * Select random segment
   */
  private selectRandomSegment(): SpinWheelSegment {
    return this.segments[Math.floor(Math.random() * this.segments.length)];
  }

  /**
   * Get current game state
   */
  getState() {
    return {
      gameId: this.gameId,
      type: 'spin-wheel',
      status: this.status,
      isSpinning: this.isSpinning,
      canSpin: this.canSpin,
      segments: this.segments,
      players: this.players.length,
      history: this.spinHistory.slice(-10), // Last 10 spins
      leaderboard: this.getLeaderboard(),
      timestamp: Date.now(),
    };
  }
}
