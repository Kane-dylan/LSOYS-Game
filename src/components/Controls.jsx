import { GAME_STATES } from "../utils/constants";

export default function Controls({
  gameState,
  onStart,
  onPause,
  onResume,
  onRestart,
  onShowLeaderboard,
  soundEnabled,
}) {
  return (
    <div className="absolute bottom-4 right-4 flex gap-2 flex-wrap">
      {gameState === GAME_STATES.IDLE && (
        <>
          <button
            onClick={onStart}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg"
          >
            Start
          </button>
          <button
            onClick={onShowLeaderboard}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-lg"
          >
            Leaderboard (L)
          </button>
        </>
      )}

      {(gameState === GAME_STATES.RUNNING ||
        gameState === GAME_STATES.FLAME_READY ||
        gameState === GAME_STATES.FLAME_USED) && (
        <button
          onClick={onPause}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-lg"
        >
          Pause (ESC)
        </button>
      )}

      {gameState === GAME_STATES.PAUSED && (
        <>
          <button
            onClick={onResume}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
          >
            Resume (ESC)
          </button>
          <button
            onClick={onShowLeaderboard}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-lg"
          >
            Leaderboard
          </button>
        </>
      )}

      {gameState === GAME_STATES.DEAD && (
        <>
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
          >
            Restart (R)
          </button>
          <button
            onClick={onShowLeaderboard}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-lg"
          >
            Leaderboard (L)
          </button>
        </>
      )}
    </div>
  );
}
