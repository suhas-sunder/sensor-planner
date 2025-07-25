import type { Sensor, Device } from "../utils/other/Types";
import useSensorDeviceContext from "../hooks/useSensorDeviceContext";

export default function NodeConnectionSummary({
  node,
}: {
  node: Sensor | Device;
}) {
  const { sensors, devices } = useSensorDeviceContext();

  if (!node) return null;

  const isSensor = "sensor_rad" in node;

  const connectedItems =
    (isSensor
      ? node.connectedDeviceIds?.map((id) => devices.find((d) => d.id === id))
      : node.connectedSensorIds?.map((id) => sensors.find((s) => s.id === id))
    )?.filter((item): item is Sensor | Device => item !== undefined) ?? [];

  const interferingItems =
    node.interferenceIds
      ?.map((id) =>
        isSensor
          ? devices.find((d) => d.id === id)
          : sensors.find((s) => s.id === id)
      )
      .filter((item): item is Sensor | Device => item !== undefined) ?? [];

  const hasConnections = connectedItems.length > 0;
  const hasInterference = interferingItems.length > 0;

  if (!hasConnections && !hasInterference) return null;

  return (
    <div className="mt-4 flex flex-col gap-2 rounded-md bg-slate-800 p-3 text-sm text-white">
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
