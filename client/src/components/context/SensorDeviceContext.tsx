import React, { useState } from "react";
import { SensorContext, DeviceContext } from "./SensorDeviceContextDefs";
import useLocalStorage from "../hooks/useLocalStorage";
import type { Device, Sensor } from "../utils/other/Types";

export const SensorDeviceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sensors, setSensors] = useState<Sensor[]>([]); // State to hold the list of sensors and its setter
  const [devices, setDevices] = useState<Device[]>([]); // State to hold the list of devices and its setter
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // State to track the currently selected node ID

  // Optionally initialize or update user information in localStorage when component mounts
  useLocalStorage({ actionType: "user-init-update" });

  // Load sensors, devices, and selected node ID from localStorage only once on component mount
  useLocalStorage({
    actionType: "init",
    setSensors,
    setDevices,
    setSelectedNodeId,
  });

  // Sync the current sensors, devices, and selected node ID to localStorage whenever they change
  useLocalStorage({
    actionType: "sync",
    sensors,
    devices,
    selectedNodeId,
    setSelectedNodeId,
  });

  return (
    <SensorContext.Provider
      value={{ sensors, setSensors, selectedNodeId, setSelectedNodeId }}
    >
      <DeviceContext.Provider value={{ devices, setDevices }}>
        {children}
      </DeviceContext.Provider>
    </SensorContext.Provider>
  );
};
