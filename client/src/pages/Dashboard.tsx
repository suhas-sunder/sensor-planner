import { useEffect, useState, useRef } from "react";

type Device = {
  id: string;
  x: number;
  y: number;
  type: string;
  state: Record<string, any>;
};

interface CanvasAreaProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onCanvasClick?: (x: number, y: number) => void;
  viewport: { x: number; y: number };
  setViewport: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  devices,
  selectedDeviceId,
  onCanvasClick,
  viewport,
  setViewport,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      setCanvasSize({ width: canvas.width, height: canvas.height }); // triggers redraw
    };

    resize(); // initial call
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  // Redraw on device list change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    devices.forEach((device) => {
      drawDevice(ctx, device, device.id === selectedDeviceId, viewport);
    });
  }, [devices, selectedDeviceId, viewport, canvasSize]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const worldX = screenX + viewport.x;
    const worldY = screenY + viewport.y;

    if (onCanvasClick) {
      onCanvasClick(worldX, worldY);
    }
  };

  const [isPanning, setIsPanning] = useState(false);
  const [lastPan, setLastPan] = useState<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setLastPan({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !lastPan) return;
    const dx = e.clientX - lastPan.x;
    const dy = e.clientY - lastPan.y;
    setViewport((prev) => ({ x: prev.x - dx, y: prev.y - dy }));
    setLastPan({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setLastPan(null);
  };

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

function drawDevice(
  ctx: CanvasRenderingContext2D,
  device: Device,
  isSelected: boolean,
  viewport: { x: number; y: number }
): void {
  const screenX = device.x - viewport.x;
  const screenY = device.y - viewport.y;

  ctx.beginPath();
  ctx.fillStyle = isSelected ? "#ffa500" : "#333";

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

export default function Dashboard() {
  const [devices, _setDevices] = useState<Device[]>([
    {
      id: "test",
      x: 100,
      y: 100,
      type: "motion_sensor",
      state: { motion: false },
    },
  ]);

  const [viewport, setViewport] = useState({ x: 0, y: 0 });

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const handleCanvasClick = (x: number, y: number): void => {
    const clicked = devices.find((d) => Math.hypot(d.x - x, d.y - y) < 15);
    if (clicked) {
      setSelectedDeviceId(clicked.id);
    } else {
      setSelectedDeviceId(null); // optional: deselect if nothing clicked
    }
  };

  return (
    <div className="flex w-full h-screen bg-black">
      <div className="flex flex-col w-60 items-center bg-slate-600 gap-5 text-white">
        <h1 className="flex font-bold text-2xl mt-4 mb-2">Floor 1 Menu</h1>
        <div className="flex flex-col gap-3 border-2 border-white rounded-md p-2 px-4">
          <div>Motion Sensor 1</div>
          <div className="w-40 h-40 bg-slate-400 rounded-md">
            SENSOR PREVIEW IMG
          </div>
          <div>Status: Active </div>
          <div>Setting 1</div>
          <div>Setting 2</div>
          <div>Setting 3</div>
          <div>Setting 4</div>
        </div>
        <div className="flex flex-col gap-8 mt-auto -translate-y-25">
          <button className="border-2 border-white rounded-md p-2">
            Add Sensor
          </button>
          <button className="border-2 border-white rounded-md p-2">
            Add Device
          </button>
        </div>
      </div>
      <CanvasArea
        devices={devices}
        selectedDeviceId={selectedDeviceId}
        onCanvasClick={handleCanvasClick}
        viewport={viewport}
        setViewport={setViewport}
      />
    </div>
  );
}
