import type { Device, Sensor } from "../other/Types";
import type { SimulationEvent } from "../other/Types";

type AddEventFn = (event: Omit<SimulationEvent, "id" | "timestamp">) => void;

export default function DetectConnectedNodes(
  sensors: Sensor[],
  devices: Device[],
  addEvent?: AddEventFn
): { updatedSensors: Sensor[]; updatedDevices: Device[] } {
  const defaultSensorRadius = 150;
  const defaultDeviceRadius = 30;

  const updatedSensors: Sensor[] = sensors.map((sensor) => {
    const connectedDeviceIds: string[] = [];

    for (const device of devices) {
      if (sensor.floor !== device.floor) continue;

      const dx = sensor.x - device.x;
      const dy = sensor.y - device.y;
      const distance = Math.hypot(dx, dy);
      const inRange =
        distance <=
        (sensor.sensor_rad ?? defaultSensorRadius) +
          (device.device_rad ?? defaultDeviceRadius);

      const sharedProtocol = sensor.connectivity.some((p) =>
        device.connectivity.includes(p)
      );
      const typeMatch = device.compatibleSensors.includes(sensor.type);

      if (inRange && sharedProtocol && typeMatch) {
        connectedDeviceIds.push(device.id);
      }
    }

    // LOGGING DIFFERENCES (added or removed connections)
    if (addEvent && sensor.connectedDeviceIds) {
      const prev = sensor.connectedDeviceIds;
      const added = connectedDeviceIds.filter((id) => !prev.includes(id));
      const removed = prev.filter((id) => !connectedDeviceIds.includes(id));

      for (const deviceId of added) {
        addEvent({
          nodeId: sensor.id,
          nodeType: "sensor",
          floor: sensor.floor,
          eventType: "connectivity",
          message: `Sensor "${sensor.name}" connected to Device ID "${deviceId}"`,
        });
      }

      for (const deviceId of removed) {
        addEvent({
          nodeId: sensor.id,
          nodeType: "sensor",
          floor: sensor.floor,
          eventType: "connectivity",
          message: `Sensor "${sensor.name}" disconnected from Device ID "${deviceId}"`,
        });
      }
    }

    return { ...sensor, connectedDeviceIds };
  });

  const updatedDevices: Device[] = devices.map((device) => {
    const connectedSensorIds: string[] = [];

    for (const sensor of sensors) {
      if (sensor.floor !== device.floor) continue;

      const dx = sensor.x - device.x;
      const dy = sensor.y - device.y;
      const distance = Math.hypot(dx, dy);
      const inRange =
        distance <=
        (sensor.sensor_rad ?? defaultSensorRadius) +
          (device.device_rad ?? defaultDeviceRadius);

      const sharedProtocol = sensor.connectivity.some((p) =>
        device.connectivity.includes(p)
      );
      const typeMatch = device.compatibleSensors.includes(sensor.type);

      if (inRange && sharedProtocol && typeMatch) {
        connectedSensorIds.push(sensor.id);
      }
    }

    return { ...device, connectedSensorIds };
  });

  return { updatedSensors, updatedDevices };
}
