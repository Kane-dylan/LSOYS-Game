export default function HelpScreen({ isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto bounce-in">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🎮 Game Help</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-blue-600 mb-3">🎯 Controls</h3>
            <div className="space-y-2 text-sm">
              <p><strong>SPACE/↑:</strong> Jump over obstacles</p>
              <p><strong>↓:</strong> Duck under red obstacles</p>
              <p><strong>SHIFT:</strong> Use Flame Power (when charged)</p>
              <p><strong>ESC:</strong> Pause/Resume game</p>
              <p><strong>R:</strong> Restart when dead</p>
              <p><strong>L:</strong> View leaderboard</p>
              <p><strong>M:</strong> Toggle sound on/off</p>
            </div>
          </div>

          {/* Gameplay */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-green-600 mb-3">🎲 Gameplay</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Red Obstacles:</strong> Duck under them</p>
              <p><strong>Gray Obstacles:</strong> Jump over them</p>
              <p><strong>Score:</strong> Increases automatically over time</p>
              <p><strong>Difficulty:</strong> Increases with score</p>
              <p><strong>Best Score:</strong> Saved automatically</p>
            </div>
          </div>

          {/* Flame Power */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-orange-600 mb-3">🔥 Flame Power</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Charge:</strong> Jump (+10), Duck (+5), Time (+1)</p>
              <p><strong>Ready:</strong> Player glows and shows fire icon</p>
              <p><strong>Use:</strong> Press SHIFT to burn obstacles</p>
              <p><strong>Bonus:</strong> +10 points for burning obstacles</p>
              <p><strong>Range:</strong> Burns first obstacle in front</p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-purple-600 mb-3">💡 Pro Tips</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Timing:</strong> Watch obstacle colors carefully</p>
              <p><strong>Flame Strategy:</strong> Save for tough situations</p>
              <p><strong>Mobile:</strong> Touch controls at bottom</p>
              <p><strong>High Scores:</strong> Game saves top 10 scores</p>
              <p><strong>Difficulty:</strong> Speed increases every 10 points</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
