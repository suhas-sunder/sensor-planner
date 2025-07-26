import { useEffect, useMemo, useState } from "react";
import useSensorDeviceContext from "../hooks/useSensorDeviceContext";
import SensorTypes from "../data/SensorTypes";
import DeviceTypes from "../data/DeviceTypes";
import type { Sensor, Device } from "../utils/other/Types";
import DetectConnectedNodes from "../utils/computations/DetectConnectedNodes";
import DetectInterferenceNodes from "../utils/computations/DetectInterferenceNodes";
import NodeConnectionSummary from "../layout/NodeConnectionSummary";

export default function EditNodeMenu() {
  const { sensors, devices, setSensors, setDevices, selectedNodeId } =
    useSensorDeviceContext();

  const sensorTypes = useMemo(() => SensorTypes(), []);
  const deviceTypes = useMemo(() => DeviceTypes(), []);

  const selectedSensor = sensors.find((s) => s.id === selectedNodeId);
  const selectedDevice = devices.find((d) => d.id === selectedNodeId);
  const node = selectedSensor || selectedDevice;

  const [editableNode, setEditableNode] = useState<Sensor | Device | null>(
    null
  );
  const [selectedSensorCategory, setSelectedSensorCategory] = useState("");
  const [selectedSensorType, setSelectedSensorType] = useState("");
  const [selectedDeviceCategory, setSelectedDeviceCategory] = useState("");
  const [selectedDeviceLabel, setSelectedDeviceLabel] = useState("");
  const [pendingUpdate, setPendingUpdate] = useState<Sensor | Device | null>(
    null
  );

  useEffect(() => {
    if (!node) {
      setEditableNode(null);
      return;
    }

    setEditableNode({ ...node });

    if ("sensor_rad" in node) {
      setSelectedSensorCategory(
        sensorTypes.find((s) => s.type === node.type)?.category || ""
      );
      setSelectedSensorType(node.type);
    } else {
      setSelectedDeviceCategory(node.type);
      setSelectedDeviceLabel(node.label);
    }
  }, [node, sensorTypes]);

  useEffect(() => {
    if (!pendingUpdate) return;

    if ("sensor_rad" in pendingUpdate) {
      const updatedSensors = sensors.map((s) =>
        s.id === pendingUpdate.id ? pendingUpdate : s
      );
      const { updatedSensors: s1, updatedDevices: d1 } = DetectConnectedNodes(
        updatedSensors,
        devices
      );
      const { updatedSensors: s2, updatedDevices: d2 } =
        DetectInterferenceNodes(s1, d1);
      setSensors(s2);
      setDevices(d2);
    } else {
      const updatedDevices = devices.map((d) =>
        d.id === pendingUpdate.id ? pendingUpdate : d
      );
      const { updatedSensors: s1, updatedDevices: d1 } = DetectConnectedNodes(
        sensors,
        updatedDevices
      );
      const { updatedSensors: s2, updatedDevices: d2 } =
        DetectInterferenceNodes(s1, d1);
      setSensors(s2);
      setDevices(d2);
    }

    setPendingUpdate(null);
  }, [pendingUpdate]);

  const availableSensorTypes = useMemo(() => {
    return sensorTypes.filter((s) => s.category === selectedSensorCategory);
  }, [sensorTypes, selectedSensorCategory]);

  const availableConnectivityOptions = useMemo(() => {
    if (!editableNode) return [];

    if ("sensor_rad" in editableNode) {
      return (
        sensorTypes.find((s) => s.type === selectedSensorType)?.connectivity ??
        []
      );
    } else {
      return (
        deviceTypes.find(
          (d) =>
            d.type === selectedDeviceCategory && d.label === selectedDeviceLabel
        )?.connectivity ?? []
      );
    }
  }, [
    editableNode,
    sensorTypes,
    deviceTypes,
    selectedSensorType,
    selectedSensorCategory,
    selectedDeviceCategory,
    selectedDeviceLabel,
  ]);

  const availableDeviceLabels = useMemo(() => {
    return deviceTypes
      .filter((d) => d.type === selectedDeviceCategory)
      .map((d) => d.label);
  }, [deviceTypes, selectedDeviceCategory]);

  const handleChange = <K extends keyof (Sensor & Device)>(
    key: K,
    value: (Sensor & Device)[K]
  ) => {
    setEditableNode((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [key]: value };
      setPendingUpdate(updated);
      return updated;
    });
  };

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
        connectivity: [selected.connectivity[0] ?? ""],
      };
      setPendingUpdate(updated);
      return updated;
    });
  };

  const handleDeviceCategoryChange = (category: string) => {
    setSelectedDeviceCategory(category);
    const firstLabel =
      deviceTypes.find((d) => d.type === category)?.label ?? "";
    setSelectedDeviceLabel(firstLabel);

    const newConn =
      deviceTypes.find((d) => d.type === category && d.label === firstLabel)
        ?.connectivity[0] ?? "";

    setEditableNode((prev) => {
      if (!prev || !("device_rad" in prev)) return prev;
      const updated = {
        ...prev,
        type: category,
        label: firstLabel,
        connectivity: [newConn],
      };
      setPendingUpdate(updated);
      return updated;
    });
  };

  const handleDeviceLabelChange = (label: string) => {
    setSelectedDeviceLabel(label);
    const newConn =
      deviceTypes.find(
        (d) => d.type === selectedDeviceCategory && d.label === label
      )?.connectivity[0] ?? "";

    setEditableNode((prev) => {
      if (!prev || !("device_rad" in prev)) return prev;
      const updated = {
        ...prev,
        label,
        connectivity: [newConn],
      };
      setPendingUpdate(updated);
      return updated;
    });
  };

  const handleDelete = () => {
    if (!editableNode) return;

    if ("sensor_rad" in editableNode) {
      setSensors((prev) => prev.filter((s) => s.id !== editableNode.id));
    } else {
      setDevices((prev) => prev.filter((d) => d.id !== editableNode.id));
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

      <NodeConnectionSummary node={editableNode} />
      <button
        onClick={handleDelete}
        className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded cursor-pointer"
      >
        Delete Node
      </button>
    </div>
  );
}
