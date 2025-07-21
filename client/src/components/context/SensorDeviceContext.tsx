import React, { createContext, useContext, useState } from "react";

// Sensor context
const SensorContext = createContext<any>(null);
export const useSensorContext = () => useContext(SensorContext);

// Device context
const DeviceContext = createContext<any>(null);
export const useDeviceContext = () => useContext(DeviceContext);

// Unified provider
export const SensorDeviceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sensors, setSensors] = useState([]);
  const [devices, setDevices] = useState([]);

  return (
    <SensorContext.Provider value={{ sensors, setSensors }}>
      <DeviceContext.Provider value={{ devices, setDevices }}>
        {children}
      </DeviceContext.Provider>
    </SensorContext.Provider>
  );
};

export default SensorDeviceProvider;
