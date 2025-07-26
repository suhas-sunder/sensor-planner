import type { Sensor, Device } from "../utils/other/Types";
import useSensorDeviceContext from "../hooks/useSensorDeviceContext";

// This component takes a node (Sensor or Device) as input and displays a summary of its connected items and interfering items.
export default function NodeConnectionSummary({
  node,
}: {
  node: Sensor | Device;
}) {
  // Get the list of all sensors and devices from the context hook for use in lookups.
  const { sensors, devices } = useSensorDeviceContext();

  // Determine if the provided node is a Sensor by checking for the 'sensor_rad' property.
  const isSensor = "sensor_rad" in node;

  // Build an array of connected items: if node is a Sensor, find Devices by ID; if Device, find Sensors by ID.
  // Use optional chaining and filter out any undefined results to ensure only valid items are included.
  const connectedItems =
    (isSensor
      ? node.connectedDeviceIds?.map((id) => devices.find((d) => d.id === id))
      : node.connectedSensorIds?.map((id) => sensors.find((s) => s.id === id))
    )?.filter((item): item is Sensor | Device => item !== undefined) ?? [];

  // Build an array of interfering items: if node is a Sensor, find Devices by interference ID; if Device, find Sensors.
  // Again, filter out any undefined results to avoid errors in rendering.
  const interferingItems =
    node.interferenceIds
      ?.map((id) =>
        isSensor
          ? devices.find((d) => d.id === id)
          : sensors.find((s) => s.id === id)
      )
      .filter((item): item is Sensor | Device => item !== undefined) ?? [];

  // Boolean flag to indicate if there are any connected items for this node.
  const hasConnections = connectedItems.length > 0;
  // Boolean flag to indicate if there are any interfering items for this node.
  const hasInterference = interferingItems.length > 0;

  if (!hasConnections && !hasInterference) return null;

  return (
    <div className="mt-2 flex flex-col gap-2 rounded-md bg-slate-800 p-3 text-sm text-white">
      {hasConnections && (
        <div>
          <div className="flex w-full mb-2 font-semibold text-blue-300">
            Connected {isSensor ? "Devices" : "Sensors"}:
          </div>
          <ul className="flex flex-col gap-2 ml-3 list-decimal text-left">
            {connectedItems.map((item) => (
              <li key={item.id} className="text-left whitespace-pre-line">
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasInterference && (
        <div>
          <div className="flex w-full  gap-2 mb-2 font-semibold text-red-300">
            Interfering {isSensor ? "Devices" : "Sensors"}:
          </div>
          <ul className="ml-3 list-decimal text-left">
            {interferingItems.map((item) => (
              <li key={item.id} className="text-left whitespace-pre-line">
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
