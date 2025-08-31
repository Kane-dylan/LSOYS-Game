import { FLAME } from "../utils/constants";

export default function FlameIndicator({ progress, ready, isUsing }) {
  const progressPercentage = Math.min(
    (progress / FLAME.CHARGE_THRESHOLD) * 100,
    100
  );

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 p-3 rounded-lg shadow-lg">
      <div className="text-sm font-bold text-gray-800 mb-2 text-center">
        Flame Power
      </div>

      {/* Progress bar */}
      <div className="w-32 h-4 bg-gray-300 rounded-full overflow-hidden border">
        <div
          className={`h-full transition-all duration-200 ${
            isUsing
              ? "bg-white animate-pulse"
              : ready
              ? "bg-red-500 animate-pulse"
              : "bg-orange-400"
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Status text */}
      <div className="text-xs mt-1 text-center">
        {isUsing ? (
          <span className="text-white font-bold animate-pulse bg-red-500 px-2 py-1 rounded">
            🔥 BURNING! 🔥
          </span>
        ) : ready ? (
          <span className="text-red-600 font-bold animate-pulse">
            🔥 SHIFT TO USE 🔥
          </span>
        ) : (
          <span className="text-gray-600">
            {progress}/{FLAME.CHARGE_THRESHOLD}
          </span>
        )}
      </div>
    </div>
  );
}
