import { useEffect, useRef, useState } from "react";
import type { CanvasAreaProps, Sensor, Room } from "../utils/other/Types";
import RoomData from "../data/RoomData";

// Function to draw a Sensor on the canvas
function drawSensor(
  ctx: CanvasRenderingContext2D,
  Sensor: Sensor,
  isSelected: boolean,
  viewport: { x: number; y: number },
  pulsePhase: number // ← NEW
): void {
  const screenX = Sensor.x - viewport.x;
  const screenY = Sensor.y - viewport.y;

  const maxRadius = Sensor.sensor_rad || 30;
  const animatedRadius = pulsePhase * maxRadius;

  // Pulsing ring effect
  ctx.beginPath();
  ctx.strokeStyle = "rgba(0, 123, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.arc(screenX, screenY, animatedRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  const secondaryRadius = ((pulsePhase + 0.5) % 1) * maxRadius;
  ctx.beginPath();
  ctx.strokeStyle = "rgba(0, 123, 255, 0.2)";
  ctx.lineWidth = 1;
  ctx.arc(screenX, screenY, secondaryRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  // Static transparent sensor area
  ctx.beginPath();
  ctx.fillStyle = "rgba(0, 123, 255, 0.15)";
  ctx.arc(screenX, screenY, maxRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  // Main circle
  ctx.beginPath();
  ctx.fillStyle = isSelected ? "#ff0000ff" : "#333";
  ctx.arc(screenX, screenY, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  // 🏷 Sensor label
  ctx.font = "10px Arial";
  ctx.fillStyle = "#000";
  const text = Sensor.name;
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(text, screenX - textWidth / 2, screenY + 25);
}
function drawRoomWithWalls(
  ctx: CanvasRenderingContext2D,
  room: Room,
  viewport: { x: number; y: number },
  wallThickness = 3
) {
  const screenX = room.x - viewport.x;
  const screenY = room.y - viewport.y;

  ctx.save();

  const walls = {
    top: { x: screenX, y: screenY, w: room.width, h: wallThickness },
    bottom: {
      x: screenX,
      y: screenY + room.height - wallThickness,
      w: room.width,
      h: wallThickness,
    },
    left: { x: screenX, y: screenY, w: wallThickness, h: room.height },
    right: {
      x: screenX + room.width - wallThickness,
      y: screenY,
      w: wallThickness,
      h: room.height,
    },
  };

  // Draw all walls
  ctx.fillStyle = "#000";
  for (const wall of Object.values(walls)) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  }

  // Draw doors (as white sections)
  room.doors?.forEach(({ side, offset, length = 30 }) => {
    const wall = walls[side];
    ctx.fillStyle = "#fff";
    if (side === "top" || side === "bottom") {
      ctx.fillRect(wall.x + offset, wall.y, length, wall.h);
    } else {
      ctx.fillRect(wall.x, wall.y + offset, wall.w, length);
    }

    // Optional: draw small brown rectangle to indicate door
    ctx.fillStyle = "#654321";
    if (side === "top" || side === "bottom") {
      ctx.fillRect(wall.x + offset, wall.y, 8, wall.h);
    } else {
      ctx.fillRect(wall.x, wall.y + offset, wall.w, 8);
    }
  });

  // Draw windows (as light blue segments)
  room.windows?.forEach(({ side, offset, length = 30 }) => {
    const wall = walls[side];
    ctx.fillStyle = "#66ccff";
    if (side === "top" || side === "bottom") {
      ctx.fillRect(wall.x + offset, wall.y, length, 4);
    } else {
      ctx.fillRect(wall.x, wall.y + offset, 4, length);
    }
  });

  // Room label
  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(room.name, screenX + room.width / 2, screenY + room.height / 2);

  ctx.restore();
}

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
      const speed = 0.005;
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
    RoomData().forEach((room) => {
      drawRoomWithWalls(ctx, room, viewport);
    });

    // Loop over each Sensor and draw it
    sensors.forEach((Sensor) => {
      drawSensor(
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
