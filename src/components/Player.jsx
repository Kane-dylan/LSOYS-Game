import { PLAYER } from "../utils/constants";

// FIX: Player Component with image only (no background colors)
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
      {/* FIX: Only show image, no background colors or borders */}
      <img
        src="src/assets/images/player.png"
        alt="Player"
        className="w-full h-full object-contain"
        style={{
          // FIX: Ensure image scales correctly with collision box
          width: "100%",
          height: "100%",
        }}
        onError={(e) => {
          // FIX: Fallback to minimal visual indicator if image fails
          e.target.style.display = "none";
          e.target.parentElement.innerHTML =
            '<div class="w-full h-full bg-green-500 rounded"></div>';
        }}
      />
    </div>
  );
}
