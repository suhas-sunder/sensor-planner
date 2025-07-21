// hooks/useCanvasSize.ts
import { useState, useEffect } from "react";

export default function useCanvasSize(
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      setCanvasSize({ width: canvas.width, height: canvas.height });
    };

    resize(); // Initial size
    const observer = new ResizeObserver(resize);
    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => observer.disconnect();
  }, [canvasRef]);

  return canvasSize;
}
