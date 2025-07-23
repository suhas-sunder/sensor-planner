export const SensorData = [
  {
    id: "sensor-001",
    type: "motion",
    name: "Motion Sensor 1",
    x: 100,
    y: 200,
    sensor_rad: 30,
    connectivity: ["Wi-Fi 2.4GHz"],
  },
];

export const DeviceData = [
  {
    id: "device-001",
    type: "appliance",
    label: "Smart Light",
    name: "Smart Fridge",
    connectivity: ["Wi-Fi 2.4GHz"],
    x: 300,
    y: 300,
    compatibleSensors: ["motion", "temperature"],
    interferenceProtocols: ["Zigbee", "Bluetooth"],
    device_rad: 50,
  },
];
