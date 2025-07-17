import { useEffect, useRef, useState } from "react";
import type { CanvasAreaProps } from "../utils/other/Types";
import RoomData from "../data/RoomData.js";
import DrawSensor from "../utils/drawings/DrawSesnsor";
import DrawRoomWithWalls from "../utils/drawings/DrawRoomWithWalls";
import DrawOriginMarker from "../utils/drawings/DrawOriginMarker";

const CanvasArea: React.FC<CanvasAreaProps> = ({
  sensors,
  setSensors,
  selectedSensorId,
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

  // Handle canvas click
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

    const target = sensors.find(
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
      setSensors((prev) =>
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

  useEffect(() => {
    let frameId: number;

    // Animation sensor pulse loop
    const animate = () => {
      const speed = 0.001;
      setPulsePhase((prev) => (prev + speed) % 1);
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

  // Re-draw the canvas whenever sensors, selection, viewport, size, or pulse phase changes
  useEffect(() => {
    const canvas = canvasRef.current; // Get the canvas DOM element
    if (!canvas) return; // Exit early if not mounted yet

    const ctx = canvas.getContext("2d"); // Get the 2D drawing context
    if (!ctx) return; // Exit if context failed to load (safety check)

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas before redrawing

    DrawOriginMarker(ctx, viewport);

    RoomData().forEach((room) => {
      DrawRoomWithWalls(ctx, room, viewport);
    });

    // Loop over each Sensor and draw it
    sensors.forEach((Sensor) => {
      DrawSensor(
        ctx, // Canvas drawing context
        Sensor, // The current Sensor to draw
        Sensor.id === selectedSensorId, // Highlight if this Sensor is selected
        viewport, // Viewport offset (for panning)
        pulsePhase // Current animation state for pulsing effect
      );
    });
  }, [
    sensors, // Redraw if sensors added, removed, or updated
    selectedSensorId, // Redraw if selection changes (to highlight)
    viewport, // Redraw when panning the canvas
    canvasSize, // Redraw when canvas is resized
    pulsePhase, // Redraw every animation frame to reflect pulse animation
  ]);

  return (
    <div className="flex relative flex-col items-center justify-center w-full h-screen bg-white overflow-hidden cursor-pointer">
      <div className="absolute bottom-6 right-6 bg-white/95 px-3 py-2 rounded border border-gray-300 shadow text-black font-mono text-xs">
        <div className="text-center font-bold tracking-wider">SCALE: 1:50</div>

        <div className="flex justify-between gap-[3.2em] -translate-x-[0.2em]">
          <span>0</span>
          <span>3</span>
          <span>6</span>
          <span>9</span>
          <span>12</span>
          <span>15</span>
        </div>
        <div className="relative h-5 mt-1 mb-1 w-60">
          {/* Horizontal bar */}
          <div className="absolute top-2 left-0 right-0 h-0.5 bg-black" />

          {/* Ticks */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 w-0.5 bg-black"
              style={{
                left: `${i * 20}%`,
                height: i === 0 || i === 5 ? "100%" : "60%",
              }}
            />
          ))}
        </div>

        <div className="text-center font-bold tracking-wider">meters</div>
      </div>

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
