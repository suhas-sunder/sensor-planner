import React, { useState, useEffect } from "react";
import { SensorContext, DeviceContext } from "./SensorDeviceContextDefs";
import { SensorData, DeviceData } from "../data/SensorDeviceData";

export const SensorDeviceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sensors, setSensors] = useState(SensorData);
  const [devices, setDevices] = useState(DeviceData);

  useEffect(() => {
    console.log("[SensorDeviceProvider] sensors updated:", sensors);
  }, [sensors]);

  useEffect(() => {
    console.log("[SensorDeviceProvider] devices updated:", devices);
  }, [devices]);

  return (
    <SensorContext.Provider value={{ sensors, setSensors }}>
      <DeviceContext.Provider value={{ devices, setDevices }}>
        {children}
      </DeviceContext.Provider>
    </SensorContext.Provider>
  );
};
