export default function Scoreboard({ score, bestScore, isNewBest }) {
  return (
    <div className="bg-black bg-opacity-40 backdrop-blur-md p-2 rounded-lg shadow-lg">
      <div className="text-xs sm:text-sm font-bold text-white">
        <div className="mb-1">
          Score: <span className="text-blue-300">{Math.floor(score)}</span>
        </div>
        <div className="flex items-center gap-1">
          Best: <span className="text-yellow-300">{Math.floor(bestScore)}</span>
          {isNewBest && (
            <span className="text-green-300 text-xs font-bold animate-pulse">
              NEW!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
