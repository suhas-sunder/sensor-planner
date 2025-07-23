import { useContext } from "react";
import {
  SensorContext,
  DeviceContext,
} from "../context/SensorDeviceContextDefs.ts";

export const useSensorContext = () => useContext(SensorContext);
export const useDeviceContext = () => useContext(DeviceContext);

export const useSensorDeviceContext = () => {
  const sensorContext = useSensorContext();
  const deviceContext = useDeviceContext();

  if (!sensorContext || !deviceContext) {
    throw new Error(
      "useSensorDeviceContext must be used within a SensorDeviceProvider"
    );
  }

  return { ...sensorContext, ...deviceContext };
};
export default useSensorDeviceContext;
