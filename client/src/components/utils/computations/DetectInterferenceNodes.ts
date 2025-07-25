import type { Device, Sensor } from "../other/Types";

/**
 * Detects interference between sensors and devices.
 * - Interference requires:
 *   (1) shared connectivity,
 *   (2) the protocol is listed as interference-prone,
 *   (3) the sensor is NOT in the device's compatibleSensors list.
 */
export default function DetectInterferenceNodes(
  sensors: Sensor[],
  devices: Device[]
) {
  const updatedSensors = sensors.map((sensor) => {
    const interferingDevices = devices.filter((device) => {
      const sharedConnectivities = sensor.connectivity.filter((conn) =>
        device.connectivity.includes(conn)
      );

      if (sharedConnectivities.length === 0) return false;

      const causesInterference =
        sharedConnectivities.some((conn) =>
          device.interferenceProtocols.includes(conn)
        ) && !device.compatibleSensors.includes(sensor.type);

      return causesInterference;
    });

    return {
      ...sensor,
      interferenceIds: interferingDevices.map((d) => d.id),
    };
  });

  const updatedDevices = devices.map((device) => {
    const interferingSensors = sensors.filter((sensor) => {
      const sharedConnectivities = sensor.connectivity.filter((conn) =>
        device.connectivity.includes(conn)
      );

      if (sharedConnectivities.length === 0) return false;

      const causesInterference =
        sharedConnectivities.some((conn) =>
          device.interferenceProtocols.includes(conn)
        ) && !device.compatibleSensors.includes(sensor.type);

      return causesInterference;
    });

    return {
      ...device,
      interferenceIds: interferingSensors.map((s) => s.id),
    };
  });

  return {
    updatedSensors,
    updatedDevices,
  };
}
