// FEATURE: Leaderboard component that reads from leaderboard.json
import { useState, useEffect } from "react";

export default function Leaderboard({ currentScore, onClose }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FEATURE: Load leaderboard from JSON file
    const loadLeaderboard = async () => {
      try {
        const response = await fetch("/src/data/leaderboard.json");
        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.warn("Failed to load leaderboard:", error);
        // Fallback data
        setLeaderboardData([
          { name: "x", score: 128 },
          { name: "y", score: 104 },
          { name: "z", score: 92 },
          { name: "u", score: 77 },
          { name: "v", score: 65 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center">
          <div className="text-gray-600">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">🏆 Leaderboard</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold px-2 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {leaderboardData.map((entry, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-3 rounded-lg ${
                currentScore > entry.score
                  ? "bg-green-100 border-green-300 border"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-lg font-bold ${
                    index === 0
                      ? "text-yellow-600"
                      : index === 1
                      ? "text-gray-600"
                      : index === 2
                      ? "text-orange-600"
                      : "text-gray-500"
                  }`}
                >
                  #{index + 1}
                </span>
                <span className="font-medium text-gray-800">{entry.name}</span>
              </div>
              <span className="font-bold text-blue-600">{entry.score}</span>
            </div>
          ))}
        </div>

        {currentScore > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg border-blue-300 border">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-blue-600">YOU</span>
                <span className="font-medium text-gray-800">Current Game</span>
              </div>
              <span className="font-bold text-blue-600">
                {Math.floor(currentScore)}
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
