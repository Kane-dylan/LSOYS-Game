import { useEffect, useRef } from 'react';
import { animations } from '../utils/animations';

export default function Player({ data, flameReady, gameState }) {
  const playerRef = useRef(null);
  const previousState = useRef(data.state);

  useEffect(() => {
    // Add landing animation when player touches ground after jumping
    if (previousState.current === 'jumping' && data.state === 'running' && data.y <= 0) {
      if (playerRef.current) {
        playerRef.current.style.animation = 'none';
        playerRef.current.offsetHeight; // Trigger reflow
        playerRef.current.style.animation = 'bounceIn 0.3s ease-out';
      }
    }
    previousState.current = data.state;
  }, [data.state, data.y]);

  const getStateColor = () => {
    switch (data.state) {
      case "jumping":
        return "bg-blue-500 shadow-lg shadow-blue-300";
      case "ducking":
        return "bg-yellow-500 shadow-lg shadow-yellow-300";
      case "dead":
        return "bg-red-500 animate-pulse shadow-lg shadow-red-300";
      default:
        return flameReady 
          ? "bg-green-400 animate-pulse shadow-lg shadow-green-300 flame-glow" 
          : "bg-green-500 shadow-lg shadow-green-300";
    }
  };

  const getTransform = () => {
    const baseTransform = `translateY(-${data.y}px)`;
    
    // Add slight rotation when jumping/ducking for more dynamic feel
    if (data.state === 'jumping') {
      return `${baseTransform} rotate(-5deg)`;
    }
    if (data.state === 'ducking') {
      return `${baseTransform} scaleY(0.7)`;
    }
    return baseTransform;
  };

  return (
    <div
      ref={playerRef}
      className={`absolute bottom-16 w-10 transition-all duration-100 rounded-lg ${getStateColor()}`}
      style={{
        left: `${data.x}px`,
        transform: getTransform(),
        width: `${data.width}px`,
        height: `${data.height}px`,
      }}
    >
      {/* Flame ready indicator */}
      {flameReady && data.state !== "dead" && (
        <>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          {/* Enhanced flame aura */}
          <div className="absolute -inset-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-lg opacity-30 animate-pulse" />
          {/* Flame particles */}
          <div className="absolute -top-1 left-1/2 w-1 h-1 bg-red-400 rounded-full animate-ping" />
          <div className="absolute -top-2 left-1/3 w-1 h-1 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
        </>
      )}

      {/* Trail effect when moving fast */}
      {data.state === 'running' && (
        <div className="absolute inset-0 bg-current opacity-20 rounded-lg transform translate-x-1 animate-pulse" />
      )}

      {/* Visual state indicator with enhanced styling */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow-lg">
        {data.state === "jumping" && (
          <span className="animate-bounce">↑</span>
        )}
        {data.state === "ducking" && (
          <span className="text-yellow-200">↓</span>
        )}
        {data.state === "running" && (
          <span className={flameReady ? "text-red-200 animate-pulse" : ""}>
            {flameReady ? "🔥" : "→"}
          </span>
        )}
        {data.state === "dead" && (
          <span className="animate-spin">💀</span>
        )}
      </div>
    </div>
  );
}
