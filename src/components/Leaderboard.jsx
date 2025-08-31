import { useState, useEffect } from "react";

const LEADERBOARD_KEY = "lsoys-leaderboard";
const MAX_ENTRIES = 10;

export default function Leaderboard({ currentScore, isVisible, onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  useEffect(() => {
    if (currentScore > 0 && isVisible) {
      checkIfHighScore(currentScore);
    }
  }, [currentScore, isVisible]);

  const loadLeaderboard = () => {
    try {
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      const entries = stored ? JSON.parse(stored) : [];
      setLeaderboard(entries);
    } catch (error) {
      console.warn("Failed to load leaderboard:", error);
      setLeaderboard([]);
    }
  };

  const checkIfHighScore = (score) => {
    const wouldMakeLeaderboard =
      leaderboard.length < MAX_ENTRIES ||
      score > leaderboard[leaderboard.length - 1]?.score ||
      0;

    if (wouldMakeLeaderboard) {
      setIsNewHighScore(true);
      setShowNameInput(true);
    }
  };

  const saveToLeaderboard = () => {
    if (!playerName.trim()) return;

    const newEntry = {
      name: playerName.trim(),
      score: currentScore,
      date: new Date().toLocaleDateString(),
      id: Date.now(),
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);

    setLeaderboard(updatedLeaderboard);

    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));
    } catch (error) {
      console.warn("Failed to save leaderboard:", error);
    }

    setShowNameInput(false);
    setPlayerName("");
  };

  const getRankSuffix = (rank) => {
    const lastDigit = rank % 10;
    const lastTwoDigits = rank % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return "th";
    if (lastDigit === 1) return "st";
    if (lastDigit === 2) return "nd";
    if (lastDigit === 3) return "rd";
    return "th";
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "🏅";
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 bounce-in">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🏆 Leaderboard
          </h2>
          {isNewHighScore && (
            <div className="text-green-600 font-bold animate-pulse">
              🎉 New High Score! 🎉
            </div>
          )}
        </div>

        {showNameInput ? (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <p className="text-center text-gray-700 mb-3">
              Congratulations! You scored {currentScore} points!
            </p>
            <p className="text-center text-gray-600 mb-3 text-sm">
              Enter your name for the leaderboard:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={20}
                onKeyPress={(e) => e.key === "Enter" && saveToLeaderboard()}
                autoFocus
              />
              <button
                onClick={saveToLeaderboard}
                disabled={!playerName.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : null}

        <div className="max-h-64 overflow-y-auto mb-6">
          {leaderboard.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No scores yet!</p>
              <p className="text-sm">Be the first to set a high score!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                const isCurrentScore =
                  entry.score === currentScore &&
                  entry.name === playerName &&
                  entry.id === Math.max(...leaderboard.map((e) => e.id));

                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isCurrentScore
                        ? "bg-green-100 border-2 border-green-300"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getRankIcon(rank)}</span>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {entry.name}
                          {isCurrentScore && (
                            <span className="ml-2 text-green-600 text-sm">
                              (You!)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {entry.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">
                        {entry.score}
                      </div>
                      <div className="text-xs text-gray-500">
                        {rank}
                        {getRankSuffix(rank)} place
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              setLeaderboard([]);
              localStorage.removeItem(LEADERBOARD_KEY);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
