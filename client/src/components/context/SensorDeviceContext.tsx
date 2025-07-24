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

  // Optional: Init user if needed
  useLocalStorage({ actionType: "user-init-update" });

  // Load once from localStorage
  useLocalStorage({
    actionType: "init",
    setSensors,
    setDevices,
  });

  // Sync whenever sensors/devices update
  useLocalStorage({
    actionType: "sync",
    sensors,
    devices,
  });

  return (
    <SensorContext.Provider value={{ sensors, setSensors }}>
      <DeviceContext.Provider value={{ devices, setDevices }}>
        {children}
      </DeviceContext.Provider>
    </SensorContext.Provider>
  );
};
