import { useContext } from "react";
import {
  SensorContext,
  DeviceContext,
  PeopleContext,
} from "../context/SensorDeviceContextDefs.ts";

// Custom hook that combines both Sensor and Device contexts for easier access
export const useSensorDeviceContext = () => {
  const sensorContext = useContext(SensorContext); // Get the SensorContext using the custom hook
  const deviceContext = useContext(DeviceContext); // Get the DeviceContext using the custom hook
  const peopleContext = useContext(PeopleContext); // Get the PeopleContext using the custom hook

  // Ensure that both contexts are available, otherwise throw an error
  if (!sensorContext || !deviceContext || !peopleContext) {
    throw new Error(
      "useSensorDeviceContext must be used within a SensorDeviceProvider"
    );
  }

  return { ...sensorContext, ...deviceContext, ...peopleContext };
};
export default useSensorDeviceContext;
