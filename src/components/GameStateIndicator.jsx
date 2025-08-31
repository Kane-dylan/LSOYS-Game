import { GAME_STATES } from "../utils/constants";

export default function GameStateIndicator({ gameState }) {
  const getStateInfo = () => {
    switch (gameState) {
      case GAME_STATES.IDLE:
        return { text: "READY", color: "text-blue-600" };
      case GAME_STATES.RUNNING:
        return { text: "RUNNING", color: "text-green-600" };
      case GAME_STATES.FLAME_READY:
        return { text: "FLAME READY", color: "text-orange-600" };
      case GAME_STATES.FLAME_USED:
        return { text: "FLAME!", color: "text-red-600" };
      case GAME_STATES.DEAD:
        return { text: "GAME OVER", color: "text-red-800" };
      case GAME_STATES.PAUSED:
        return { text: "PAUSED", color: "text-gray-600" };
      default:
        return { text: "UNKNOWN", color: "text-gray-400" };
    }
  };

  const { text, color } = getStateInfo();

  return (
    <div className="absolute top-4 right-4 z-10">
      <div
        className={`text-lg font-bold ${color} bg-white bg-opacity-80 px-3 py-1 rounded-lg shadow-lg`}
      >
        {text}
      </div>
    </div>
  );
}
