interface CanvasAreaProps {
  devices: Device[];
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  selectedDeviceId: string | null;
  onCanvasClick?: (x: number, y: number) => void;
  viewport: { x: number; y: number };
  setViewport: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  onCanvasDoubleClick?: (x: number, y: number) => void;
}

type Device = {
  id: string;
  x: number;
  y: number;
  type: string;
  name: string;
  sensor_rad: number;
  state: Record<string, any>;
};

export type { CanvasAreaProps, Device };
