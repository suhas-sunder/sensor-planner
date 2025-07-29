export interface CanvasAreaProps {
  selectedNodeId: string | null;
  onCanvasClick?: (x: number, y: number) => void;
  viewport: { x: number; y: number };
  setViewport: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  onCanvasDoubleClick?: (x: number, y: number) => void;
}

type WallSide = "top" | "bottom" | "left" | "right";

type WallFeature = {
  side: WallSide;
  offset: number; // Distance from left/top edge of that wall
  length?: number; // Width of the door/window on that wall
};

export type Room = {
  id: string;
  floor?: number;
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
  people?: Person[];
  selectedNodeId?: string | null;
  eventLog?: SimulationEvent[];
  floorIds?: string[];
  setPeople?: React.Dispatch<React.SetStateAction<Person[]>>;
  setSensors?: React.Dispatch<React.SetStateAction<Sensor[]>>;
  setDevices?: React.Dispatch<React.SetStateAction<Device[]>>;
  setSelectedNodeId?: React.Dispatch<React.SetStateAction<string | null>>;
  setEventLog?: React.Dispatch<React.SetStateAction<SimulationEvent[]>>;
  setFloorIds?: React.Dispatch<React.SetStateAction<string[]>>;
};

export type CursorPosition = {
  cursorPosition: { x: number; y: number } | null;
};

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
  floor: number;
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
  floor: number;
};

export type Person = {
  id: string;
  name: string;
  floor: number;
  path: { x: number; y: number }[];
  currentIndex: number;
  direction: 1 | -1;
  color?: string;
  animationSpeed: number; // pixels per second
  progress?: number;
};

export type SimulationEvent = {
  id: string;
  floor: number;
  nodeId: string;
  nodeType: "sensor" | "device" | "person";
  eventType: "connectivity" | "interference" | "motion" | "status";
  timestamp: number;
  message: string; // Human-readable summary
};
