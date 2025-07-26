// Custom React hook that provides a continuously looping pulse phase value for animation purposes
import { useEffect, useState } from "react";

export default function usePulseAnimation() {
  // State variable to track the current phase of the pulse animation, ranging from 0 to 1
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    let frameId: number; // Stores the ID of the current animation frame for cleanup
    let lastTime = performance.now(); // Records the timestamp of the last animation frame

    // Animation loop function that updates the pulse phase based on elapsed time
    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime; // Calculate time difference since last frame
      lastTime = currentTime; // Update lastTime to the current frame's timestamp
      const speed = 0.0001; // Controls how fast the pulse phase progresses
      // Update pulse phase by adding the scaled delta, wrapping around to stay within [0, 1)
      setPulsePhase((prev) => (prev + delta * speed) % 1);
      frameId = requestAnimationFrame(animate); // Schedule the next animation frame
    };

    frameId = requestAnimationFrame(animate); // Start the animation loop when the component mounts
    // Cleanup function to cancel the animation frame when the component unmounts
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Return the current pulse phase value to be used by the component
  return pulsePhase;
}
