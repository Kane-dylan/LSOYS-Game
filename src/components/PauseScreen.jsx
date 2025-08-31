export default function PauseScreen() {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">PAUSED</h1>
        <div className="text-gray-600 mb-6">Game is paused. Take a break!</div>
        <div className="space-y-2">
          <div className="text-lg font-bold text-blue-600 animate-pulse">
            Press ESC to Resume
          </div>
          <div className="text-sm text-gray-500">
            Or click the Resume button
          </div>
        </div>
      </div>
    </div>
  );
}
