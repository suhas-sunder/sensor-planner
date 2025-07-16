interface CanvasAreaProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onCanvasClick?: (x: number, y: number) => void;
  viewport: { x: number; y: number };
  setViewport: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

type Device = {
  id: string;
  x: number;
  y: number;
  type: string;
  state: Record<string, any>;
};

export type { CanvasAreaProps, Device };
