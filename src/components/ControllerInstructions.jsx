export default function ControllerInstructions({ soundEnabled }) {
  return (
    <div className="bg-black bg-opacity-40 backdrop-blur-md p-2 rounded-lg shadow-lg hidden md:block">
      <div className="text-xs text-white text-opacity-90 text-center">
        <div className="flex items-center gap-3">
          <span>↑/SPACE: Jump</span>
          <span>↓/S: Duck</span>
          <span>ESC: Pause</span>
          <span>M: Sound {soundEnabled ? "🔊" : "🔇"}</span>
        </div>
      </div>
    </div>
  );
}
