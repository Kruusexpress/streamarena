// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TwitchAccount {
  id: string;
  userId: string;
  twitchId: string;
  twitchUsername: string;
  displayName: string;
  profileImageUrl?: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  connectedAt: Date;
}

// Game Types
export type GameType = 'trivia' | 'guess-number' | 'spin-wheel' | 'reaction';

export interface GameConfig {
  type: GameType;
  duration: number;
  minPlayers?: number;
  maxPlayers?: number;
  settings?: Record<string, any>;
}

export interface GameSession {
  id: string;
  streamerId: string;
  gameType: GameType;
  status: 'idle' | 'starting' | 'active' | 'ending' | 'ended';
  startedAt?: Date;
  endedAt?: Date;
  players: Player[];
  scores: Record<string, number>;
  winner?: string;
  settings: GameConfig;
}

export interface Player {
  id: string;
  username: string;
  userId?: string;
  displayName: string;
  avatar?: string;
  joinedAt: Date;
  score: number;
  status: 'idle' | 'answering' | 'correct' | 'incorrect';
}

// Trivia Game Types
export interface TriviaQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TriviaGameState {
  currentQuestion?: TriviaQuestion;
  timeRemaining: number;
  responses: Map<string, number>;
  correctAnswers: Set<string>;
}

// Guess Number Game Types
export interface GuessNumberGameState {
  secretNumber: number;
  timeRemaining: number;
  guesses: Map<string, number[]>;
  winner?: string;
  range: { min: number; max: number };
}

// Spin Wheel Game Types
export interface SpinWheelSegment {
  id: string;
  label: string;
  color: string;
  value?: number | string;
}

export interface SpinWheelGameState {
  segments: SpinWheelSegment[];
  isSpinning: boolean;
  currentWinner?: string;
  history: string[];
}

// Reaction Game Types
export interface ReactionGameState {
  timeRemaining: number;
  hasStarted: boolean;
  reactions: Map<string, number>; // username -> reaction time in ms
  winner?: string;
}

// Overlay Types
export interface StreamOverlay {
  id: string;
  streamerId: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

// WebSocket Event Types
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export interface GameEvent {
  type: 'start' | 'update' | 'end' | 'player_join' | 'player_answer' | 'winner';
  gameId: string;
  data: any;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
