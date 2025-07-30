import { useMemo } from "react";
import type { Device, Sensor } from "../utils/other/Types";
import { v4 as uuidv4 } from "uuid";

export default function EditSensors({
  editableNode,
  setEditableNode,
  sensorTypes,
  selectedSensorCategory,
  setSelectedSensorCategory,
  selectedSensorType,
  setSelectedSensorType,
  setPendingUpdate,
  handleChange,
  availableConnectivityOptions,
}: {
  editableNode: Sensor | Device;
  setEditableNode: React.Dispatch<React.SetStateAction<Sensor | Device | null>>;
  sensorTypes: {
    type: string;
    category: string;
    label: string;
    connectivity: string[];
  }[];
  selectedSensorCategory: string;
  setSelectedSensorCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedSensorType: string;
  setSelectedSensorType: React.Dispatch<React.SetStateAction<string>>;
  setPendingUpdate: React.Dispatch<
    React.SetStateAction<Sensor | Device | null>
  >;
  handleChange: (
    field: keyof Sensor | keyof Device,
    value: string | number | string[]
  ) => void;
  availableConnectivityOptions: string[];
}) {
  const availableSensorTypes = useMemo(() => {
    return sensorTypes.filter((s) => s.category === selectedSensorCategory);
  }, [sensorTypes, selectedSensorCategory]);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleSensorCategoryChange = (category: string) => {
    const firstMatch = sensorTypes.find((s) => s.category === category);
    if (!firstMatch) return;

    setSelectedSensorCategory(category);
    setSelectedSensorType(firstMatch.type);

    setEditableNode((prev) => {
      if (!prev || !("sensor_rad" in prev)) return prev;
      const updated = {
        ...prev,
        type: firstMatch.type,
        name: `${capitalize(firstMatch.type)} Sensor - ${uuidv4()}`,
        connectivity: [firstMatch.connectivity[0] ?? ""],
      };
      setPendingUpdate(updated);
      return updated;
    });
  };

  const handleSensorTypeChange = (type: string) => {
    setSelectedSensorType(type);

    const selected = sensorTypes.find((s) => s.type === type);
    if (!selected) return;

    setEditableNode((prev) => {
      if (!prev || !("sensor_rad" in prev)) return prev;
      const updated = {
        ...prev,
        type,
        name: `${capitalize(type)} Sensor - ${uuidv4()}`,
        connectivity: [selected.connectivity[0] ?? ""],
      };
      setPendingUpdate(updated);
      return updated;
    });
  };

  return (
    <>
      {"sensor_rad" in editableNode && (
        <>
          <div className="flex flex-col gap-2 text-sm">
            Sensor Category:{" "}
            <select
              className="bg-slate-600 p-1 rounded w-full"
              value={selectedSensorCategory}
              onChange={(e) => handleSensorCategoryChange(e.target.value)}
            >
              {[...new Set(sensorTypes.map((s) => s.category))].map(
                (category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            Sensor Type:{" "}
            <select
              className="bg-slate-600 p-1 rounded w-full"
              value={selectedSensorType}
              onChange={(e) => handleSensorTypeChange(e.target.value)}
            >
              {availableSensorTypes.map((s) => (
                <option key={s.type} value={s.type}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center text-sm">
            Sensor Radius:{" "}
            <input
              className="bg-slate-600 p-1 rounded w-full"
              type="number"
              value={editableNode.sensor_rad}
              onChange={(e) =>
                handleChange("sensor_rad", parseFloat(e.target.value))
              }
            />
          </div>

          <div className="flex flex-col gap-2 text-sm">
            Connectivity:{" "}
            <select
              className="bg-slate-600 p-1 rounded w-full"
              value={editableNode.connectivity[0] || ""}
              onChange={(e) => handleChange("connectivity", [e.target.value])}
            >
              {availableConnectivityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </>
  );
}
