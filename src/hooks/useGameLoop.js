import { useEffect, useRef } from "react";

export default function useGameLoop(active, updateFn) {
  const reqRef = useRef();

  useEffect(() => {
    let lastTime = performance.now();

    function loop(time) {
      const delta = time - lastTime;
      lastTime = time;
      updateFn(delta);
      reqRef.current = requestAnimationFrame(loop);
    }

    if (active) {
      reqRef.current = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(reqRef.current);
  }, [active, updateFn]);
}
