export default function Scoreboard({ score, best }) {
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

      {/* Show "NEW BEST!" indicator */}
      {score > 0 && score > best && (
        <div className="text-green-600 font-bold text-sm mt-1 animate-pulse">
          NEW BEST!
        </div>
      )}
    </div>
  );
}
