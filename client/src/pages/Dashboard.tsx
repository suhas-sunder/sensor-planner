import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CanvasArea from "../components/ui/CanvasArea";
import SidebarMenu from "../components/navigation/SidebarMenu.js";
import type { Device, Sensor } from "../components/utils/other/Types.js";
import useSensorDeviceContext from "../components/hooks/useSensorDeviceContext.js";
import DispEventLogs from "../components/layout/DispEventLogs.js";
import { FetchAllLayoutData } from "../services/api/FetchAllLayoutData.js";

export default function Dashboard() {
  const { floorId } = useParams();
  const currentFloor = Number(floorId) || 1;

  useEffect(() => {
    const loadEverything = async () => {
      try {
        const data = await FetchAllLayoutData(currentFloor.toString());

        console.log(`--- Layout Data for Floor ${currentFloor} ---`);
        console.log(
          "TESTING FETCH REQUEST FROM BACKEND API FOR LAYOUT DATA IN DEVELOPMENT MODE!"
        );

        console.group("Sensors");
        console.table(data.sensors);
        console.groupEnd();

        console.group("Devices");
        console.table(data.devices);
        console.groupEnd();

        console.group("People");
        console.table(data.people);
        console.groupEnd();

        console.group("Events");
        console.table(data.events);
        console.groupEnd();
      } catch (error) {
        console.error("Error fetching layout data:", error);
      }
    };

    loadEverything();
  }, [currentFloor]);

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
      <DispEventLogs />
    </div>
  );
}
