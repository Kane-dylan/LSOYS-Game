export default function StartScreen() {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md bounce-in">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🔥 LSOYS Game 🔥</h1>
        <p className="text-gray-600 mb-6 text-sm">Survive as long as you can!</p>
        
        <div className="text-gray-700 mb-6 space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-600">Controls:</h3>
            <div className="space-y-1 text-sm">
              <p><strong>SPACE/↑</strong> - Jump over obstacles</p>
              <p><strong>↓</strong> - Duck under red obstacles</p>
              <p><strong>SHIFT</strong> - Use Flame Power (when charged)</p>
              <p><strong>ESC</strong> - Pause game</p>
              <p><strong>M</strong> - Toggle sound</p>
              <p><strong>L</strong> - View leaderboard</p>
            </div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2 text-orange-600">Tips:</h3>
            <div className="space-y-1 text-sm">
              <p>• Red obstacles: <span className="text-red-600 font-bold">DUCK</span></p>
              <p>• Gray obstacles: <span className="text-gray-600 font-bold">JUMP</span></p>
              <p>• Build flame power by jumping and ducking</p>
              <p>• Game gets faster as your score increases!</p>
            </div>
          </div>
        </div>
        
        <div className="text-xl font-bold text-green-600 animate-pulse">
          🚀 Press SPACE to Start! 🚀
        </div>
      </div>
    </div>
  );
}
