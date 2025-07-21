import { useEffect, useRef, useState } from "react";
import type { CanvasAreaProps } from "../utils/other/Types";
import RoomData from "../data/RoomData.js";
import DrawSensor from "../utils/drawings/DrawSensor.js";
import DrawRoomWithWalls from "../utils/drawings/DrawRoomWithWalls";
import DrawOriginMarker from "../utils/drawings/DrawOriginMarker";
import Scale from "../overlays/Scale.js";
import DrawDevice from "../utils/drawings/DrawDevice.js";
import useCanvasSize from "../hooks/useCanvasSize.js";
import usePulseAnimation from "../hooks/usePulseAnimation.js";

const CanvasArea: React.FC<CanvasAreaProps> = ({
  sensors,
  devices,
  setSensors,
  setDevices,
  selectedSensorId,
  selectedDeviceId,
  onCanvasClick,
  viewport,
  setViewport,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Create a reference to the canvas
  const canvasSize = useCanvasSize(canvasRef);
  const pulsePhase = usePulseAnimation();

  const [isPanning, setIsPanning] = useState(false); // Track panning state
  const [lastPan, setLastPan] = useState<{ x: number; y: number } | null>(null); // Track last mouse position
  const [draggingSensorId, setDraggingSensorId] = useState<string | null>(null);
  const [draggingDeviceId, setDraggingDeviceId] = useState<string | null>(null);
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

    // Find the sensor that was clicked.
    // Math.hypot is the Pythagorean theorem for distance calculation to find the closest target from the mouse
    const targetSensor = sensors.find(
      (s) =>
        Math.hypot(s.x - mouseX, s.y - mouseY) <=
        (s.sensor_rad || defaultSensorRadius)
    );

    // Find the device that was clicked
    const targetDevice = devices.find(
      (d) =>
        Math.hypot(d.x - mouseX, d.y - mouseY) <=
        (d.device_rad || defaultSensorRadius)
    );

    // Decide which was clicked — prioritize sensor if both overlap
    if (targetSensor) {
      setDraggingSensorId(targetSensor.id); // Set the sensor to be dragged
    } else if (targetDevice) {
      setDraggingDeviceId(targetDevice.id); // Set the device to be dragged
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

    if (draggingSensorId) {
      // If a sensor is being dragged, update its position
      setSensors((prev) =>
        prev.map((d) =>
          d.id === draggingSensorId
            ? { ...d, x: d.x + dx, y: d.y + dy, "prev-x": d.x, "prev-y": d.y }
            : d
        )
      );
    } else if (draggingDeviceId) {
      // If a device is being dragged, update its position
      setDevices((prev) =>
        prev.map((d) =>
          d.id === draggingDeviceId
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
      // Stop dragging
      setDraggingDeviceId(null);
      setDraggingSensorId(null);
      setLastPan(null); // Reset last mouse position
    };

    window.addEventListener("mouseup", handleGlobalMouseUp); // Add event listener
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp); // Remove event listener
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

    devices.forEach((Device) => {
      DrawDevice(
        ctx, // Canvas drawing context
        Device, // The current Sensor to draw
        Device.id === selectedDeviceId, // Highlight if this Sensor is selected
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
        onMouseDown={handleMouseDown} // Handle mouse down
        onMouseMove={handleMouseMove} // Handle mouse move
        className="block w-full h-full"
      />
    </div>
  );
};

export default CanvasArea;
