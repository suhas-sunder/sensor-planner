import type { Device, Sensor } from "../other/Types";

/**
 * Detects physical and wireless connectivity between sensors and devices.
 * A connection exists if the two are within combined coverage radius AND share at least one connectivity type.
 * Returns updated sensors and devices with `connectedDeviceIds` and `connectedSensorIds`.
 */
export default function DetectConnectedNodes(
  sensors: Sensor[],
  devices: Device[]
): { updatedSensors: Sensor[]; updatedDevices: Device[] } {
  const defaultRadius = 30;

  const updatedSensors: Sensor[] = sensors.map((sensor) => {
    const connectedDeviceIds: string[] = [];

    devices.forEach((device) => {
      const dx = sensor.x - device.x;
      const dy = sensor.y - device.y;
      const distance = Math.hypot(dx, dy);

      const sensorRadius = sensor.sensor_rad ?? defaultRadius;
      const deviceRadius = device.device_rad ?? defaultRadius;

      const withinRange = distance <= sensorRadius + deviceRadius;
      const sharesConnectivity = sensor.connectivity.some((conn) =>
        device.connectivity.includes(conn)
      );

      if (withinRange && sharesConnectivity) {
        connectedDeviceIds.push(device.id);
      }
    });

    return {
      ...sensor,
      connectedDeviceIds,
    };
  });

  const updatedDevices: Device[] = devices.map((device) => {
    const connectedSensorIds: string[] = [];

    sensors.forEach((sensor) => {
      const dx = sensor.x - device.x;
      const dy = sensor.y - device.y;
      const distance = Math.hypot(dx, dy);

      const sensorRadius = sensor.sensor_rad ?? defaultRadius;
      const deviceRadius = device.device_rad ?? defaultRadius;

      const withinRange = distance <= sensorRadius + deviceRadius;
      const sharesConnectivity = sensor.connectivity.some((conn) =>
        device.connectivity.includes(conn)
      );

      if (withinRange && sharesConnectivity) {
        connectedSensorIds.push(sensor.id);
      }
    });

    return {
      ...device,
      connectedSensorIds,
    };
  });

  return {
    updatedSensors,
    updatedDevices,
  };
}
