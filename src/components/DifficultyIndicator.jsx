export default function DifficultyIndicator({
  gameTime,
  speedMultiplier,
  spawnRate,
}) {
  const getDifficultyLevel = (time) => {
    if (time < 10000) return "EASY";
    if (time < 20000) return "NORMAL";
    if (time < 40000) return "HARD";
    return "INSANE";
  };

  const getDifficultyColor = (time) => {
    if (time < 10000) return "text-green-300";
    if (time < 20000) return "text-yellow-300";
    if (time < 40000) return "text-orange-300";
    return "text-red-300";
  };

  return (
    <div className="bg-black bg-opacity-40 backdrop-blur-md p-2 rounded-lg shadow-lg">
      <div className="text-xs sm:text-sm font-bold text-white text-center">
        <div className={`${getDifficultyColor(gameTime)} mb-1`}>
          {getDifficultyLevel(gameTime)}
        </div>
        <div className="text-white text-opacity-80">
          <div>Speed: {speedMultiplier.toFixed(1)}x</div>
          <div>Rate: {(spawnRate * 100).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}
