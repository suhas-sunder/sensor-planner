import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import SensorTypes from "../data/SensorTypes";
import useSensorDeviceContext from "../hooks/useSensorDeviceContext";
import type { Sensor } from "../utils/other/Types";

export default function AddSensorModal({
  setShowSensorModal,
}: {
  setShowSensorModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setSensors } = useSensorDeviceContext();

  const [selectedSensorType, setSelectedSensorType] = useState("motion");
  const [sensorName, setSensorName] = useState(
    `Motion Sensor - ${uuidv4().slice(0, 8)}`
  );
  const [selectedConnectivityType, setSelectedConnectivityType] =
    useState("Wi-Fi 2.4GHz");
  const [radius, setRadius] = useState("30");
  const [xPosition, setXPosition] = useState("100");
  const [yPosition, setYPosition] = useState("100");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSensorModal(false);

    const formData = new FormData(e.currentTarget);

    const submittedData: Sensor = {
      id: `${formData.get("sensor_type")}-${uuidv4()}`,
      type: String(formData.get("sensor_type") ?? ""),
      name: String(formData.get("sensor_name") ?? ""),
      x: Number(formData.get("x_position")),
      y: Number(formData.get("y_position")),
      connectivity: [String(formData.get("connectivity_type") ?? "")],
      sensor_rad: Number(formData.get("sensor_radius")),
    };

    setSensors((prev: Sensor[]) => [...prev, submittedData]);

    console.log(submittedData);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <button
          type="button"
          onClick={() => setShowSensorModal(false)}
          className="absolute inset-0 bg-slate-900 opacity-10 pointer-events-auto cursor-pointer"
        />
        <div className="flex flex-col  gap-3 relative min-w-1/4 min-h-1/4 bg-white text-black p-6 rounded-lg shadow-md z-10 pointer-events-auto justify-center  items-center ">
          <h2 className="text-xl font-bold text-slate-700">Add New Sensor</h2>

          <div className="flex flex-col gap-2 mb-3 w-full max-w-70">
            <label
              htmlFor="sensor-type"
              className="font-bold text-slate-700 cursor-pointer"
            >
              Sensor Type
            </label>
            <select
              id="sensor-type"
              name="sensor_type"
              value={selectedSensorType}
              onChange={(e) => {
                const selected = SensorTypes().find(
                  (sensor) => sensor.type === e.target.value
                );
                if (selected) {
                  setSelectedSensorType(selected.type);
                  setSensorName(`${selected.label} - ${uuidv4().slice(0, 8)}`);
                }
              }}
              className="flex border-2 border-slate-500 w-full p-2 rounded-md cursor-pointer"
            >
              {SensorTypes().map((sensor) => (
                <option key={sensor.type} value={sensor.type}>
                  {sensor.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 mb-3 w-full max-w-70 justify-center  items-center ">
            <label htmlFor="sensor-name" className="font-bold text-slate-700">
              Sensor Name
            </label>
            <input
              id="sensor-name"
              name="sensor_name"
              type="text"
              required
              placeholder="Enter radius in meters"
              onChange={(e) => setSensorName(e.target.value)}
              value={sensorName}
              className="flex border-2 border-slate-500 w-full h-full p-2 rounded-md cursor-pointer"
            />
          </div>

          <div className="flex gap-5 w-full justify-evenly mb-3">
            <div className="flex justify-center  items-center flex-col gap-2">
              <label
                htmlFor="x-position"
                className="font-bold text-slate-700 cursor-pointer"
              >
                x position from origin (m)
              </label>
              <input
                id="x-position"
                name="x_position"
                type="number"
                required
                placeholder="Enter position in meters"
                value={xPosition}
                onChange={(e) => setXPosition(e.target.value)}
                className="flex border-2 border-slate-500 w-full h-full p-2 rounded-md cursor-pointer max-w-40"
              />
            </div>
            <div className="flex justify-center  items-center flex-col gap-2">
              <label htmlFor="x-position" className="font-bold text-slate-700">
                y position from origin (m)
              </label>
              <input
                id="y-position"
                name="y_position"
                type="number"
                required
                placeholder="Enter position in meters"
                onChange={(e) => setYPosition(e.target.value)}
                value={yPosition}
                className="flex border-2 border-slate-500 w-full h-full p-2 rounded-md cursor-pointer max-w-40"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-3 w-full max-w-70">
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
              onChange={(e) => setSelectedConnectivityType(e.target.value)}
              className="flex border-2 border-slate-500 w-full p-2 rounded-md cursor-pointer"
            >
              {SensorTypes()
                .find((sensor) => sensor.type === selectedSensorType)
                ?.connectivity.map((connectivity) => (
                  <option key={connectivity} value={connectivity}>
                    {connectivity}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 mb-3 max-w-40 justify-center  items-center ">
            <label htmlFor="sensor-radius" className="font-bold text-slate-700">
              Coverage Radius (m)
            </label>
            <input
              id="sensor-radius"
              name="sensor_radius"
              type="number"
              placeholder="Enter radius in meters"
              required
              onChange={(e) => setRadius(e.target.value)}
              value={radius}
              className="flex border-2 border-slate-500 w-full h-full p-2 rounded-md cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="text-white bg-green-600 bg-blue p-2 rounded-md hover:bg-blue-hover font-bold flex justify-center items-center w-full max-w-[12em] hover:scale-[1.02] hover:brightness-110 translate-y-1 mb-3 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
