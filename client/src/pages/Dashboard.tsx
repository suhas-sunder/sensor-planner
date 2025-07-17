import { useState } from "react";
import type { Sensor } from "../components/utils/other/Types";
import CanvasArea from "../components/ui/CanvasArea";
import SensorData from "../components/data/SensorData.js";
import SidebarMenu from "../components/navigation/SidebarMenu.js";

export default function Dashboard() {
  const [sensors, setSensors] = useState<Sensor[]>(SensorData());
  const [viewport, setViewport] = useState({ x: 0, y: 0 });

  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  const handleCanvasClick = (x: number, y: number): void => {
    const clicked = sensors.find(
      (d) => Math.hypot(d.x - x, d.y - y) <= (d.sensor_rad || 30)
    );

    if (clicked) {
      selectedSensorId === clicked.id
        ? setSelectedSensorId(null)
        : setSelectedSensorId(clicked.id);
    } else {
      setSelectedSensorId(null);
    }
  };

  return (
    <div className="flex w-full h-screen bg-black">
      <SidebarMenu />
      <CanvasArea
        sensors={sensors}
        setSensors={setSensors}
        selectedSensorId={selectedSensorId}
        onCanvasClick={handleCanvasClick}
        viewport={viewport}
        setViewport={setViewport}
      />
    </div>
  );
}
