import { PLAYER } from "../utils/constants";

// FIX: Obstacle Component with image only (no background colors)
export default function Obstacle({ data }) {
  // FIX: Get appropriate image based on obstacle type
  const getObstacleImage = () => {
    return data.type === "duck"
      ? "/src/assets/images/fly.png"
      : "/src/assets/images/obstacle.png";
  };

  return (
    <div
      className="absolute"
      style={{
        left: `${data.x}px`,
        bottom: `64px`,
        transform: `translateY(${-(PLAYER.GROUND_Y - data.y)}px)`,
        width: `${data.width}px`,
        height: `${data.height}px`,
      }}
    >
      {/* FIX: Only show image, no background colors or borders */}
      <img
        src={getObstacleImage()}
        alt={data.type === "duck" ? "Flying obstacle" : "Ground obstacle"}
        className="w-full h-full object-contain"
        style={{
          // FIX: Ensure image scales correctly with collision box
          width: "100%",
          height: "100%",
        }}
        onError={(e) => {
          // FIX: Fallback to minimal colored background if image fails
          e.target.style.display = "none";
          const color = data.type === "duck" ? "bg-red-600" : "bg-gray-800";
          e.target.parentElement.innerHTML = `<div class="w-full h-full ${color} rounded"></div>`;
        }}
      />
    </div>
  );
}
