// FEATURE: Game over screen with restart and leaderboard options
export default function GameOverScreen({
  score,
  bestScore,
  isNewBest,
  onRestart,
  onViewLeaderboard,
}) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4 animate-bounce-in">
        <h1 className="text-3xl font-bold text-red-600 mb-4">💀 GAME OVER</h1>

        <div className="mb-6">
          <div className="text-3xl font-bold text-gray-800 mb-2">
            Score: <span className="text-blue-600">{Math.floor(score)}</span>
          </div>
          {isNewBest && (
            <div className="text-yellow-600 font-bold text-xl animate-pulse mb-3 bg-yellow-50 p-3 rounded-lg border-2 border-yellow-200">
              🎉 NEW BEST SCORE! 🎉
            </div>
          )}
          <div className="text-lg text-gray-600">
            Best:{" "}
            <span className="text-yellow-600 font-bold">
              {Math.floor(bestScore)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg font-bold text-lg"
          >
            🔄 Play Again
          </button>

          <button
            onClick={onViewLeaderboard}
            className="w-full px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-lg"
          >
            📊 View Leaderboard
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded">R</kbd> to
          restart or <kbd className="px-2 py-1 bg-gray-100 rounded">L</kbd> for
          leaderboard
        </div>
      </div>
    </div>
  );
}
