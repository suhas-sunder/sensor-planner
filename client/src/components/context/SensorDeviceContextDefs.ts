import { createContext } from "react";
import type { Device, Sensor } from "../utils/other/Types";

export interface SensorContextType {
  setSensors: React.Dispatch<React.SetStateAction<Sensor[]>>;
  sensors: Sensor[];
  selectedNodeId: string | null;
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SensorContext = createContext<SensorContextType | null>(null);

export interface DeviceContextType {
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  devices: Device[];
}

export const DeviceContext = createContext<DeviceContextType | null>(null);
