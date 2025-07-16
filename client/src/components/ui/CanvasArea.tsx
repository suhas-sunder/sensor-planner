import { useEffect, useRef, useState } from "react";
import type { CanvasAreaProps, Device } from "../utils/Types";

// Function to draw a device on the canvas
function drawDevice(
  ctx: CanvasRenderingContext2D,
  device: Device,
  isSelected: boolean,
  viewport: { x: number; y: number }
): void {
  const screenX = device.x - viewport.x; // Get the screen coordinates
  const screenY = device.y - viewport.y; // Get the screen coordinates

  ctx.beginPath(); // Start a new path
  ctx.fillStyle = isSelected ? "#ffa500" : "#333"; // Set the fill color

  if (device.type.includes("sensor")) {
    ctx.arc(screenX, screenY, 10, 0, 2 * Math.PI);
  } else {
    ctx.rect(screenX - 10, screenY - 10, 20, 20);
  }

  ctx.fill();
  ctx.closePath();

  ctx.font = "10px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(device.type, screenX + 12, screenY + 4);
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  devices,
  selectedDeviceId,
  onCanvasClick,
  viewport,
  setViewport,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Create a reference to the canvas
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 }); // Track canvas size
  const [isPanning, setIsPanning] = useState(false); // Track panning state
  const [lastPan, setLastPan] = useState<{ x: number; y: number } | null>(null); // Track last mouse position

  // Update canvas size on window resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight; // update canvas height
      setCanvasSize({ width: canvas.width, height: canvas.height }); // triggers redraw
    };

    // const resize = () => {
    //   const scale = window.devicePixelRatio || 1;
    //   canvas.width = canvas.offsetWidth * scale;
    //   canvas.height = canvas.offsetHeight * scale;
    //   ctx?.scale(scale, scale);
    //   setCanvasSize({ width: canvas.width, height: canvas.height });
    // };

    resize(); // initial call
    const observer = new ResizeObserver(resize); // listen for window resize
    observer.observe(canvas); // observe the canvas

    return () => observer.disconnect(); // clean up
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; // Get the canvas
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect(); // Get the canvas rectangle
    const screenX = e.clientX - rect.left; // Get the screen coordinates
    const screenY = e.clientY - rect.top; // Get the screen coordinates

    const worldX = screenX + viewport.x; // Get the world coordinates
    const worldY = screenY + viewport.y; // Get the world coordinates

    if (onCanvasClick) {
      onCanvasClick(worldX, worldY);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true); // Start panning
    setLastPan({ x: e.clientX, y: e.clientY }); // Store the last mouse position
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !lastPan) return; // If not panning, do nothing
    const dx = e.clientX - lastPan.x; // Calculate the change in mouse position
    const dy = e.clientY - lastPan.y; // Calculate the change in mouse position
    setViewport((prev) => ({ x: prev.x - dx, y: prev.y - dy })); // Update the viewport
    setLastPan({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false); // Stop panning
    setLastPan(null); // Reset the last mouse position
  };

  // Redraw on device list change
  useEffect(() => {
    const canvas = canvasRef.current; // Get the canvas
    if (!canvas) return;
    const ctx = canvas.getContext("2d"); // Get the canvas context
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    devices.forEach((device) => {
      drawDevice(ctx, device, device.id === selectedDeviceId, viewport); // Draw each device
    });
  }, [devices, selectedDeviceId, viewport, canvasSize]); // Re-draw on device list change

  return (
    <div className="flex relative flex-col items-center justify-center w-full h-screen bg-white overflow-hidden">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="block w-full h-full"
      />
    </div>
  );
};

export default CanvasArea;
