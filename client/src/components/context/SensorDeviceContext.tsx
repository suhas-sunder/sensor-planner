import React, { createContext, useContext, useState, useEffect } from "react";

// SensorData.ts
const SensorData = [
  {
    id: "sensor-001",
    type: "motion",
    name: "Motion Sensor 1",
    x: 100,
    y: 200,
    sensor_rad: 30,
    connectivity: "Wi-Fi 2.4GHz",
  },
];

const DeviceData = [
  {
    id: "device-001",
    type: "appliance",
    label: "Smart Thermostat",
    connectivity: "Wi-Fi 5GHz",
    x: 300,
    y: 300,
    device_radius: 50,
  },
];

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
  const [sensors, setSensors] = useState(SensorData);
  const [devices, setDevices] = useState(DeviceData);

  // 👇 Log any time sensors update
  useEffect(() => {
    console.log("[SensorDeviceProvider] sensors updated:", sensors);
  }, [sensors]);

  // 👇 Log any time devices update
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

export default SensorDeviceProvider;
