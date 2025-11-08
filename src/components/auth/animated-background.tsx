
'use client';

import { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      size: number;
      delay: number;
      duration: number;
    }[]
  >([]);

  useEffect(() => {
    const numParticles = 30;
    const newParticles = Array.from({ length: numParticles }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden bg-black">
      <style>
        {`
          @keyframes move {
            0% { transform: translate(0, 0); }
            50% { transform: translate(var(--tx, 0px), var(--ty, 0px)); }
            100% { transform: translate(0, 0); }
          }
        `}
      </style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `move ${p.duration}s infinite`,
            animationDelay: `${p.delay}s`,
            ['--tx' as string]: `${(Math.random() - 0.5) * 200}px`,
            ['--ty' as string]: `${(Math.random() - 0.5) * 200}px`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
