// hooks/usePulseAnimation.ts
import { useEffect, useState } from "react";

export default function usePulseAnimation() {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      const speed = 0.0001;
      setPulsePhase((prev) => (prev + delta * speed) % 1);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return pulsePhase;
}
