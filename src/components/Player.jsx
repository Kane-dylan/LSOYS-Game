import { PLAYER } from "../utils/constants";

export default function Player({ data }) {
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
        src="/player.png"
        alt="Player"
        className="w-full h-full object-contain"
        style={{
          width: "100%",
          height: "100%",
        }}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.parentElement.innerHTML =
            '<div class="w-full h-full bg-green-500 rounded"></div>';
        }}
      />
    </div>
  );
}
