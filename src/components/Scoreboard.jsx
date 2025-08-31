export default function Scoreboard({ score, best }) {
  const getNextMilestone = (currentScore) => {
    const milestones = [50, 100, 150, 200, 250, 300, 400, 500];
    return milestones.find((milestone) => milestone > currentScore) || null;
  };

  const nextMilestone = getNextMilestone(score);

  return (
    <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-3 rounded-lg shadow-lg">
      <div className="text-lg font-bold text-gray-800">
        <p className="mb-1">
          Score: <span className="text-blue-600">{score}</span>
        </p>
        <p>
          Best: <span className="text-yellow-600">{best}</span>
        </p>
      </div>

      {/* Milestone progress */}
      {nextMilestone && (
        <div className="mt-2 text-xs text-gray-600">
          Next Level: {nextMilestone} ({nextMilestone - score} to go)
        </div>
      )}

      {/* Show "NEW BEST!" indicator */}
      {score > 0 && score > best && (
        <div className="text-green-600 font-bold text-sm mt-1 animate-pulse">
          NEW BEST!
        </div>
      )}
    </div>
  );
}
