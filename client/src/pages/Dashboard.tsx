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
    <div className="flex flex-col w-full  bg-black">
      <div className="flex flex-row w-full h-full">
        <SidebarMenu />
        <CanvasArea
          selectedNodeId={selectedNodeId}
          onCanvasClick={handleCanvasClick}
          viewport={viewport}
          setViewport={setViewport}
        />
      </div>
      <div className="inline-flex flex-col gap-5 bg-slate-200 w-full min-w-20  p-4 h-100">
        <h2 className="flex font-semibold text-sm text-slate-800 text-[2rem] underline">
          Summary of Simulation & Activity
        </h2>
        <div className="grid grid-cols-3 gap-4 mx-8">
          <div className="flex flex-col items-center bg-white p-4 rounded-lg">
            <h3>Movement Detection</h3>
          </div>
          <div className="flex flex-col items-center bg-white p-4 rounded-lg">
            <h3>Device Status Updates</h3>
          </div>
          <div className="flex flex-col items-center bg-white p-4 rounded-lg">
            <h3>Sensor Status Updates</h3>
          </div>
          <div className="flex flex-col items-center bg-white p-4 rounded-lg">
            <h3>Recent Events</h3>
          </div>
          <div className="flex flex-col items-center bg-white p-4 rounded-lg">
            <h3>Connected Nodes</h3>
          </div>
          <div className="flex flex-col items-center bg-white p-4 rounded-lg">
            <h3>Interfering Nodes</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
