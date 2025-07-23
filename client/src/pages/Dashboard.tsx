import { useEffect, useState } from "react";
import CanvasArea from "../components/ui/CanvasArea";
import SidebarMenu from "../components/navigation/SidebarMenu.js";

import { useSensorContext } from "../components/context/SensorDeviceContext.js";
import type { Sensor } from "../components/utils/other/Types.js";

export default function Dashboard() {
  const { sensors } = useSensorContext();
  const [viewport, setViewport] = useState({ x: 0, y: 0 });

  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  const handleCanvasClick = (x: number, y: number): void => {
    const clicked = sensors.find(
      (sensor: Sensor) =>
        Math.hypot(sensor.x - x, sensor.y - y) <= (sensor.sensor_rad || 30)
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
        selectedDeviceId={null}
        selectedSensorId={selectedSensorId}
        onCanvasClick={handleCanvasClick}
        viewport={viewport}
        setViewport={setViewport}
      />
    </div>
  );
}
