'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TriviaquestionsProps {
  question: {
    id: string;
    question: string;
    answers: string[];
    difficulty: 'easy' | 'medium' | 'hard';
  };
  onAnswer?: (answerIndex: number) => void;
  timeRemaining?: number;
}

export const TriviaQuestion: React.FC<TriviaquestionsProps> = ({ question, onAnswer, timeRemaining = 20 }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const difficultyColors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400',
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null && onAnswer) {
      onAnswer(selectedAnswer);
      setSelectedAnswer(null);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">{question.question}</h2>
          <div className="flex flex-col items-center">
            <span className={`text-4xl font-bold ${difficultyColors[question.difficulty]}`}>
              {timeRemaining}s
            </span>
            <span className="text-gray-400 text-sm">Time Remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(index)}
              className={`p-4 rounded-lg font-semibold transition-all duration-300 ${
                selectedAnswer === index
                  ? 'bg-neon-purple text-white border-2 border-neon-pink'
                  : 'bg-dark-tertiary text-white border-2 border-neon-purple/30 hover:border-neon-purple'
              }`}
            >
              {String.fromCharCode(65 + index)}. {answer}
            </button>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className="w-full"
        >
          Submit Answer
        </Button>
      </div>
    </Card>
  );
};
