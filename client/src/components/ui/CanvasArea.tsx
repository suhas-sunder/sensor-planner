import { useEffect, useRef, useState } from "react";
import type { CanvasAreaProps, Device } from "../utils/other/Types";

// Function to draw a device on the canvas
function drawSensor(
  ctx: CanvasRenderingContext2D,
  device: Device,
  isSelected: boolean,
  viewport: { x: number; y: number },
  pulsePhase: number // ← NEW
): void {
  const screenX = device.x - viewport.x;
  const screenY = device.y - viewport.y;

  const maxRadius = device.sensor_rad || 30;
  const animatedRadius = pulsePhase * maxRadius;

  // 🔵 Pulsing ring effect
  ctx.beginPath();
  ctx.strokeStyle = "rgba(0, 123, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.arc(screenX, screenY, animatedRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  // 🔵 Static transparent sensor area
  ctx.beginPath();
  ctx.fillStyle = "rgba(0, 123, 255, 0.15)";
  ctx.arc(screenX, screenY, maxRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  // ⚫ Main circle
  ctx.beginPath();
  ctx.fillStyle = isSelected ? "#ffa500" : "#333";
  ctx.arc(screenX, screenY, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  // 🏷 Device label
  ctx.font = "10px Arial";
  ctx.fillStyle = "#000";
  const text = device.name;
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(text, screenX - textWidth / 2, screenY + 25);
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  devices,
  setDevices,
  selectedDeviceId,
  onCanvasClick,
  viewport,
  setViewport,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Create a reference to the canvas
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 }); // Track canvas size
  const [isPanning, setIsPanning] = useState(false); // Track panning state
  const [lastPan, setLastPan] = useState<{ x: number; y: number } | null>(null); // Track last mouse position
  const [draggingSensorId, setDraggingSensorId] = useState<string | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    let frameId: number;

    const animate = () => {
      const randomSpeed = 0.015 + Math.random() * 0.01; // varies between 0.015 and 0.025
      setPulsePhase((prev) => (prev + randomSpeed) % 1);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Update canvas size on window resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight; // update canvas height
      setCanvasSize({ width: canvas.width, height: canvas.height }); // triggers redraw
    };

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
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left + viewport.x;
    const mouseY = e.clientY - rect.top + viewport.y;

    const target = devices.find(
      (d) => Math.hypot(d.x - mouseX, d.y - mouseY) <= (d.sensor_rad || 30)
    );

    if (target) {
      setDraggingSensorId(target.id);
    } else {
      setIsPanning(true);
      setLastPan({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const dx = e.movementX;
    const dy = e.movementY;

    if (draggingSensorId) {
      setDevices((prev) =>
        prev.map((d) =>
          d.id === draggingSensorId
            ? { ...d, x: d.x + dx, y: d.y + dy, "prev-x": d.x, "prev-y": d.y }
            : d
        )
      );
    } else if (isPanning && lastPan) {
      setViewport((prev) => ({
        x: prev.x - dx,
        y: prev.y - dy,
      }));
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsPanning(false);
      setDraggingSensorId(null);
      setLastPan(null);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  // Redraw on device list change
  useEffect(() => {
    const canvas = canvasRef.current; // Get the canvas
    if (!canvas) return;
    const ctx = canvas.getContext("2d"); // Get the canvas context
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    devices.forEach((device) => {
      drawSensor(
        ctx,
        device,
        device.id === selectedDeviceId,
        viewport,
        pulsePhase
      );
    });
  }, [devices, selectedDeviceId, viewport, canvasSize, pulsePhase]); // Re-draw on device list change

  return (
    <div className="flex relative flex-col items-center justify-center w-full h-screen bg-white overflow-hidden cursor-pointer">
      <canvas
        ref={canvasRef}
        onDoubleClick={handleClick} // Desktop
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        className="block w-full h-full"
      />
    </div>
  );
};

export default CanvasArea;
