import { useMemo } from "react";
import type { Device, Sensor } from "../utils/other/Types";
import { v4 as uuidv4 } from "uuid";

export default function EditDevices({
  selectedDeviceCategory,
  setSelectedDeviceCategory,
  selectedDeviceLabel,
  setSelectedDeviceLabel,
  deviceTypes,
  editableNode,
  setEditableNode,
  setPendingUpdate,
  availableConnectivityOptions,
  handleChange,
}: {
  selectedDeviceCategory: string;
  setSelectedDeviceCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedDeviceLabel: string;
  setSelectedDeviceLabel: React.Dispatch<React.SetStateAction<string>>;
  deviceTypes: {
    type: string;
    label: string;
    connectivity: string[];
    compatibleSensors: string[];
  }[];
  editableNode: Device | Sensor;
  setEditableNode: React.Dispatch<React.SetStateAction<Device | Sensor | null>>;
  setPendingUpdate: React.Dispatch<
    React.SetStateAction<Device | Sensor | null>
  >;
  availableConnectivityOptions: string[];
  handleChange: (
    field: keyof Device,
    value: string | number | string[]
  ) => void;
}) {
  const availableDeviceLabels = useMemo(() => {
    return deviceTypes
      .filter((d) => d.type === selectedDeviceCategory)
      .map((d) => d.label);
  }, [deviceTypes, selectedDeviceCategory]);

  const handleDeviceCategoryChange = (category: string) => {
    setSelectedDeviceCategory(category);
    const firstLabel =
      deviceTypes.find((d) => d.type === category)?.label ?? "";
    setSelectedDeviceLabel(firstLabel);

    const match = deviceTypes.find(
      (d) => d.type === category && d.label === firstLabel
    );

    const newConn = match?.connectivity[0] ?? "";
    const newCompatibleSensors = match?.compatibleSensors ?? [];

    setEditableNode((prev) => {
      if (!prev || !("device_rad" in prev)) return prev;
      const updated = {
        ...prev,
        type: category,
        name: `${firstLabel} - ${uuidv4()}`,
        label: firstLabel,
        connectivity: [newConn],
        compatibleSensors: newCompatibleSensors,
      };
      setPendingUpdate(updated);
      return updated;
    });
  };

  const handleDeviceLabelChange = (label: string) => {
    setSelectedDeviceLabel(label);
    const match = deviceTypes.find(
      (d) => d.type === selectedDeviceCategory && d.label === label
    );

    const newConn = match?.connectivity[0] ?? "";
    const newCompatibleSensors = match?.compatibleSensors ?? [];

    setEditableNode((prev) => {
      if (!prev || !("device_rad" in prev)) return prev;
      const updated = {
        ...prev,
        label,
        name: `${selectedDeviceCategory} - ${uuidv4()}`,
        connectivity: [newConn],
        compatibleSensors: newCompatibleSensors,
      };
      setPendingUpdate(updated);
      return updated;
    });
  };

  return (
    <>
      {"device_rad" in editableNode && (
        <>
          <div className="flex flex-col gap-2 text-sm">
            Device Category:{" "}
            <select
              className="bg-slate-600 p-1 rounded w-full capitalize"
              value={selectedDeviceCategory}
              onChange={(e) => handleDeviceCategoryChange(e.target.value)}
            >
              {[...new Set(deviceTypes.map((d) => d.type))].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            Device Type:{" "}
            <select
              className="bg-slate-600 p-1 rounded w-full capitalize"
              value={selectedDeviceLabel}
              onChange={(e) => handleDeviceLabelChange(e.target.value)}
            >
              {availableDeviceLabels.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center text-sm">
            Device Radius:{" "}
            <input
              className="bg-slate-600 p-1 rounded w-full"
              type="number"
              value={editableNode.device_rad}
              onChange={(e) =>
                handleChange("device_rad", parseFloat(e.target.value))
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
              {availableConnectivityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </>
  );
}
