// FIX: Mobile responsive touch controls
import { useEffect, useState } from "react";
import { GAME_STATES } from "../utils/constants";

export default function TouchControls({
  onJump,
  onDuck,
  onJumpRelease,
  onDuckRelease,
  gameState,
}) {
  const [isMobile, setIsMobile] = useState(false);

  // FIX: Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // FIX: Mobile touch event handling
  useEffect(() => {
    if (!isMobile || gameState !== GAME_STATES.RUNNING) return;

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

    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gameState, onJump, onDuck, onJumpRelease, onDuckRelease, isMobile]);

  // FIX: Show touch controls only on mobile when game is running
  if (!isMobile || gameState !== GAME_STATES.RUNNING) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* FIX: Clean mobile touch areas */}
      <div className="absolute top-0 left-0 w-full h-1/2 border-b border-white border-opacity-10 flex items-center justify-center">
        <div className="text-white text-opacity-50 text-sm font-bold bg-black bg-opacity-30 px-3 py-1 rounded">
          TAP TO JUMP
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 border-t border-white border-opacity-10 flex items-center justify-center">
        <div className="text-white text-opacity-50 text-sm font-bold bg-black bg-opacity-30 px-3 py-1 rounded">
          TAP TO DUCK
        </div>
      </div>
    </div>
  );
}
