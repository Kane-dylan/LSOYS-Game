import { PLAYER } from "../utils/constants";

export default function Obstacle({ data }) {
  const getObstacleImage = () => {
    return data.type === "duck" ? "/fly.png" : "/obstacle.png";
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
      <img
        src={getObstacleImage()}
        alt={data.type === "duck" ? "Flying obstacle" : "Ground obstacle"}
        className="w-full h-full object-contain"
        style={{
          width: "100%",
          height: "100%",
        }}
        onError={(e) => {
          e.target.style.display = "none";
          const color = data.type === "duck" ? "bg-red-600" : "bg-gray-800";
          e.target.parentElement.innerHTML = `<div class="w-full h-full ${color} rounded"></div>`;
        }}
      />
    </div>
  );
}
