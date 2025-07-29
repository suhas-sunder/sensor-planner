export default function SensorTypes() {
  const sensorTypes = [
    {
      type: "motion",
      label: "Motion Sensor",
      category: "trigger",
      connectivity: [
        "Wi-Fi 2.4GHz",
        "Wi-Fi 5GHz",
        "BLE 5.0",
        "Zigbee 3.0",
        "Z-Wave",
      ],
    },
    {
      type: "occupancy",
      label: "Occupancy Sensor",
      category: "trigger",
      connectivity: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz", "BLE 5.0", "Zigbee 3.0"],
    },
    {
      type: "presence",
      label: "Presence Detection Sensor",
      category: "trigger",
      connectivity: ["BLE 5.0", "UWB", "Zigbee 3.0"],
    },
    {
      type: "door",
      label: "Door Sensor",
      category: "trigger",
      connectivity: ["BLE 5.0", "Zigbee 3.0", "Z-Wave"],
    },
    {
      type: "window",
      label: "Window Sensor",
      category: "trigger",
      connectivity: ["BLE 5.0", "Zigbee 3.0", "Z-Wave"],
    },
    {
      type: "temperature",
      label: "Temperature Sensor",
      category: "sensor",
      connectivity: [
        "Wi-Fi 2.4GHz",
        "BLE 5.0",
        "Zigbee 3.0",
        "NB-IoT",
        "LoRaWAN",
      ],
    },
    {
      type: "humidity",
      label: "Humidity Sensor",
      category: "sensor",
      connectivity: ["Wi-Fi 2.4GHz", "BLE 5.0", "Zigbee 3.0"],
    },
    {
      type: "co2",
      label: "CO₂ Sensor",
      category: "sensor",
      connectivity: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz", "Zigbee 3.0"],
    },
    {
      type: "light",
      label: "Light Sensor",
      category: "sensor",
      connectivity: ["Wi-Fi 2.4GHz", "BLE 5.0", "Zigbee 3.0"],
    },
    {
      type: "sound",
      label: "Sound Level Sensor",
      category: "sensor",
      connectivity: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz", "BLE 5.0"],
    },
    {
      type: "vibration",
      label: "Vibration Sensor",
      category: "sensor",
      connectivity: ["BLE 5.0", "Zigbee 3.0"],
    },
    {
      type: "pressure",
      label: "Pressure Sensor",
      category: "sensor",
      connectivity: ["BLE 5.0", "Wi-Fi 2.4GHz", "LoRaWAN"],
    },
    {
      type: "gas",
      label: "Gas Leak Sensor",
      category: "sensor",
      connectivity: ["Wi-Fi 2.4GHz", "Zigbee 3.0"],
    },
    {
      type: "smoke",
      label: "Smoke Detector Sensor",
      category: "sensor",
      connectivity: ["Wi-Fi 2.4GHz", "Zigbee 3.0", "Z-Wave"],
    },
    {
      type: "fall_detection",
      label: "Fall Detection Sensor",
      category: "sensor",
      connectivity: ["Wi-Fi 2.4GHz", "BLE 5.0", "LTE", "NB-IoT"],
    },
    {
      type: "wifi",
      label: "Wi-Fi Coverage Node",
      category: "infrastructure",
      connectivity: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz", "Wi-Fi 6"],
    },
    {
      type: "bluetooth",
      label: "Bluetooth Beacon Node",
      category: "infrastructure",
      connectivity: ["BLE 4.2", "BLE 5.0", "BLE 5.1"],
    },
    {
      type: "infrared",
      label: "Infrared Sensor",
      category: "infrastructure",
      connectivity: ["BLE 5.0", "Zigbee 3.0"],
    },
  ];

  return sensorTypes;
}
