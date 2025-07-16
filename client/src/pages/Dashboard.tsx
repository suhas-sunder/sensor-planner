import { useEffect,useState, useRef } from 'react';

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
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ devices, selectedDeviceId, onCanvasClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Resize canvas to fit container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, []);

  // Redraw on device list change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each device
    devices.forEach((device) => {
      drawDevice(ctx, device, device.id === selectedDeviceId);
    });
  }, [devices, selectedDeviceId]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (onCanvasClick) {
      onCanvasClick(x, y);
    }
  };

  return (
    <div className='flex relative flex-col items-center justify-center w-full h-screen bg-white'>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{ border: '1px solid #ccc', width: '100%', height: '100%' }}
      />
    </div>
  );
};

function drawDevice(
  ctx: CanvasRenderingContext2D,
  device: Device,
  isSelected: boolean
): void {
  const { x, y, type } = device;

  ctx.beginPath();
  ctx.fillStyle = isSelected ? '#ffa500' : '#333';

  if (type.includes('sensor')) {
    ctx.arc(x, y, 10, 0, 2 * Math.PI); // sensor = circle
  } else {
    ctx.rect(x - 10, y - 10, 20, 20); // appliance = square
  }

  ctx.fill();
  ctx.closePath();

  // Optionally label it
  ctx.font = '10px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText(device.type, x + 12, y + 4);
}



export default function Dashboard() {
 const [devices, setDevices] = useState<Device[]>([
  { id: 'test', x: 100, y: 100, type: 'motion_sensor', state: { motion: false } }
]);

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const handleCanvasClick = (x: number, y: number): void => {
    const clicked = devices.find(
      d => Math.hypot(d.x - x, d.y - y) < 15
    );

    if (clicked) {
      setSelectedDeviceId(clicked.id);
    } else {
  const newDevice: Device = {
        id: crypto.randomUUID(),
        x,
        y,
        type: 'motion_sensor',
        state: { motion: false },
      };
      setDevices(prev => [...prev, newDevice]);
    }
  };

  return (
   <div className='flex w-full h-screen bg-black'>
    <div className='flex flex-col w-60 items-center bg-slate-600 text-white'>
      <h1>Menu</h1>
      <div>Add Sensor</div>
    </div>
     <CanvasArea
      devices={devices}
      selectedDeviceId={selectedDeviceId}
      onCanvasClick={handleCanvasClick}
    />
   </div>
  );
}