import type { Sensor, Device } from "../other/Types";
import type { SimulationEvent } from "../other/Types";

type AddEventFn = (event: Omit<SimulationEvent, "id" | "timestamp">) => void;

export default function DetectInterferenceNodes(
  sensors: Sensor[],
  devices: Device[],
  addEvent: AddEventFn
): { updatedSensors: Sensor[]; updatedDevices: Device[] } {
  const defaultSensorRadius = 150;
  const defaultDeviceRadius = 30;

  const sensorMap: { [id: string]: Sensor } = {};
  const deviceMap: { [id: string]: Device } = {};

  for (const s of sensors) {
    sensorMap[s.id] = {
      ...s,
      interferenceIds: [],
    };
  }

  for (const d of devices) {
    deviceMap[d.id] = {
      ...d,
      interferenceIds: [],
    };
  }

  for (const s of sensors) {
    const currentInterference: string[] = [];

    for (const d of devices) {
      if (s.floor !== d.floor) continue;

      const dx = s.x - d.x;
      const dy = s.y - d.y;
      const distance = Math.hypot(dx, dy);
      const sensorRadius = s.sensor_rad ?? defaultSensorRadius;
      const deviceRadius = d.device_rad ?? defaultDeviceRadius;
      const withinRange = distance <= sensorRadius + deviceRadius;

      const deviceConnectivity = (d.connectivity ?? []).filter(
        (c) => c && c.trim() !== ""
      );

      const sharedInterference = s.connectivity.some(
        (sensorProtocol) =>
          d.interferenceProtocols.includes(sensorProtocol) &&
          (deviceConnectivity.length === 0 ||
            deviceConnectivity.includes(sensorProtocol))
      );

      const alreadyConnected =
        s.connectedDeviceIds?.includes(d.id) ||
        d.connectedSensorIds?.includes(s.id);

      if (withinRange && sharedInterference && !alreadyConnected) {
        sensorMap[s.id].interferenceIds!.push(d.id);
        deviceMap[d.id].interferenceIds!.push(s.id);
        currentInterference.push(d.id);
      }
    }

    // LOGGING
    if (addEvent && s.interferenceIds) {
      const prev = s.interferenceIds;
      const added = currentInterference.filter((id) => !prev.includes(id));
      const removed = prev.filter((id) => !currentInterference.includes(id));

      for (const deviceId of added) {
        addEvent({
          nodeId: s.id,
          nodeType: "sensor",
          floor: s.floor,
          eventType: "interference",
          message: `Sensor "${s.name}" detected interference from Device ID "${deviceId}"`,
        });
      }

      for (const deviceId of removed) {
        addEvent({
          nodeId: s.id,
          nodeType: "sensor",
          floor: s.floor,
          eventType: "interference",
          message: `Sensor "${s.name}" no longer detects interference from Device ID "${deviceId}"`,
        });
      }
    }
  }

  return {
    updatedSensors: Object.values(sensorMap),
    updatedDevices: Object.values(deviceMap),
  };
}
