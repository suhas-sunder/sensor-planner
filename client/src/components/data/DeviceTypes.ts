export default function DeviceTypes() {
  const deviceTypes = [
    {
      type: "appliance",
      label: "Smart Thermostat",
      connectivity: [
        "Wi-Fi 2.4GHz",
        "Wi-Fi 5GHz",
        "Zigbee 3.0",
        "Z-Wave",
        "Thread",
      ],
      compatibleSensors: ["temperature", "humidity", "occupancy", "motion"],
      interferenceProtocols: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz"], // Zigbee+Thread excluded
    },
    {
      type: "appliance",
      label: "Smart Light Bulb",
      connectivity: ["Wi-Fi 2.4GHz", "Zigbee 3.0", "BLE 5.0"],
      compatibleSensors: ["light", "motion", "occupancy"],
      interferenceProtocols: ["Wi-Fi 2.4GHz", "BLE 5.0"],
    },
    {
      type: "appliance",
      label: "Smart Plug",
      connectivity: ["Wi-Fi 2.4GHz", "Z-Wave", "Zigbee 3.0"],
      compatibleSensors: ["power", "occupancy", "motion"],
      interferenceProtocols: ["Wi-Fi 2.4GHz"],
    },
    {
      type: "security",
      label: "Smart Door Lock",
      connectivity: ["Zigbee 3.0", "Z-Wave", "BLE 5.0", "Wi-Fi 2.4GHz"],
      compatibleSensors: ["door", "proximity", "occupancy", "motion"],
      interferenceProtocols: ["Wi-Fi 2.4GHz", "BLE 5.0"], // Z-Wave ignored
    },
    {
      type: "monitoring",
      label: "Smart Camera",
      connectivity: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz", "LTE", "5G"],
      compatibleSensors: ["motion", "occupancy", "presence", "camera"],
      interferenceProtocols: ["Wi-Fi 2.4GHz", "Wi-Fi 5GHz", "LTE", "5G"],
    },
    {
      type: "appliance",
      label: "Microwave Oven",
      connectivity: [],
      compatibleSensors: [],
      interferenceProtocols: ["Wi-Fi 2.4GHz"],
    },
    {
      type: "monitoring",
      label: "Baby Monitor",
      connectivity: ["Analog 900MHz", "Wi-Fi 2.4GHz"],
      compatibleSensors: ["sound", "motion", "camera"],
      interferenceProtocols: ["Analog 900MHz", "Wi-Fi 2.4GHz"],
    },
    {
      type: "monitoring",
      label: "Wireless Security System",
      connectivity: ["Z-Wave", "Wi-Fi 2.4GHz", "BLE 5.0"],
      compatibleSensors: ["door", "window", "motion", "camera"],
      interferenceProtocols: ["Wi-Fi 2.4GHz", "BLE 5.0"],
    },
    {
      type: "communication",
      label: "Cordless Phone",
      connectivity: ["DECT 6.0"],
      compatibleSensors: [],
      interferenceProtocols: [], // DECT is isolated
    },
    {
      type: "monitoring",
      label: "Wireless Baby Camera",
      connectivity: ["Wi-Fi 2.4GHz"],
      compatibleSensors: ["camera", "sound", "motion"],
      interferenceProtocols: ["Wi-Fi 2.4GHz"],
    },
  ];

  return deviceTypes;
}
