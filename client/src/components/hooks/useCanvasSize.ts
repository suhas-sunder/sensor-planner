import { useState, useEffect } from "react";

// Custom React hook to track and update the size of a canvas element in real-time
export default function useCanvasSize(
  canvasRef: React.RefObject<HTMLCanvasElement | null> // Reference to the canvas DOM element
) {
  // State to store the current width and height of the canvas
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Function to update the canvas size state and set the canvas's width and height properties
    const resize = () => {
      if (!canvasRef.current) return; // Exit if the canvas reference is not set
      const canvas = canvasRef.current; // Get the current canvas element
      canvas.width = canvas.offsetWidth; // Set the canvas width to its displayed width
      canvas.height = canvas.offsetHeight; // Set the canvas height to its displayed height
      setCanvasSize({ width: canvas.width, height: canvas.height }); // Update the state with the new size
    };

    resize(); // Call resize initially to set the canvas size when the component mounts

    // Create a ResizeObserver to watch for changes in the canvas size and call resize when it changes
    const observer = new ResizeObserver(resize);
    if (canvasRef.current) {
      observer.observe(canvasRef.current); // Start observing the canvas element for size changes
    }

    // Cleanup function to disconnect the observer when the component unmounts or dependencies change
    return () => observer.disconnect();
  }, [canvasRef]); // Re-run the effect if the canvasRef changes

  // Return the current canvas size so consuming components can use it
  return canvasSize;
}
