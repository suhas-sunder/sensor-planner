import { useEffect, useState } from "react";
import type { Device, Sensor } from "../components/utils/other/Types";
import CanvasArea from "../components/ui/CanvasArea";
import SensorData from "../components/data/SensorData.js";
import SidebarMenu from "../components/navigation/SidebarMenu.js";
import DeviceData from "../components/data/DeviceData.js";

export default function Dashboard() {
  const [sensors, setSensors] = useState<Sensor[]>(SensorData());
  const [devices, setDevices] = useState<Device[]>(DeviceData());
  const [viewport, setViewport] = useState({ x: 0, y: 0 });

  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  const handleCanvasClick = (x: number, y: number): void => {
    const clicked = sensors.find(
      (d) => Math.hypot(d.x - x, d.y - y) <= (d.sensor_rad || 30)
    );

    if (clicked) {
      if (selectedSensorId === clicked.id) {
        setSelectedSensorId(null);
      } else {
        setSelectedSensorId(clicked.id);
      }
    } else {
      setSelectedSensorId(null);
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
        sensors={sensors}
        devices={devices}
        selectedDeviceId={null}
        setSensors={setSensors}
        setDevices={setDevices}
        selectedSensorId={selectedSensorId}
        onCanvasClick={handleCanvasClick}
        viewport={viewport}
        setViewport={setViewport}
      />
    </div>
  );
}
