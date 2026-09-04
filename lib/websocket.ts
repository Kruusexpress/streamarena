import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server } from 'http';
import type { GameEvent } from '@/types';

export class GameWebSocketManager {
  private io: SocketIOServer | null = null;
  private gameRooms: Map<string, Set<string>> = new Map();

  constructor(private server?: Server) {}

  /**
   * Initialize Socket.IO server
   */
  initialize(server: Server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    this.setupHandlers();
  }

  /**
   * Setup Socket.IO event handlers
   */
  private setupHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('join-game', (data: { gameId: string; userId: string; username: string }) => {
        socket.join(`game-${data.gameId}`);
        this.addPlayerToRoom(data.gameId, socket.id);
        this.io?.to(`game-${data.gameId}`).emit('player-joined', data);
      });

      socket.on('game-event', (data: GameEvent) => {
        this.io?.to(`game-${data.gameId}`).emit('game-update', data);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.gameRooms.forEach((players) => {
          players.delete(socket.id);
        });
      });
    });
  }

  /**
   * Emit game event to all players in a game
   */
  emitGameEvent(gameId: string, event: GameEvent) {
    if (this.io) {
      this.io.to(`game-${gameId}`).emit('game-update', event);
    }
  }

  /**
   * Emit event to streamer's dashboard
   */
  emitToStreamer(streamerId: string, event: any) {
    if (this.io) {
      this.io.to(`streamer-${streamerId}`).emit('dashboard-update', event);
    }
  }

  /**
   * Emit event to overlay
   */
  emitToOverlay(streamerId: string, event: any) {
    if (this.io) {
      this.io.to(`overlay-${streamerId}`).emit('overlay-update', event);
    }
  }

  /**
   * Add player to room
   */
  private addPlayerToRoom(gameId: string, socketId: string) {
    if (!this.gameRooms.has(gameId)) {
      this.gameRooms.set(gameId, new Set());
    }
    this.gameRooms.get(gameId)?.add(socketId);
  }

  /**
   * Get Socket.IO server instance
   */
  getIO() {
    return this.io;
  }
}

export let wsManager: GameWebSocketManager | null = null;

/**
 * Initialize WebSocket manager
 */
export function initializeWebSocket(server: Server) {
  wsManager = new GameWebSocketManager(server);
  wsManager.initialize(server);
  return wsManager;
}

/**
 * Get WebSocket manager instance
 */
export function getWebSocketManager() {
  return wsManager;
}
