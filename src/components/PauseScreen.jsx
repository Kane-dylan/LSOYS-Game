// FEATURE: Pause screen with resume functionality
export default function PauseScreen({ onResume }) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">⏸️ PAUSED</h1>
        <div className="text-gray-600 mb-6">Game is paused. Take a break!</div>

        <div className="space-y-4">
          <button
            onClick={onResume}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg font-bold text-lg"
          >
            ▶️ Resume
          </button>

          <div className="text-sm text-gray-500">
            Or press <kbd className="px-2 py-1 bg-gray-100 rounded">ESC</kbd> to
            resume
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <div>
              <kbd className="px-1 bg-gray-100 rounded">↑/SPACE</kbd> Jump
            </div>
            <div>
              <kbd className="px-1 bg-gray-100 rounded">↓/S</kbd> Duck
            </div>
            <div>
              <kbd className="px-1 bg-gray-100 rounded">ESC</kbd> Pause/Resume
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
