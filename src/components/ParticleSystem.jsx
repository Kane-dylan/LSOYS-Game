import { useState, useEffect } from 'react';

export default function ParticleSystem({ particles, onParticleEnd }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          {...particle}
          onEnd={() => onParticleEnd(particle.id)}
        />
      ))}
    </div>
  );
}

function Particle({ x, y, color, type, duration, onEnd }) {
  useEffect(() => {
    const timer = setTimeout(onEnd, duration);
    return () => clearTimeout(timer);
  }, [onEnd, duration]);

  return (
    <div
      className={`absolute w-2 h-2 rounded-full animate-ping`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        backgroundColor: color,
        animationDuration: `${duration}ms`,
      }}
    />
  );
}
