import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CanvasArea from "../components/ui/CanvasArea";
import SidebarMenu from "../components/navigation/SidebarMenu.js";
import type { Device, Sensor } from "../components/utils/other/Types.js";
import useSensorDeviceContext from "../components/hooks/useSensorDeviceContext.js";

export default function Dashboard() {
  const { floorId } = useParams();
  const currentFloor = Number(floorId) || 1;

  const { sensors, devices, selectedNodeId, setSelectedNodeId } =
    useSensorDeviceContext();
  const [viewport, setViewport] = useState({ x: 0, y: 0 });

  // Filter for current floor
  const floorSensors = sensors.filter((s) => s.floor === currentFloor);
  const floorDevices = devices.filter((d) => d.floor === currentFloor);

  const handleCanvasClick = (x: number, y: number): void => {
    const clickedSensor = floorSensors.find(
      (sensor: Sensor) =>
        Math.hypot(sensor.x - x, sensor.y - y) <= (sensor.sensor_rad || 30)
    );

    if (clickedSensor) {
      setSelectedNodeId((prev) =>
        prev === clickedSensor.id ? null : clickedSensor.id
      );
      return;
    }

    const clickedDevice = floorDevices.find(
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
