import { PLAYER } from "../utils/constants";

// Simplified Player Component - FIX: jump/duck with proper positioning
export default function Player({ data }) {
  const getStateColor = () => {
    switch (data.state) {
      case "jumping":
        return "bg-blue-500";
      case "ducking":
        return "bg-yellow-500";
      case "dead":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  const getTransform = () => {
    // FIX: jump/duck - Convert game coordinates to screen coordinates
    // In game: y=GROUND_Y is ground level, smaller y = higher up
    // In CSS: we position from bottom of screen
    const screenY = window.innerHeight - data.y - data.height;
    const baseTransform = `translateY(${screenY}px)`;

    // Add visual changes for different states
    if (data.state === "jumping") {
      return `${baseTransform} rotate(-5deg)`;
    }
    if (data.state === "ducking") {
      return `${baseTransform}`;
    }
    return baseTransform;
  };

  return (
    <div
      className={`absolute transition-all duration-100 rounded-lg ${getStateColor()}`}
      style={{
        left: `${data.x}px`,
        bottom: `64px`, // FIX: jump/duck - position relative to ground
        transform: `translateY(${-(PLAYER.GROUND_Y - data.y)}px)`, // FIX: jump/duck - proper coordinate conversion
        width: `${data.width}px`,
        height: `${data.height}px`,
      }}
    >
      {/* Visual state indicator */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
        {data.state === "jumping" && <span>↑</span>}
        {data.state === "ducking" && <span>↓</span>}
        {data.state === "running" && <span>→</span>}
        {data.state === "dead" && <span>💀</span>}
      </div>
    </div>
  );
}
