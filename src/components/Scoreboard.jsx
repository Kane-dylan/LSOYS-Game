// FEATURE: Score display component with current and best score
export default function Scoreboard({ score, bestScore, isNewBest }) {
  return (
    <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="text-lg font-bold text-gray-800">
        <div className="mb-2">
          Score: <span className="text-blue-600">{Math.floor(score)}</span>
        </div>
        <div className="flex items-center gap-2">
          Best: <span className="text-yellow-600">{Math.floor(bestScore)}</span>
          {isNewBest && (
            <span className="text-green-600 text-sm font-bold animate-pulse">
              🎉 NEW!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
