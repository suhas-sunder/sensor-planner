import React, { useState } from "react";
import { SensorContext, DeviceContext } from "./SensorDeviceContextDefs";
import type { Device, Sensor } from "../utils/other/Types";
import useLocalStorage from "../hooks/useLocalStorage";

export const SensorDeviceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Optional: Init user if needed
  useLocalStorage({ actionType: "user-init-update" });

  // Load once from localStorage
  useLocalStorage({
    actionType: "init",
    setSensors,
    setDevices,
    setSelectedNodeId,
  });

  // Sync whenever sensors/devices update
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
