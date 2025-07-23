import type { Device, Sensor } from "../other/Types";

// Function to detect if two nodes are touching
export default function DetectTouchingNodes(
  sensors: Sensor[],
  devices: Device[]
): { updatedSensors: Sensor[]; updatedDevices: Device[] } {
  const defaultRadius = 30; // Default radius if not specified

  // Initialize empty arrays for connected IDs
  const updatedSensors = sensors.map((sensor) => ({
    ...sensor,
    connectedDeviceIds: [] as string[],
  }));

  // Initialize empty arrays for connected IDs in devices
  const updatedDevices = devices.map((device) => ({
    ...device,
    connectedSensorIds: [] as string[],
  }));

  // Check each sensor against each device
  for (const sensor of updatedSensors) {
    for (const device of updatedDevices) {
      if (!sensor.id || !device.id)
        console.log("Error: Missing Device or Sensor ID"); // Ensure both IDs are defined
      const distance = Math.hypot(sensor.x - device.x, sensor.y - device.y); // Calculate distance between sensor and device
      // Check if the distance is less than or equal to the sum of their radii
      const contact =
        distance <= (sensor.sensor_rad || defaultRadius) + (device.device_rad || defaultRadius);

      // If the nodes are touching, add each other's IDs to their connected lists
      if (contact) {
        sensor.connectedDeviceIds!.push(device.id);
        device.connectedSensorIds!.push(sensor.id);
      }
    }
  }

  return { updatedSensors, updatedDevices };
}
