import { createContext } from "react";
import type { Device, Sensor } from "../utils/other/Types";

// Defines the shape of the context for managing sensors, including state and setters
export interface SensorContextType {
  setSensors: React.Dispatch<React.SetStateAction<Sensor[]>>; // Function to update the list of sensors
  sensors: Sensor[]; // Array holding the current list of sensors
  selectedNodeId: string | null; // ID of the currently selected sensor node, or null if none is selected
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>; // Function to update the selected node ID
}

// Creates a React context for sensors with the defined type, defaulting to null
export const SensorContext = createContext<SensorContextType | null>(null);

// Defines the shape of the context for managing devices, including state and setters
export interface DeviceContextType {
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>; // Function to update the list of devices
  devices: Device[]; // Array holding the current list of devices
}

// Creates a React context for devices with the defined type, defaulting to null
export const DeviceContext = createContext<DeviceContextType | null>(null);
