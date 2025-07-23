export default function SensorTypes() {
  const sensorTypes = [
    {
      type: "motion",
      label: "Motion Sensor",
      connectivity: [
        "Wi-Fi 2.4GHz",
        "Wi-Fi 5GHz",
        "BLE 5.0",
        "Zigbee 3.0",
        "Z-Wave",
      ],
    },
    {
      type: "temperature",
      label: "Temperature Sensor",
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
      connectivity: ["Wi-Fi 2.4GHz", "BLE 5.0", "Zigbee 3.0"],
    },
    {
      type: "pressure",
      label: "Pressure Sensor",
      connectivity: ["BLE 5.0", "Wi-Fi 2.4GHz", "LoRaWAN"],
    },
    {
      type: "co2",
      label: "CO₂ Sensor",
      connectivity: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz", "Zigbee 3.0"],
    },
    {
      type: "voc",
      label: "VOC Sensor",
      connectivity: ["Wi-Fi 2.4GHz", "BLE 5.0", "Zigbee 3.0"],
    },
    {
      type: "particulate_matter",
      label: "Particulate Matter (PM2.5) Sensor",
      connectivity: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz", "Zigbee 3.0", "NB-IoT"],
    },
    {
      type: "air_quality",
      label: "Air Quality Sensor",
      connectivity: [
        "Wi-Fi 2.4GHz",
        "Wi-Fi 5GHz",
        "BLE 5.0",
        "Zigbee 3.0",
        "LoRaWAN",
      ],
    },
    {
      type: "light",
      label: "Light Sensor",
      connectivity: ["BLE 5.0", "Zigbee 3.0"],
    },
    {
      type: "sound",
      label: "Sound Level Sensor",
      connectivity: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz", "BLE 5.0"],
    },
    {
      type: "noise",
      label: "Noise Detection Sensor",
      connectivity: ["Wi-Fi 2.4GHz", "BLE 5.0", "Zigbee 3.0"],
    },
    {
      type: "gas",
      label: "Gas Leak Sensor",
      connectivity: ["Wi-Fi 2.4GHz", "Zigbee 3.0"],
    },
    {
      type: "smoke",
      label: "Smoke Detector Sensor",
      connectivity: ["Wi-Fi 2.4GHz", "Zigbee 3.0", "Z-Wave"],
    },
    {
      type: "leak",
      label: "Water Leak Sensor",
      connectivity: ["Zigbee 3.0", "Z-Wave", "BLE 5.0"],
    },
    {
      type: "occupancy",
      label: "Occupancy Sensor",
      connectivity: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz", "BLE 5.0", "Zigbee 3.0"],
    },
    {
      type: "presence",
      label: "Presence Detection Sensor",
      connectivity: ["BLE 5.0", "UWB", "Zigbee 3.0"],
    },
    {
      type: "vibration",
      label: "Vibration Sensor",
      connectivity: ["BLE 5.0", "Zigbee 3.0"],
    },
    {
      type: "floor_pressure",
      label: "Floor Pressure Sensor",
      connectivity: ["BLE 5.0", "Wi-Fi 2.4GHz", "LoRaWAN"],
    },
    {
      type: "fall_detection",
      label: "Fall Detection Sensor",
      connectivity: ["Wi-Fi 2.4GHz", "BLE 5.0", "LTE", "NB-IoT"],
    },
    {
      type: "thermal",
      label: "Thermal Sensor",
      connectivity: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz", "BLE 5.0"],
    },
    {
      type: "infrared",
      label: "Infrared Sensor",
      connectivity: ["BLE 5.0", "Zigbee 3.0"],
    },
    {
      type: "bluetooth",
      label: "Bluetooth Beacon Sensor",
      connectivity: ["BLE 4.2", "BLE 5.0", "BLE 5.1"],
    },
    {
      type: "wifi",
      label: "WiFi Coverage Node Sensor",
      connectivity: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz", "Wi-Fi 6"],
    },
    {
      type: "fridge",
      label: "Fridge Monitor Sensor",
      connectivity: ["Wi-Fi 2.4GHz", "BLE 5.0", "Zigbee 3.0"],
    },
    {
      type: "tv",
      label: "TV Monitor Sensor",
      connectivity: ["Wi-Fi 5GHz", "BLE 5.0"],
    },
    {
      type: "door",
      label: "Door Sensor",
      connectivity: ["BLE 5.0", "Zigbee 3.0", "Z-Wave"],
    },
    {
      type: "window",
      label: "Window Sensor",
      connectivity: ["BLE 5.0", "Zigbee 3.0", "Z-Wave"],
    },
    {
      type: "camera",
      label: "Camera Module Sensor",
      connectivity: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz", "Wi-Fi 6", "LTE", "5G"],
    },
    {
      type: "ambient",
      label: "Ambient Sensor",
      connectivity: ["BLE 5.0", "Wi-Fi 2.4GHz"],
    },
    {
      type: "proximity",
      label: "Proximity Sensor",
      connectivity: ["BLE 5.0", "Zigbee 3.0"],
    },
    {
      type: "ultra_violet",
      label: "UV Sensor",
      connectivity: ["BLE 5.0", "Zigbee 3.0", "Wi-Fi 2.4GHz"],
    },
  ];

  return sensorTypes;
}
