import type { Device, Sensor } from "../other/Types";

export default function DetectConnectedNodes(
  sensors: Sensor[],
  devices: Device[]
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
