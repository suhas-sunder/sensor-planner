import { useEffect, useState } from "react";
import CanvasArea from "../components/ui/CanvasArea";
import SidebarMenu from "../components/navigation/SidebarMenu.js";
import type { Device, Sensor } from "../components/utils/other/Types.js";
import useSensorDeviceContext from "../components/hooks/useSensorDeviceContext.js";

export default function Dashboard() {
  const { sensors, devices, selectedNodeId, setSelectedNodeId } = useSensorDeviceContext();
  const [viewport, setViewport] = useState({ x: 0, y: 0 });

  const handleCanvasClick = (x: number, y: number): void => {
    // Check if a sensor is clicked
    const clickedSensor = sensors.find(
      (sensor: Sensor) =>
        Math.hypot(sensor.x - x, sensor.y - y) <= (sensor.sensor_rad || 30)
    );

    if (clickedSensor) {
      if (selectedNodeId === clickedSensor.id) {
        setSelectedNodeId(null);
      } else {
        setSelectedNodeId(clickedSensor.id);
      }
      return;
    } else {
      setSelectedNodeId(null);
    }

    // Check if a device is clicked
    const clickedDevice = devices.find(
      (device: Device) =>
        Math.hypot(device.x - x, device.y - y) <= (device.device_rad || 30)
    );

    if (clickedDevice) {
      setSelectedNodeId((prev) =>
        prev === clickedDevice.id ? null : clickedDevice.id
      );
    } else {
      setSelectedNodeId(null);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 40, behavior: "smooth" });
    }, 0);
  }, []);

  return (
    <div className="flex w-full h-screen bg-black">
      <SidebarMenu />
      <CanvasArea
        selectedNodeId={selectedNodeId}
        onCanvasClick={handleCanvasClick}
        viewport={viewport}
        setViewport={setViewport}
      />
    </div>
  );
}
