import { DIFFICULTY } from "../utils/constants";

export default function DifficultyIndicator({ score, modifiers }) {
  const { speedMultiplier, spawnRate, minGap } = modifiers;

  return (
    <div className="absolute top-20 left-4 bg-white bg-opacity-80 p-2 rounded-lg shadow-lg text-xs">
      <div className="text-sm font-bold text-gray-800 mb-1">Difficulty</div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Speed:</span>
          <span className="font-bold text-orange-600">
            {speedMultiplier.toFixed(1)}x
          </span>
        </div>

        <div className="flex justify-between">
          <span>Spawn:</span>
          <span className="font-bold text-red-600">
            {(spawnRate * 100).toFixed(1)}%
          </span>
        </div>

        <div className="flex justify-between">
          <span>Gap:</span>
          <span className="font-bold text-blue-600">
            {Math.round(minGap)}px
          </span>
        </div>
      </div>
    </div>
  );
}

function getDifficultyLevel(score) {
  if (score < 50) return "EASY";
  if (score < 100) return "NORMAL";
  if (score < 200) return "HARD";
  if (score < 300) return "INSANE";
  return "IMPOSSIBLE";
}

function getDifficultyColor(score) {
  if (score < 50) return "text-green-600";
  if (score < 100) return "text-yellow-600";
  if (score < 200) return "text-orange-600";
  if (score < 300) return "text-red-600";
  return "text-purple-600";
}