export interface CanvasAreaProps {
  selectedNodeId: string | null;
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
  connectivity: string[];
  connectedDeviceIds?: string[];
  interferenceIds?: string[];
};

export type Device = {
  id: string;
  x: number;
  y: number;
  type: string;
  label: string;
  name: string;
  device_rad: number;
  connectivity: string[];
  compatibleSensors: string[];
  interferenceProtocols: string[];
  connectedSensorIds?: string[];
  interferenceIds?: string[];
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

export type SearchItem = {
  id: string;
  name: string;
  type: string;
};

export type LocalStorageData = {
  actionType: string;
  sensors?: Sensor[];
  devices?: Device[];
  selectedNodeId?: string | null;
  setSensors?: React.Dispatch<React.SetStateAction<Sensor[]>>;
  setDevices?: React.Dispatch<React.SetStateAction<Device[]>>;
  setSelectedNodeId?: React.Dispatch<React.SetStateAction<string | null>>;
};

export type CursorPosition = {
  cursorPosition: { x: number; y: number } | null;
};
