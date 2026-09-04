import { BaseGame } from './base-game';
import type { TriviaQuestion, GameConfig } from '@/types';

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    answers: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    difficulty: 'easy',
  },
  {
    id: '2',
    question: 'What is the largest planet in our solar system?',
    answers: ['Saturn', 'Jupiter', 'Neptune', 'Mars'],
    correctAnswer: 1,
    difficulty: 'easy',
  },
  {
    id: '3',
    question: 'In what year did the Titanic sink?',
    answers: ['1912', '1905', '1920', '1898'],
    correctAnswer: 0,
    difficulty: 'medium',
  },
  {
    id: '4',
    question: 'Who wrote Romeo and Juliet?',
    answers: ['Jane Austen', 'William Shakespeare', 'Mark Twain', 'Charles Dickens'],
    correctAnswer: 1,
    difficulty: 'medium',
  },
  {
    id: '5',
    question: 'What is the chemical symbol for Gold?',
    answers: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    difficulty: 'hard',
  },
];

export class TriviaGame extends BaseGame {
  private currentQuestionIndex = 0;
  private responses: Map<string, number> = new Map();
  private correctAnswers: Set<string> = new Set();
  private questions: TriviaQuestion[];

  constructor(gameId: string, streamerId: string, config: GameConfig) {
    super(gameId, streamerId, config);
    this.duration = config.duration || 20; // 20 seconds per question
    this.questions = this.shuffleQuestions(TRIVIA_QUESTIONS.slice(0, 5));
  }

  /**
   * Start trivia game
   */
  async start() {
    await super.start();
    this.nextQuestion();
  }

  /**
   * Move to next question
   */
  private nextQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.stop();
      return;
    }

    const question = this.questions[this.currentQuestionIndex];
    this.responses.clear();
    this.correctAnswers.clear();

    this.emit('question-asked', {
      gameId: this.gameId,
      question,
      questionNumber: this.currentQuestionIndex + 1,
      totalQuestions: this.questions.length,
      timestamp: Date.now(),
    });

    // Auto-advance to next question after timer
    setTimeout(() => {
      this.currentQuestionIndex++;
      this.nextQuestion();
    }, this.duration * 1000);
  }

  /**
   * Handle player answer
   */
  handlePlayerAction(playerId: string, action: any) {
    if (action.type === 'answer') {
      const answer = action.answer; // 0-3 index
      this.responses.set(playerId, answer);

      const currentQuestion = this.questions[this.currentQuestionIndex];
      const isCorrect = answer === currentQuestion.correctAnswer;

      if (isCorrect) {
        this.correctAnswers.add(playerId);
        this.addPoints(playerId, 10);
      }

      this.emit('answer-submitted', {
        gameId: this.gameId,
        playerId,
        answer,
        correct: isCorrect,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Get current game state
   */
  getState() {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    return {
      gameId: this.gameId,
      type: 'trivia',
      status: this.status,
      currentQuestion: currentQuestion ? {
        id: currentQuestion.id,
        question: currentQuestion.question,
        answers: currentQuestion.answers,
        difficulty: currentQuestion.difficulty,
      } : null,
      questionNumber: this.currentQuestionIndex + 1,
      totalQuestions: this.questions.length,
      players: this.players.length,
      leaderboard: this.getLeaderboard(),
      timestamp: Date.now(),
    };
  }

  /**
   * Shuffle array
   */
  private shuffleQuestions(questions: TriviaQuestion[]): TriviaQuestion[] {
    return [...questions].sort(() => Math.random() - 0.5);
  }
}
