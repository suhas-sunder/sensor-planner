export interface CanvasAreaProps {
  sensors: Sensor[];
  setSensors: React.Dispatch<React.SetStateAction<Sensor[]>>;
  selectedSensorId: string | null;
  onCanvasClick?: (x: number, y: number) => void;
  viewport: { x: number; y: number };
  setViewport: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  onCanvasDoubleClick?: (x: number, y: number) => void;
}

export type Sensor = {
  id: string;
  x: number;
  y: number;
  type: string;
  name: string;
  sensor_rad: number;
  state: Record<string, any>;
};

type WallSide = "top" | "bottom" | "left" | "right";

type WallFeature = {
  side: WallSide;
  offset: number; // Distance from left/top edge of that wall
  length?: number; // Width of the door/window on that wall
};

export type Room = {
  id: string;
  name: string;
  type: string;
  room_number: number | null;
  x: number;
  y: number;
  width: number;
  height: number;
  doors?: WallFeature[];
  windows?: WallFeature[];
};

export type Rooms = Room[];
