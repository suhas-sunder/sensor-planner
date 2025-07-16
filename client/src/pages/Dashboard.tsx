import { useState } from "react";
import type { Device } from "../components/utils/Types";
import CanvasArea from "../components/ui/CanvasArea";

export default function Dashboard() {
  const [devices, _setDevices] = useState<Device[]>([
    {
      id: "test",
      x: 100,
      y: 100,
      type: "motion_sensor",
      state: { motion: false },
    },
  ]);

  const [viewport, setViewport] = useState({ x: 0, y: 0 });

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const handleCanvasClick = (x: number, y: number): void => {
    const clicked = devices.find((d) => Math.hypot(d.x - x, d.y - y) < 15);
    if (clicked) {
      setSelectedDeviceId(clicked.id);
    } else {
      setSelectedDeviceId(null);
    }
  };

  return (
    <div className="flex w-full h-screen bg-black">
      <div className="flex flex-col w-60 items-center bg-slate-600 gap-5 text-white">
        <h1 className="flex font-bold text-2xl mt-4 mb-2">Floor 1 Menu</h1>
        <div className="flex flex-col gap-3 border-2 border-white rounded-md p-2 px-4">
          <div>Motion Sensor 1</div>
          <div className="w-40 h-40 bg-slate-400 rounded-md">
            SENSOR PREVIEW IMG
          </div>
          <div>Status: Active </div>
          <div>Setting 1</div>
          <div>Setting 2</div>
          <div>Setting 3</div>
          <div>Setting 4</div>
        </div>
        <div className="flex flex-col gap-8 mt-auto -translate-y-25">
          <button className="border-2 border-white rounded-md p-2">
            Add Sensor
          </button>
          <button className="border-2 border-white rounded-md p-2">
            Add Device
          </button>
        </div>
      </div>
      <CanvasArea
        devices={devices}
        selectedDeviceId={selectedDeviceId}
        onCanvasClick={handleCanvasClick}
        viewport={viewport}
        setViewport={setViewport}
      />
    </div>
  );
}
