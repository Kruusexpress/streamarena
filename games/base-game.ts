import { EventEmitter } from 'events';
import type { GameSession, Player, GameConfig } from '@/types';

export abstract class BaseGame extends EventEmitter {
  protected gameId: string;
  protected streamerId: string;
  protected players: Player[] = [];
  protected scores: Map<string, number> = new Map();
  protected status: 'idle' | 'active' | 'ended' = 'idle';
  protected startTime: number = 0;
  protected duration: number;
  protected timerInterval: NodeJS.Timeout | null = null;

  constructor(gameId: string, streamerId: string, config: GameConfig) {
    super();
    this.gameId = gameId;
    this.streamerId = streamerId;
    this.duration = config.duration || 30;
  }

  /**
   * Start the game
   */
  async start() {
    this.status = 'active';
    this.startTime = Date.now();
    this.emit('game-started', {
      gameId: this.gameId,
      timestamp: this.startTime,
    });
    this.startTimer();
  }

  /**
   * Stop the game
   */
  async stop() {
    this.status = 'ended';
    this.stopTimer();
    const winner = this.determineWinner();
    this.emit('game-ended', {
      gameId: this.gameId,
      winner,
      scores: Object.fromEntries(this.scores),
      timestamp: Date.now(),
    });
  }

  /**
   * Add player to game
   */
  addPlayer(username: string, displayName: string, avatar?: string): Player {
    const player: Player = {
      id: `${this.gameId}_${username}_${Date.now()}`,
      username,
      displayName,
      avatar,
      joinedAt: new Date(),
      score: 0,
      status: 'idle',
    };

    this.players.push(player);
    this.scores.set(player.id, 0);

    this.emit('player-joined', {
      gameId: this.gameId,
      player,
      timestamp: Date.now(),
    });

    return player;
  }

  /**
   * Add points to player
   */
  addPoints(playerId: string, points: number) {
    const currentScore = this.scores.get(playerId) || 0;
    this.scores.set(playerId, currentScore + points);

    this.emit('points-awarded', {
      gameId: this.gameId,
      playerId,
      points,
      totalScore: currentScore + points,
      timestamp: Date.now(),
    });
  }

  /**
   * Get leaderboard
   */
  getLeaderboard() {
    return Array.from(this.scores.entries())
      .map(([playerId, score]) => ({
        playerId,
        score,
        player: this.players.find((p) => p.id === playerId),
      }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Start timer
   */
  protected startTimer() {
    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const remaining = Math.max(0, this.duration - elapsed);

      this.emit('timer-update', {
        gameId: this.gameId,
        remaining,
        elapsed,
        timestamp: Date.now(),
      });

      if (remaining === 0) {
        this.stop();
      }
    }, 1000);
  }

  /**
   * Stop timer
   */
  protected stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Determine winner
   */
  protected determineWinner(): string | undefined {
    const leaderboard = this.getLeaderboard();
    return leaderboard[0]?.playerId;
  }

  /**
   * Get game state
   */
  abstract getState(): any;

  /**
   * Handle player action
   */
  abstract handlePlayerAction(playerId: string, action: any): void;

  /**
   * Get game ID
   */
  getId() {
    return this.gameId;
  }

  /**
   * Get game status
   */
  getStatus() {
    return this.status;
  }

  /**
   * Get players
   */
  getPlayers() {
    return this.players;
  }

  /**
   * Get scores
   */
  getScores() {
    return Object.fromEntries(this.scores);
  }
}
