import { GAME_STATES } from "../utils/constants";

export default function TouchControls({
  gameState,
  onJump,
  onDuck,
  onFlame,
  flameReady,
}) {
  if (
    gameState !== GAME_STATES.RUNNING &&
    gameState !== GAME_STATES.FLAME_READY &&
    gameState !== GAME_STATES.FLAME_USED
  ) {
    return null;
  }

  return (
    <div className="absolute bottom-20 left-0 right-0 flex justify-between px-4 md:hidden">
      {/* Left side controls */}
      <div className="flex gap-3">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onJump();
          }}
          className="w-16 h-16 bg-blue-500 bg-opacity-80 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg border-2 border-blue-300 active:bg-blue-600"
        >
          ↑
        </button>
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onDuck();
          }}
          className="w-16 h-16 bg-yellow-500 bg-opacity-80 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg border-2 border-yellow-300 active:bg-yellow-600"
        >
          ↓
        </button>
      </div>

      {/* Right side flame control */}
      <div className="flex">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            if (flameReady) onFlame();
          }}
          disabled={!flameReady}
          className={`w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg border-2 ${
            flameReady
              ? "bg-red-500 bg-opacity-80 border-red-300 active:bg-red-600 animate-pulse"
              : "bg-gray-400 bg-opacity-80 border-gray-300 cursor-not-allowed"
          }`}
        >
          🔥
        </button>
      </div>
    </div>
  );
}
