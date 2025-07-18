import { useEffect, useRef, useState } from "react";
import type { CanvasAreaProps } from "../utils/other/Types";
import RoomData from "../data/RoomData.js";
import DrawSensor from "../utils/drawings/DrawSesnsor";
import DrawRoomWithWalls from "../utils/drawings/DrawRoomWithWalls";
import DrawOriginMarker from "../utils/drawings/DrawOriginMarker";
import Scale from "../overlays/Scale.js";

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
  const defaultSensorRadius = 30;

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

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect(); // Get the canvas rectangle
    const mouseX = e.clientX - rect.left + viewport.x; // Get the mouse coordinates
    const mouseY = e.clientY - rect.top + viewport.y; // Get the mouse coordinates

    // Check if the mouse is over a sensor
    const target = sensors.find(
      (d) =>
        Math.hypot(d.x - mouseX, d.y - mouseY) <=
        (d.sensor_rad || defaultSensorRadius)
    );

    // If the mouse is over a sensor, start dragging
    if (target) {
      setDraggingSensorId(target.id); // Set the dragging sensor
    } else {
      setIsPanning(true); // Start panning
      setLastPan({ x: e.clientX, y: e.clientY }); // Set the last mouse position
    }
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return; // Check if the canvas exists

    const dx = e.movementX; // Get the mouse movement
    const dy = e.movementY; // Get the mouse movement

    // If a sensor is being dragged, update its position
    if (draggingSensorId) {
      setSensors((prev) =>
        prev.map((d) =>
          d.id === draggingSensorId
            ? { ...d, x: d.x + dx, y: d.y + dy, "prev-x": d.x, "prev-y": d.y }
            : d
        )
      );
    } else if (isPanning && lastPan) {
      // If panning, update the viewport
      setViewport((prev) => ({
        x: prev.x - dx,
        y: prev.y - dy,
      }));
    }
  };

  // Handle mouse up
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsPanning(false); // Stop panning
      setDraggingSensorId(null); // Stop dragging
      setLastPan(null); // Reset last mouse position
    };

    window.addEventListener("mouseup", handleGlobalMouseUp); // Add event listener
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp); // Remove event listener
  }, []);

  useEffect(() => {
    let frameId: number; // Animation frame ID
    let lastTime = performance.now(); // Initialize lastTime

    // Animation loop for pulsating sensors
    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime; // Time since last frame
      lastTime = currentTime; // Update lastTime

      const speed = 0.0001; // Phase speed per ms
      const maxPulsePhase = 1; // Maximum phase value
      // pulsePhase is being treated as a normalized phase in the range [0, 1), representing progress through one full animation cycle (like 0% to 100%). Keeps the value looping between 0 and 1
      setPulsePhase((prev) => (prev + delta * speed) % maxPulsePhase); // Update phase based on time elapsed since last frame and speed constant

      frameId = requestAnimationFrame(animate); // Schedule next frame
    };

    frameId = requestAnimationFrame(animate); // Start animation
    return () => cancelAnimationFrame(frameId); // Cancel animation on component unmount
  }, []);

  // Update canvas size on window resize
  useEffect(() => {
    const canvas = canvasRef.current; // Get the canvas
    if (!canvas) return; // Exit early if not mounted yet

    const resize = () => {
      canvas.width = canvas.offsetWidth; // update canvas width
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

    DrawOriginMarker(ctx, viewport); // Draw the origin marker

    RoomData().forEach((room) => {
      DrawRoomWithWalls(ctx, room, viewport); // Draw all rooms
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
      <Scale />
      <canvas
        ref={canvasRef}
        onDoubleClick={handleClick} // Select sensor on double click
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        className="block w-full h-full"
      />
    </div>
  );
};

export default CanvasArea;
