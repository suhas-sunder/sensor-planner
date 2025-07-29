import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import SensorTypes from "../data/SensorTypes";
import { useSensorDeviceContext } from "../hooks/useSensorDeviceContext.ts";
import type { Sensor } from "../utils/other/Types.tsx";
import { useParams } from "react-router-dom";
import useEventsContext from "../hooks/useEventsContext.ts";

export default function AddSensorModal({
  setShowSensorModal,
}: {
  setShowSensorModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { floorId } = useParams();
  const currentFloor = Number(floorId) || 1;
  const { setSensors } = useSensorDeviceContext();
  const { addEvent } = useEventsContext();

  const [selectedSensorCategory, setSelectedSensorCategory] = useState("");
  const [selectedSensorType, setSelectedSensorType] = useState("");
  const [sensorName, setSensorName] = useState("");
  const [selectedConnectivityType, setSelectedConnectivityType] = useState("");
  const [radius, setRadius] = useState(150);
  const [xPosition, setXPosition] = useState(100);
  const [yPosition, setYPosition] = useState(100);

  const allSensors = SensorTypes();
  const selectedSensor = allSensors.find((s) => s.label === selectedSensorType);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSensorModal(false);

    const newSensor: Sensor = {
      id: `${selectedSensorCategory}-${uuidv4()}`,
      floor: currentFloor,
      type: selectedSensor?.type ?? "",
      name: sensorName,
      x: xPosition,
      y: yPosition,
      connectivity: [selectedConnectivityType],
      sensor_rad: radius,
      connectedDeviceIds: [],
      interferenceIds: [],
    };

    setSensors((prev: Sensor[]) => [...prev, newSensor]);

    addEvent({
      nodeId: newSensor.id,
      nodeType: "sensor",
      eventType: "status",
      floor: currentFloor,
      message: `New sensor added: "${newSensor.name} - (${newSensor.connectivity})" of type "${newSensor.type}" and category " ${selectedSensorCategory}"`,
    });
  };

  useEffect(() => {
    if (allSensors.length === 0) return;

    const first = allSensors[0];
    setSelectedSensorCategory(first.category);
    setSelectedSensorType(first.label);
    setSensorName(`${first.label} - ${uuidv4().slice(0, 8)}`);
    setSelectedConnectivityType(first.connectivity[0] ?? "");
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <button
        type="button"
        onClick={() => setShowSensorModal(false)}
        className="absolute inset-0 bg-slate-900 opacity-10 cursor-pointer"
      />
      <div className="flex flex-col gap-3 relative min-w-1/4 bg-white text-black p-6 rounded-lg shadow-md z-10">
        <h2 className="text-xl font-bold text-slate-700">Add New Sensor</h2>

        {/* Category */}
        <div className="flex flex-col gap-2 mb-3 w-full">
          <label htmlFor="sensor-category" className="font-bold text-slate-700">
            Sensor Category
          </label>
          <select
            id="sensor-category"
            name="sensor_category"
            value={selectedSensorCategory}
            onChange={(e) => {
              const selectedCategory = e.target.value;
              setSelectedSensorCategory(selectedCategory);

              const firstMatch = allSensors.find(
                (s) => s.category === selectedCategory
              );
              if (firstMatch) {
                setSelectedSensorType(firstMatch.label);
                setSensorName(`${firstMatch.label} - ${uuidv4().slice(0, 8)}`);
                setSelectedConnectivityType(firstMatch.connectivity[0] ?? "");
              }
            }}
            className="border-2 border-slate-500 p-2 rounded-md capitalize"
          >
            {[...new Set(allSensors.map((s) => s.category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2 mb-3 w-full">
          <label htmlFor="sensor-type" className="font-bold text-slate-700">
            Sensor Type
          </label>
          <select
            id="sensor-type"
            name="sensor_type"
            value={selectedSensorType}
            onChange={(e) => {
              const sensor = allSensors.find((s) => s.label === e.target.value);
              if (sensor) {
                setSelectedSensorType(sensor.label);
                setSensorName(`${sensor.label} - ${uuidv4().slice(0, 8)}`);
                setSelectedConnectivityType(sensor.connectivity[0] ?? "");
              }
            }}
            className="border-2 border-slate-500 p-2 rounded-md capitalize"
          >
            {allSensors
              .filter((s) => s.category === selectedSensorCategory)
              .map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label}
                </option>
              ))}
          </select>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-2 mb-3 w-full">
          <label htmlFor="sensor-name" className="font-bold text-slate-700">
            Sensor Name
          </label>
          <input
            id="sensor-name"
            name="sensor_name"
            type="text"
            required
            onChange={(e) => setSensorName(e.target.value)}
            value={sensorName}
            className="border-2 border-slate-500 p-2 rounded-md"
          />
        </div>

        {/* X and Y */}
        <div className="flex gap-4 mb-3 w-full">
          <div className="flex flex-col w-1/2">
            <label htmlFor="x-position" className="font-bold text-slate-700">
              X Position
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
          <div className="flex flex-col w-1/2">
            <label htmlFor="y-position" className="font-bold text-slate-700">
              Y Position
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

        {/* Connectivity */}
        {selectedSensor && selectedSensor.connectivity.length > 0 && (
          <div className="flex flex-col gap-2 mb-3 w-full">
            <label
              htmlFor="connectivity-type"
              className="font-bold text-slate-700"
            >
              Connectivity Type
            </label>
            <select
              id="connectivity-type"
              name="connectivity_type"
              value={selectedConnectivityType}
              onChange={(e) => setSelectedConnectivityType(e.target.value)}
              className="border-2 border-slate-500 p-2 rounded-md"
            >
              {selectedSensor.connectivity.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Radius */}
        <div className="flex flex-col gap-2 mb-3 w-full">
          <label htmlFor="sensor-radius" className="font-bold text-slate-700">
            Sensor Radius (m)
          </label>
          <input
            id="sensor-radius"
            name="sensor_radius"
            type="number"
            required
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
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
