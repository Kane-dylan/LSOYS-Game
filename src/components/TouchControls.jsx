// FEATURE: Mobile-friendly touch controls
import { useEffect } from "react";
import { GAME_STATES } from "../utils/constants";

export default function TouchControls({
  onJump,
  onDuck,
  onJumpRelease,
  onDuckRelease,
  gameState,
}) {
  // FEATURE: Handle mobile touch events
  useEffect(() => {
    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const screenHeight = window.innerHeight;
      const touchY = touch.clientY;

      // Top half = jump, bottom half = duck
      if (touchY < screenHeight / 2) {
        onJump();
      } else {
        onDuck();
      }
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      onJumpRelease();
      onDuckRelease();
    };

    // Only add touch controls on mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile && gameState === GAME_STATES.RUNNING) {
      document.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd, { passive: false });
    }

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gameState, onJump, onDuck, onJumpRelease, onDuckRelease]);

  // Show touch controls only on mobile when game is running
  if (window.innerWidth >= 768 || gameState !== GAME_STATES.RUNNING) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Touch areas visualization */}
      <div className="absolute top-0 left-0 w-full h-1/2 border-b border-white border-opacity-20 flex items-center justify-center">
        <div className="text-white text-opacity-40 text-lg font-bold bg-black bg-opacity-20 px-4 py-2 rounded-lg">
          TAP TO JUMP ⬆️
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 border-t border-white border-opacity-20 flex items-center justify-center">
        <div className="text-white text-opacity-40 text-lg font-bold bg-black bg-opacity-20 px-4 py-2 rounded-lg">
          TAP TO DUCK ⬇️
        </div>
      </div>
    </div>
  );
}
