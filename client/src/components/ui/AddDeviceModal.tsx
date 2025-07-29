import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DeviceTypes from "../data/DeviceTypes";
import { useSensorDeviceContext } from "../hooks/useSensorDeviceContext.ts";
import type { Device } from "../utils/other/Types.tsx";
import { useParams } from "react-router-dom";
import useEventsContext from "../hooks/useEventsContext.ts";

export default function AddDeviceModal({
  setShowDeviceModal,
}: {
  setShowDeviceModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { floorId } = useParams(); // returns "1", "2", etc.
  const currentFloor = Number(floorId) || 1; // fallback to floor 1 if undefined or invalid
  const { setDevices } = useSensorDeviceContext();
  const { addEvent } = useEventsContext();
  const [selectedDeviceType, setSelectedDeviceType] = useState("");
  const [selectedDeviceCategory, setSelectedDeviceCategory] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [selectedConnectivityType, setSelectedConnectivityType] = useState("");
  const [radius, setRadius] = useState(30);
  const [xPosition, setXPosition] = useState(100);
  const [yPosition, setYPosition] = useState(100);

  const selectedDevice = DeviceTypes().find(
    (device) => device.label === selectedDeviceType
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowDeviceModal(false);

    const formData = new FormData(e.currentTarget);

    const deviceDefaults = DeviceTypes().find(
      (device) => device.label === formData.get("device_type")
    );

    const submittedData: Device = {
      id: `${formData.get("device_category")}-${uuidv4()}`,
      floor: currentFloor,
      type: String(formData.get("device_category")),
      label: String(formData.get("device_type")),
      name: String(formData.get("device_name")),
      x: Number(formData.get("x_position")),
      y: Number(formData.get("y_position")),
      connectivity: [String(formData.get("connectivity_type") ?? "")],
      device_rad: Number(formData.get("device_radius")),
      compatibleSensors: deviceDefaults?.compatibleSensors ?? [],
      interferenceProtocols: deviceDefaults?.interferenceProtocols ?? [],
    };

    setDevices((prev: Device[]) => [...prev, submittedData]);

    addEvent({
      nodeId: submittedData.id,
      nodeType: "device",
      floor: currentFloor,
      eventType: "status",
      message: `New device added: "${submittedData.name} - (${submittedData.connectivity})" of type "${submittedData.label}" and category " ${submittedData.type}"`,
    });
  };

  useEffect(() => {
    const allDevices = DeviceTypes();
    if (allDevices.length === 0) return;

    const firstDevice = allDevices[0];

    setSelectedDeviceCategory(firstDevice.type);
    setSelectedDeviceType(firstDevice.label);
    setDeviceName(`${firstDevice.label} - ${uuidv4().slice(0, 8)}`);

    if (firstDevice.connectivity.length > 0) {
      setSelectedConnectivityType(firstDevice.connectivity[0]);
    } else {
      setSelectedConnectivityType("");
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <button
        type="button"
        onClick={() => setShowDeviceModal(false)}
        className="absolute inset-0 bg-slate-900 opacity-10 pointer-events-auto cursor-pointer"
      />
      <div className="flex flex-col gap-3 relative min-w-1/4 bg-white text-black p-6 rounded-lg shadow-md z-10">
        <h2 className="text-xl font-bold text-slate-700">Add New Device</h2>

        <div className="flex flex-col gap-2 mb-3 w-full">
          <label
            htmlFor="device-category"
            className="font-bold text-slate-700 cursor-pointer"
          >
            Device Category
          </label>
          <select
            id="device-category"
            name="device_category"
            value={selectedDeviceCategory}
            onChange={(e) => {
              const selectedCategory = e.target.value;
              setSelectedDeviceCategory(selectedCategory);

              const firstDeviceInCategory = DeviceTypes().find(
                (device) => device.type === selectedCategory
              );

              if (firstDeviceInCategory) {
                setSelectedDeviceType(firstDeviceInCategory.label);
                setDeviceName(
                  `${firstDeviceInCategory.label} - ${uuidv4().slice(0, 8)}`
                );
              }
            }}
            className="border-2 border-slate-500 p-2 rounded-md capitalize"
          >
            {Array.from(new Set(DeviceTypes().map((d) => d.type))).map(
              (type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              )
            )}
          </select>
        </div>

        <div className="flex flex-col gap-2 mb-3 w-full">
          <label
            htmlFor="device-type"
            className="font-bold text-slate-700 cursor-pointer"
          >
            Device Type
          </label>
          <select
            id="device-type"
            name="device_type"
            value={selectedDeviceType}
            onChange={(e) => {
              const selected = DeviceTypes().find(
                (device) => device.label === e.target.value
              );
              if (selected) {
                setSelectedDeviceType(selected.label);
                setDeviceName(`${selected.label} - ${uuidv4().slice(0, 8)}`);
              }
            }}
            className="border-2 border-slate-500 p-2 rounded-md capitalize"
          >
            {Array.from(
              new Set(
                DeviceTypes()
                  .filter((device) => device.type === selectedDeviceCategory)
                  .map((device) => device.label)
              )
            ).map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 mb-3 w-full">
          <label htmlFor="device-name" className="font-bold text-slate-700">
            Device Name
          </label>
          <input
            id="device-name"
            name="device_name"
            type="text"
            required
            onChange={(e) => setDeviceName(e.target.value)}
            value={deviceName}
            className="border-2 border-slate-500 p-2 rounded-md"
          />
        </div>

        <div className="flex gap-4 mb-3 w-full">
          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="x-position" className="font-bold text-slate-700">
              x position from origin (m)
            </label>
            <input
              id="x-position"
              name="x_position"
              type="number"
              required
              value={xPosition}
              onChange={(e) => setXPosition(Number(e.target.value))}
              className="border-2 border-slate-500 p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <label htmlFor="y-position" className="font-bold text-slate-700">
              y position from origin (m)
            </label>
            <input
              id="y-position"
              name="y_position"
              type="number"
              required
              value={yPosition}
              onChange={(e) => setYPosition(Number(e.target.value))}
              className="border-2 border-slate-500 p-2 rounded-md"
            />
          </div>
        </div>

        {selectedDevice && selectedDevice.connectivity.length > 0 && (
          <div className="flex flex-col gap-2 mb-3 w-full">
            <label
              htmlFor="connectivity-type"
              className="font-bold text-slate-700 cursor-pointer"
            >
              Type of Connectivity
            </label>
            <select
              id="connectivity-type"
              name="connectivity_type"
              value={selectedConnectivityType}
              onChange={(e) => {
                setSelectedConnectivityType(e.target.value);
              }}
              className="border-2 border-slate-500 p-2 rounded-md"
            >
              {selectedDevice.connectivity.map((connectivity) => (
                <option key={connectivity} value={connectivity}>
                  {connectivity}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-2 mb-3 w-full">
          <label htmlFor="device-radius" className="font-bold text-slate-700">
            Coverage Radius (m)
          </label>
          <input
            id="device-radius"
            name="device_radius"
            type="number"
            placeholder="Enter radius in meters"
            required
            onChange={(e) => setRadius(Number(e.target.value))}
            value={radius}
            className="border-2 border-slate-500 p-2 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="text-white bg-green-600 p-2 rounded-md font-bold hover:brightness-110 hover:scale-105 transition-transform"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
