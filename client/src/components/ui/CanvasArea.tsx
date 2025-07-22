// CanvasArea.tsx (Fabric.js v6+ full implementation)
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import type { CanvasAreaProps } from "../utils/other/Types";
import RoomData from "../data/RoomData";
import DrawSensor from "../utils/drawings/DrawSensor.js";
import DrawRoomWithWalls from "../utils/drawings/DrawRoomWithWalls";
import DrawOriginMarker from "../utils/drawings/DrawOriginMarker";
import Scale from "../overlays/Scale.js";
import DrawDevice from "../utils/drawings/DrawDevice.js";
import useCanvasSize from "../hooks/useCanvasSize.js";
import usePulseAnimation from "../hooks/usePulseAnimation.js";

const CanvasArea: React.FC<
  Omit<CanvasAreaProps, "setSensors" | "setDevices">
> = ({
  sensors,
  devices,
  selectedSensorId,
  selectedDeviceId,
  onCanvasClick,
  viewport,
  setViewport,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasSize = useCanvasSize(canvasRef);
  const pulsePhase = usePulseAnimation();
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const instance = new FabricCanvas(canvasRef.current, {
      selection: false,
      preserveObjectStacking: true,
    });

    setFabricCanvas(instance);

    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    instance.on("mouse:down", (opt) => {
      const evt = opt.e as MouseEvent;
      isDragging = true;
      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
    });

    instance.on("mouse:move", (opt) => {
      if (!isDragging) return;
      const evt = opt.e as MouseEvent;

      const dx = evt.clientX - lastPosX;
      const dy = evt.clientY - lastPosY;

      const transform = instance.viewportTransform!;
      transform[4] += dx;
      transform[5] += dy;
      instance.requestRenderAll();

      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
    });

    instance.on("mouse:up", () => {
      isDragging = false;
    });

    return () => {
      instance.dispose();
    };
  }, []);

  // Redraw all elements when state changes
  useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();

    DrawOriginMarker(fabricCanvas, viewport);

    RoomData().forEach((room) => {
      DrawRoomWithWalls(fabricCanvas, room, viewport);
    });

    sensors.forEach((sensor) => {
      DrawSensor(
        fabricCanvas,
        sensor,
        selectedSensorId === sensor.id,
        viewport,
        pulsePhase
      );
    });

    devices.forEach((device) => {
      DrawDevice(
        fabricCanvas,
        device,
        selectedDeviceId === device.id,
        viewport,
        pulsePhase
      );
    });

    fabricCanvas.renderAll();
  }, [
    fabricCanvas,
    sensors,
    devices,
    selectedSensorId,
    selectedDeviceId,
    viewport,
    pulsePhase,
  ]);

  // Handle click interaction
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const worldX = screenX + viewport.x;
    const worldY = screenY + viewport.y;

    onCanvasClick?.(worldX, worldY);
  };

  return (
    <div className="flex relative flex-col items-center justify-center w-full h-screen bg-white cursor-pointer">
      <Scale />
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onDoubleClick={handleClick}
        className="block w-full h-full"
      />
    </div>
  );
};

export default CanvasArea;
