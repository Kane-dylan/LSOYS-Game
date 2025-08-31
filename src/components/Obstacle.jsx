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
      {/* FIX: Remove visual indicators and icons from obstacles */}
    </div>
  );
}
