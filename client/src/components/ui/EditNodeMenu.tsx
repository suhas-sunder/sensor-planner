import { useEffect, useMemo, useState } from "react";
import useSensorDeviceContext from "../hooks/useSensorDeviceContext";
import SensorTypes from "../data/SensorTypes";
import DeviceTypes from "../data/DeviceTypes";
import type { Sensor, Device } from "../utils/other/Types";
import DetectConnectedNodes from "../utils/computations/DetectConnectedNodes";
import DetectInterferenceNodes from "../utils/computations/DetectInterferenceNodes";
import NodeConnectionSummary from "../layout/NodeConnectionSummary";
import EditSensors from "./EditSensors";
import EditDevices from "./EditDevices";

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

      <EditDevices
        selectedDeviceCategory={selectedDeviceCategory}
        setSelectedDeviceCategory={setSelectedDeviceCategory}
        selectedDeviceLabel={selectedDeviceLabel}
        setSelectedDeviceLabel={setSelectedDeviceLabel}
        deviceTypes={deviceTypes}
        editableNode={editableNode}
        setEditableNode={setEditableNode}
        setPendingUpdate={setPendingUpdate}
        availableConnectivityOptions={availableConnectivityOptions}
        handleChange={handleChange}
      />

      <EditSensors
        editableNode={editableNode}
        setEditableNode={setEditableNode}
        sensorTypes={sensorTypes}
        selectedSensorCategory={selectedSensorCategory}
        setSelectedSensorCategory={setSelectedSensorCategory}
        selectedSensorType={selectedSensorType}
        setSelectedSensorType={setSelectedSensorType}
        setPendingUpdate={setPendingUpdate}
        handleChange={handleChange}
        availableConnectivityOptions={availableConnectivityOptions}
      />

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
