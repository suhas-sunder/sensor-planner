import type { Sensor, Device } from "../other/Types";

export default function DetectInterferenceNodes(
  sensors: Sensor[],
  devices: Device[]
): { updatedSensors: Sensor[]; updatedDevices: Device[] } {
  const defaultSensorRadius = 150;
  const defaultDeviceRadius = 30;

  const sensorMap: { [id: string]: Sensor } = {};
  const deviceMap: { [id: string]: Device } = {};

  for (const s of sensors) {
    sensorMap[s.id] = { ...s, interferenceIds: [] };
  }

  for (const d of devices) {
    deviceMap[d.id] = { ...d, interferenceIds: [] };
  }

  for (const s of sensors) {
    for (const d of devices) {
      if (s.floor !== d.floor) continue;

      const dx = s.x - d.x;
      const dy = s.y - d.y;
      const distance = Math.hypot(dx, dy);
      const sensorRadius = s.sensor_rad ?? defaultSensorRadius;
      const deviceRadius = d.device_rad ?? defaultDeviceRadius;
      const withinRange = distance <= sensorRadius + deviceRadius;

      const sharedInterference = s.connectivity.some((p) =>
        d.interferenceProtocols.includes(p)
      );

      const alreadyConnected =
        s.connectedDeviceIds?.includes(d.id) ||
        d.connectedSensorIds?.includes(s.id);

      if (withinRange && sharedInterference && !alreadyConnected) {
        sensorMap[s.id].interferenceIds!.push(d.id);
        deviceMap[d.id].interferenceIds!.push(s.id);
      }
    }
  }

  return {
    updatedSensors: Object.values(sensorMap),
    updatedDevices: Object.values(deviceMap),
  };
}
