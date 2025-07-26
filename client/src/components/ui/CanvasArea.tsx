import { useEffect, useRef, useState } from "react";
import type {
  CanvasAreaProps,
  Device,
  Person,
  Sensor,
} from "../utils/other/Types";
import RoomData from "../data/RoomData.js";
import DrawSensor from "../utils/drawings/DrawSensor.js";
import DrawRoomWithWalls from "../utils/drawings/DrawRoomWithWalls";
import DrawOriginMarker from "../utils/drawings/DrawOriginMarker";
import Scale from "../overlays/Scale.js";
import DrawDevice from "../utils/drawings/DrawDevice.js";
import useCanvasSize from "../hooks/useCanvasSize.js";
import usePulseAnimation from "../hooks/usePulseAnimation.js";
import useSensorDeviceContext from "../hooks/useSensorDeviceContext.js";
import DispCursorPos from "../overlays/DispCursorPos.js";
import DetectConnectedNodes from "../utils/computations/DetectConnectedNodes.js";
import DetectInterferenceNodes from "../utils/computations/DetectInterferenceNodes.js";
import { useParams } from "react-router-dom";
import DrawPeople from "../utils/drawings/DrawPeople.js";
const CanvasArea: React.FC<CanvasAreaProps> = ({
  selectedNodeId,
  onCanvasClick,
  viewport,
  setViewport,
}) => {
  const { floorId } = useParams(); // returns "1", "2", etc.
  const currentFloor = Number(floorId) || 1; // fallback to floor 1 if undefined or invalid
  const { sensors, setSensors, devices, setDevices } = useSensorDeviceContext();
  const floorSensors = sensors.filter((s) => s.floor === currentFloor);
  const floorDevices = devices.filter((d) => d.floor === currentFloor);

  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Create a reference to the canvas
  const canvasSize = useCanvasSize(canvasRef);
  const pulsePhase = usePulseAnimation();

  const [isPanning, setIsPanning] = useState(false); // Track panning state
  const [lastPan, setLastPan] = useState<{ x: number; y: number } | null>(null); // Track last mouse position
  const [draggingSensorId, setDraggingSensorId] = useState<string | null>(null);
  const [draggingDeviceId, setDraggingDeviceId] = useState<string | null>(null);
  const defaultSensorRadius = 30;
  const [people, setPeople] = useState<Person[]>([
    {
      id: "person-1",
      floor: 4,
      path: [
        { x: 100, y: 100 },
        { x: 400, y: 100 },
        { x: 400, y: 300 },
        { x: 600, y: 300 },
        { x: 1200, y: 200 },
      ],
      currentIndex: 0,
      direction: 1,
      blink: true,
      color: "deeppink",
      currentPosition: { x: 100, y: 100 },
      animationSpeed: 140, // pixels/sec
    },
  ]);

  const floorPeople = people.filter((p) => p.floor === currentFloor);

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

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return; // Check if the canvas exists

    const dx = e.movementX;
    const dy = e.movementY;

    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldX = screenX + viewport.x;
    const worldY = screenY + viewport.y;
    setCursorPosition({ x: Math.round(worldX), y: Math.round(worldY) });

    if (draggingSensorId) {
      // If a sensor is being dragged, update its position
      setSensors((prev: Sensor[]) =>
        prev.map((d) =>
          d.id === draggingSensorId
            ? { ...d, x: d.x + dx, y: d.y + dy, "prev-x": d.x, "prev-y": d.y }
            : d
        )
      );
    } else if (draggingDeviceId) {
      // If a device is being dragged, update its position
      setDevices((prev: Device[]) =>
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

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldX = screenX + viewport.x;
    const worldY = screenY + viewport.y;

    setCursorPosition({ x: Math.round(worldX), y: Math.round(worldY) });

    const mouseX = worldX;
    const mouseY = worldY;

    const targetSensor = floorSensors.find(
      (sensor) =>
        Math.hypot(sensor.x - mouseX, sensor.y - mouseY) <=
        (sensor.sensor_rad || defaultSensorRadius)
    );

    const targetDevice = floorDevices.find(
      (device) =>
        Math.hypot(device.x - mouseX, device.y - mouseY) <=
        (device.device_rad || defaultSensorRadius)
    );

    if (targetSensor) {
      setSensors((prev) =>
        prev.map((sensor) => {
          if (sensor.id === targetSensor.id) {
            return {
              ...sensor,
              connectedDeviceIds: [],
              interferenceIds: [],
            };
          }
          return sensor;
        })
      );

      setDevices((prev) =>
        prev.map((device) => {
          if (
            targetSensor.connectedDeviceIds?.includes(device.id) ||
            targetSensor.interferenceIds?.includes(device.id)
          ) {
            return {
              ...device,
              connectedSensorIds: device.connectedSensorIds?.filter(
                (id) => id !== targetSensor.id
              ),
              interferenceIds: device.interferenceIds?.filter(
                (id) => id !== targetSensor.id
              ),
            };
          }
          return device;
        })
      );

      setDraggingSensorId(targetSensor.id);
    } else if (targetDevice) {
      setDevices((prev) =>
        prev.map((device) => {
          if (device.id === targetDevice.id) {
            return {
              ...device,
              connectedSensorIds: [],
              interferenceIds: [],
            };
          }
          return device;
        })
      );

      setSensors((prev) =>
        prev.map((sensor) => {
          if (
            targetDevice.connectedSensorIds?.includes(sensor.id) ||
            targetDevice.interferenceIds?.includes(sensor.id)
          ) {
            return {
              ...sensor,
              connectedDeviceIds: sensor.connectedDeviceIds?.filter(
                (id) => id !== targetDevice.id
              ),
              interferenceIds: sensor.interferenceIds?.filter(
                (id) => id !== targetDevice.id
              ),
            };
          }
          return sensor;
        })
      );

      setDraggingDeviceId(targetDevice.id);
    } else {
      setIsPanning(true);
      setLastPan({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse up
  // Add at the top
  const sensorsRef = useRef(sensors);
  const devicesRef = useRef(devices);
  useEffect(() => {
    sensorsRef.current = sensors;
    devicesRef.current = devices;
  }, [sensors, devices]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsPanning(false);
      setDraggingDeviceId(null);
      setDraggingSensorId(null);
      setLastPan(null);

      if (draggingDeviceId || draggingSensorId) {
        const { updatedSensors, updatedDevices } = DetectConnectedNodes(
          sensorsRef.current,
          devicesRef.current
        );

        const {
          updatedSensors: sensorsWithInterference,
          updatedDevices: devicesWithInterference,
        } = DetectInterferenceNodes(updatedSensors, updatedDevices);

        setSensors(sensorsWithInterference);
        setDevices(devicesWithInterference);
      }

      console.log("Sensors: " + JSON.stringify(sensorsRef.current));
      console.log("Devices: " + JSON.stringify(devicesRef.current));
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [draggingDeviceId, draggingSensorId, setDevices, setSensors]);

  // Re-draw the canvas whenever floorSensors, selection, viewport, size, or pulse phase changes
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

    floorDevices.forEach((Device: Device) => {
      DrawDevice(
        ctx, // Canvas drawing context
        Device, // The current Sensor to draw
        Device.id === selectedNodeId, // Highlight if this Sensor is selected
        viewport, // Viewport offset (for panning)
        pulsePhase // Current animation state for pulsing effect
      );
    });

    // Loop over each Sensor and draw it
    floorSensors.forEach((Sensor: Sensor) => {
      DrawSensor(
        ctx, // Canvas drawing context
        Sensor, // The current Sensor to draw
        Sensor.id === selectedNodeId, // Highlight if this Sensor is selected
        viewport, // Viewport offset (for panning)
        pulsePhase // Current animation state for pulsing effect
      );
    });

    floorPeople.forEach((person) => {
      DrawPeople(ctx, person, viewport);
    });
  }, [
    floorSensors, // Redraw if floorSensors added, removed, or updated
    floorDevices, // Redraw if floorDevices added, removed, or updated
    selectedNodeId, // Redraw if node selection changes
    viewport, // Redraw when panning the canvas
    canvasSize, // Redraw when canvas is resized
    pulsePhase, // Redraw every animation frame to reflect pulse animation
  ]);

  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp: number | null = null;

    const updatePositions = (timestamp: number) => {
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      setPeople((prevPeople) => {
        const now = new Date().toISOString();
        const newPeople = prevPeople.map((person) => {
          if (person.floor !== currentFloor || person.path.length < 2) {
            return person;
          }

          const { path, currentIndex, direction, animationSpeed = 80 } = person;

          const nextIndex = currentIndex + direction;
          const reachedEnd = nextIndex < 0 || nextIndex >= path.length;

          const start = path[currentIndex];
          const end = path[reachedEnd ? currentIndex - direction : nextIndex];

          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const distance = Math.hypot(dx, dy);

          const moveStep = animationSpeed * delta;
          const newX = person.currentPosition.x + (dx / distance) * moveStep;
          const newY = person.currentPosition.y + (dy / distance) * moveStep;

          const traveled = Math.hypot(newX - start.x, newY - start.y);
          const reached = traveled >= distance;

          const updatedPosition = reached ? end : { x: newX, y: newY };

          // Check overlap with motion sensors
          for (const sensor of sensorsRef.current) {
            if (
              (sensor.type === "motion" || sensor.type === "presence") &&
              sensor.floor === person.floor
            ) {
              const sx = sensor.x;
              const sy = sensor.y;
              const sr = sensor.sensor_rad ?? 150;

              const dist = Math.hypot(
                updatedPosition.x - sx,
                updatedPosition.y - sy
              );
              const inRange = dist <= sr;

              const key = `${sensor.id}-${person.id}`;
              if (inRange) {
                if (!(window as any)._motionLogActive?.[key]) {
                  console.log(
                    `[MOTION START] ${sensor.name} saw ${person.id} at ${now}`
                  );
                  (window as any)._motionLogActive = {
                    ...(window as any)._motionLogActive,
                    [key]: now,
                  };
                }
              } else {
                if ((window as any)._motionLogActive?.[key]) {
                  console.log(
                    `[MOTION END] ${sensor.name} lost ${person.id} at ${now}`
                  );
                  delete (window as any)._motionLogActive[key];
                }
              }
            }
          }

          return {
            ...person,
            currentPosition: updatedPosition,
            currentIndex: reached ? nextIndex : currentIndex,
            direction:
              reached && (nextIndex === path.length - 1 || nextIndex === 0)
                ? (-direction as 1 | -1)
                : direction,
          };
        });

        return newPeople;
      });

      animationFrameId = requestAnimationFrame(updatePositions);
    };

    animationFrameId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentFloor]);

  return (
    <div className="flex relative flex-col items-center justify-center w-full h-screen bg-white overflow-hidden cursor-pointer">
      <Scale />
      <DispCursorPos cursorPosition={cursorPosition} />

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
