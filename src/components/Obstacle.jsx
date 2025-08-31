import { useEffect, useRef } from 'react';

export default function Obstacle({ data }) {
  const obstacleRef = useRef(null);

  useEffect(() => {
    // Add spawn animation
    if (obstacleRef.current && data.x >= 750) { // Near spawn point
      obstacleRef.current.style.animation = 'slideUp 0.3s ease-out';
    }
  }, []);

  const getObstacleColor = () => {
    switch (data.type) {
      case "duck":
        return "bg-gradient-to-t from-red-700 to-red-500 border-red-800 shadow-lg shadow-red-300";
      case "jump":
        return "bg-gradient-to-t from-gray-900 to-gray-700 border-gray-600 shadow-lg shadow-gray-500";
      default:
        return "bg-gradient-to-t from-gray-900 to-gray-700 border-gray-600 shadow-lg shadow-gray-500";
    }
  };

  const getObstacleHeight = () => {
    return data.type === "duck" ? "border-2" : "border";
  };

  const getObstacleEffect = () => {
    if (data.type === "duck") {
      return "hover:scale-105 transition-transform";
    }
    return "hover:scale-105 transition-transform";
  };

  return (
    <div
      ref={obstacleRef}
      className={`absolute bottom-16 rounded-lg ${getObstacleColor()} ${getObstacleHeight()} ${getObstacleEffect()}`}
      style={{
        left: `${data.x}px`,
        width: `${data.width}px`,
        height: `${data.height}px`,
      }}
    >
      {/* Enhanced visual indicator with gradient text */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow-lg">
        <span className={data.type === "duck" ? "text-red-100" : "text-gray-100"}>
          {data.type === "duck" ? "DUCK" : "JUMP"}
        </span>
      </div>

      {/* Top indicator for duck obstacles with enhanced styling */}
      {data.type === "duck" && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-red-400 text-sm animate-bounce">
          ↓
        </div>
      )}

      {/* Warning indicator for jump obstacles */}
      {data.type === "jump" && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm">
          ⚠
        </div>
      )}

      {/* Glowing edge effect */}
      <div className={`absolute inset-0 rounded-lg ${
        data.type === "duck" 
          ? "bg-red-400 opacity-20 animate-pulse" 
          : "bg-gray-400 opacity-10"
      }`} />
    </div>
  );
}