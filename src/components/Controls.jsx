export default function Controls({ isRunning, onPause, onResume, onRestart }) {
  return (
    <div className="absolute bottom-2 w-full flex justify-center gap-4">
      {isRunning ? (
        <button className="px-4 py-2 bg-yellow-400" onClick={onPause}>
          Pause
        </button>
      ) : (
        <button className="px-4 py-2 bg-green-400" onClick={onResume}>
          Resume
        </button>
      )}
      <button className="px-4 py-2 bg-red-400" onClick={onRestart}>
        Restart
      </button>
    </div>
  );
}
