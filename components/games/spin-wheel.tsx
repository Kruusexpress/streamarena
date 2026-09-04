'use client';

import React, { useEffect, useRef } from 'react';

interface Segment {
  id: string;
  label: string;
  color: string;
  value?: number | string;
}

interface SpinWheelProps {
  segments: Segment[];
  onSpin?: (segment: Segment) => void;
  isSpinning?: boolean;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({ segments, onSpin, isSpinning = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = React.useState(0);

  useEffect(() => {
    drawWheel();
  }, [segments]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const sliceAngle = (2 * Math.PI) / segments.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    segments.forEach((segment, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.lineTo(0, 0);
      ctx.fillStyle = segment.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(segment.label, radius - 20, 5);
      ctx.restore();
    });

    ctx.restore();
  };

  const handleSpin = () => {
    if (isSpinning) return;

    const spinDegrees = Math.random() * 360 + 720;
    setRotation((prev) => prev + spinDegrees);

    if (onSpin) {
      setTimeout(() => {
        const normalizedRotation = rotation % 360;
        const selectedIndex = Math.floor(
          ((360 - normalizedRotation) / 360) * segments.length
        ) % segments.length;
        onSpin(segments[selectedIndex]);
      }, 3000);
    }
  };

  useEffect(() => {
    drawWheel();
  }, [rotation, segments]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="transition-transform duration-3000"
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-16 border-l-transparent border-r-transparent border-t-neon-pink" />
        </div>
      </div>
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="px-8 py-3 bg-gradient-neon text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition"
      >
        {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}
      </button>
    </div>
  );
};
