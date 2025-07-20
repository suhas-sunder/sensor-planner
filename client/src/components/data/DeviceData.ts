import type { Device } from "../utils/other/Types";

export default function DeviceData() {
  const sensors: Device[] = [
    {
      id: "motion-1",
      x: 1120,
      y: 100,
      object_type: "device",
      type: "appliance",
      name: "Fridge",
      device_rad: 20,
      state: { motion: false },
    },
  ];

  return sensors;
}
