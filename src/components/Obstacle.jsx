import { PLAYER } from "../utils/constants";

// Simplified Obstacle Component - FIX: jump/duck with proper positioning
export default function Obstacle({ data }) {
  const getObstacleColor = () => {
    switch (data.type) {
      case "duck":
        return "bg-red-600 border-red-800"; // Flying obstacles
      case "jump":
        return "bg-gray-800 border-gray-600"; // Ground obstacles
      default:
        return "bg-gray-800 border-gray-600";
    }
  };

  return (
    <div
      className={`absolute rounded-lg border-2 ${getObstacleColor()}`}
      style={{
        left: `${data.x}px`,
        bottom: `64px`, // FIX: jump/duck - position relative to ground
        transform: `translateY(${-(PLAYER.GROUND_Y - data.y)}px)`, // FIX: jump/duck - proper coordinate conversion
        width: `${data.width}px`,
        height: `${data.height}px`,
      }}
    >
      {/* Visual indicator */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
        <span>
          {data.type === "duck" ? "FLY" : "JUMP"}
        </span>
      </div>

      {/* Top indicator for flying obstacles */}
      {data.type === "duck" && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-red-400 text-sm">
          ✈
        </div>
      )}

      {/* Warning indicator for ground obstacles */}
      {data.type === "jump" && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm">
          ⚠
        </div>
      )}
    </div>
  );
}
