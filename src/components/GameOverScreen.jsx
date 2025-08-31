export default function GameOverScreen({
  score,
  bestScore,
  onShowLeaderboard,
}) {
  const isNewBest = score > 0 && score >= bestScore;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md bounce-in">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          💀 GAME OVER 💀
        </h1>

        <div className="mb-6">
          <div className="text-3xl font-bold text-gray-800 mb-2">
            Score: <span className="text-blue-600">{score}</span>
          </div>
          {isNewBest && (
            <div className="text-yellow-600 font-bold text-xl animate-pulse mb-3 bg-yellow-50 p-2 rounded-lg border-2 border-yellow-200">
              🎉 NEW BEST SCORE! 🎉
            </div>
          )}
          <div className="text-lg text-gray-600">
            Best: <span className="text-yellow-600 font-bold">{bestScore}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-lg font-bold text-green-600 animate-pulse">
            🔄 Press R to Restart
          </div>
          <div className="text-sm text-purple-600">
            📊 Press L for Leaderboard
          </div>
          <div className="text-xs text-gray-500">Or use the buttons below</div>
        </div>
      </div>
    </div>
  );
}
