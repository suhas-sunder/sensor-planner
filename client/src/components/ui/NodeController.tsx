import { useEffect, useMemo, useState } from "react";
import useSensorDeviceContext from "../hooks/useSensorDeviceContext";
import SensorTypes from "../data/SensorTypes";
import DeviceTypes from "../data/DeviceTypes";
import type { Sensor, Device } from "../utils/other/Types";

export default function NodeController() {
  const { sensors, devices, setSensors, setDevices, selectedNodeId } =
    useSensorDeviceContext();

  const sensorTypes = useMemo(() => SensorTypes(), []);
  const deviceTypes = useMemo(() => DeviceTypes(), []);

  const selectedSensor = sensors.find((sensor) => sensor.id === selectedNodeId);
  const selectedDevice = devices.find((device) => device.id === selectedNodeId);
  const node = selectedSensor || selectedDevice;

  const [editableNode, setEditableNode] = useState<Sensor | Device | null>(
    null
  );

  const [selectedSensorType, setSelectedSensorType] = useState("");
  const [selectedDeviceCategory, setSelectedDeviceCategory] = useState("");
  const [selectedDeviceLabel, setSelectedDeviceLabel] = useState("");

  // Populate editable node + kind selectors
  useEffect(() => {
    if (!node) {
      setEditableNode(null);
      return;
    }

    setEditableNode({ ...node });

    if ("sensor_rad" in node) {
      setSelectedSensorType(node.type);
    } else {
      setSelectedDeviceCategory(node.type);
      setSelectedDeviceLabel(node.label);
    }
  }, [node]);

  const availableConnectivityOptions = useMemo(() => {
    if (!editableNode) return [];

    if ("sensor_rad" in editableNode) {
      return (
        sensorTypes.find((sensor) => sensor.type === selectedSensorType)
          ?.connectivity ?? []
      );
    } else {
      return (
        deviceTypes.find(
          (device) =>
            device.type === selectedDeviceCategory &&
            device.label === selectedDeviceLabel
        )?.connectivity ?? []
      );
    }
  }, [
    editableNode,
    sensorTypes,
    deviceTypes,
    selectedSensorType,
    selectedDeviceCategory,
    selectedDeviceLabel,
  ]);

  const availableDeviceLabels = useMemo(() => {
    return deviceTypes
      .filter((device) => device.type === selectedDeviceCategory)
      .map((device) => device.label);
  }, [deviceTypes, selectedDeviceCategory]);

  const handleChange = <K extends keyof (Sensor & Device)>(
    key: K,
    value: (Sensor & Device)[K]
  ) => {
    setEditableNode((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSensorTypeChange = (newType: string) => {
    setSelectedSensorType(newType);
    const newConnectivity =
      sensorTypes.find((sensor) => sensor.type === newType)?.connectivity[0] ||
      "";

    setEditableNode((prev) =>
      prev && "sensor_rad" in prev
        ? {
            ...prev,
            type: newType,
            connectivity: [newConnectivity],
          }
        : prev
    );
  };

  const handleDeviceCategoryChange = (category: string) => {
    setSelectedDeviceCategory(category);

    const firstLabel =
      deviceTypes.find((device) => device.type === category)?.label || "";

    setSelectedDeviceLabel(firstLabel);

    const newConnectivity =
      deviceTypes.find(
        (device) => device.type === category && device.label === firstLabel
      )?.connectivity[0] || "";

    setEditableNode((prev) =>
      prev && "device_rad" in prev
        ? {
            ...prev,
            type: category,
            label: firstLabel,
            connectivity: [newConnectivity],
          }
        : prev
    );
  };

  const handleDeviceLabelChange = (label: string) => {
    setSelectedDeviceLabel(label);

    const newConnectivity =
      deviceTypes.find(
        (device) =>
          device.type === selectedDeviceCategory && device.label === label
      )?.connectivity[0] || "";

    setEditableNode((prev) =>
      prev && "device_rad" in prev
        ? {
            ...prev,
            label,
            connectivity: [newConnectivity],
          }
        : prev
    );
  };

  const handleSave = () => {
    if (!editableNode) return;

    if ("sensor_rad" in editableNode) {
      setSensors((prev) =>
        prev.map((sensor) =>
          sensor.id === editableNode.id ? (editableNode as Sensor) : sensor
        )
      );
    } else {
      setDevices((prev) =>
        prev.map((device) =>
          device.id === editableNode.id ? (editableNode as Device) : device
        )
      );
    }
  };

  if (!node || !editableNode) {
    return (
      <div className="flex flex-col bg-slate-700 gap-3 rounded-md p-4 text-white">
        <div>No node selected</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-700 max-w-53 gap-3 rounded-md p-4 text-white">
      <input
        className="font-semibold text-lg bg-slate-600 p-1 rounded"
        value={editableNode.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <div className="flex justify-center items-center min-w-40 min-h-40 bg-slate-600 rounded-md">
        PREVIEW IMG
      </div>

      <div>Status: Active</div>

      <div className="text-sm flex gap-3 justify-center items-center">
        X:{" "}
        <input
          className="bg-slate-600 p-1 rounded w-16"
          type="number"
          value={editableNode.x}
          onChange={(e) => handleChange("x", parseFloat(e.target.value))}
        />
        Y:{" "}
        <input
          className="bg-slate-600 p-1 rounded w-16"
          type="number"
          value={editableNode.y}
          onChange={(e) => handleChange("y", parseFloat(e.target.value))}
        />
      </div>

      {"sensor_rad" in editableNode && (
        <>
          <div className="text-sm">
            Sensor Type:{" "}
            <select
              className="bg-slate-600 p-1 rounded w-full"
              value={selectedSensorType}
              onChange={(e) => handleSensorTypeChange(e.target.value)}
            >
              {sensorTypes.map((sensor) => (
                <option key={sensor.type} value={sensor.type}>
                  {sensor.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm">
            Sensor Radius:{" "}
            <input
              className="bg-slate-600 p-1 rounded w-20"
              type="number"
              value={editableNode.sensor_rad}
              onChange={(e) =>
                handleChange("sensor_rad", parseFloat(e.target.value))
              }
            />
          </div>

          <div className="text-sm">
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

      {"device_rad" in editableNode && (
        <>
          <div className="text-sm">
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

          <div className="text-sm">
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

          <div className="text-sm">
            Device Radius:{" "}
            <input
              className="bg-slate-600 p-1 rounded w-20"
              type="number"
              value={editableNode.device_rad}
              onChange={(e) =>
                handleChange("device_rad", parseFloat(e.target.value))
              }
            />
          </div>

          <div className="text-sm">
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

      <button
        onClick={handleSave}
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
