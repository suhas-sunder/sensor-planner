import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function EditSensorModal({
  setShowSensorModal,
  modalType,
}: {
  setShowSensorModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: string;
}) {
  const [selectedSensorType, setSelectedSensorType] = useState("motion");
  const [sensorName, setSensorName] = useState(
    `Motion Sensor - ${uuidv4().slice(0, 8)}`
  );

  const sensorTypes = [
    { value: "motion", label: "Motion Sensor" },
    { value: "temperature", label: "Temperature Sensor" },
    { value: "humidity", label: "Humidity Sensor" },
    { value: "pressure", label: "Pressure Sensor" },
    { value: "co2", label: "CO₂ Sensor" },
    { value: "voc", label: "VOC Sensor" },
    { value: "pm", label: "Particulate Matter (PM2.5) Sensor" },
    { value: "air_quality", label: "Air Quality Sensor" },
    { value: "light", label: "Light Sensor" },
    { value: "sound", label: "Sound Level Sensor" },
    { value: "noise", label: "Noise Detection Sensor" },
    { value: "gas", label: "Gas Leak Sensor" },
    { value: "smoke", label: "Smoke Detector Sensor" },
    { value: "leak", label: "Water Leak Sensor" },
    { value: "occupancy", label: "Occupancy Sensor" },
    { value: "presence", label: "Presence Detection Sensor" },
    { value: "vibration", label: "Vibration Sensor" },
    { value: "floor_pressure", label: "Floor Pressure Sensor" },
    { value: "fall", label: "Fall Detection Sensor" },
    { value: "thermal", label: "Thermal Sensor" },
    { value: "infrared", label: "Infrared Sensor" },
    { value: "bluetooth", label: "Bluetooth Beacon Sensor" },
    { value: "wifi", label: "WiFi Coverage Node Sensor" },
    { value: "fridge", label: "Fridge Monitor Sensor" },
    { value: "tv", label: "TV Monitor Sensor" },
    { value: "door", label: "Door Sensor" },
    { value: "window", label: "Window Sensor" },
    { value: "camera", label: "Camera Module Sensor" },
    { value: "ambient", label: "Ambient Sensor" },
    { value: "proximity", label: "Proximity Sensor" },
    { value: "uv", label: "UV Sensor" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSensorModal(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Transparent dark backdrop */}
      <button
        onClick={() => setShowSensorModal(false)}
        className="absolute inset-0 bg-slate-900 opacity-10 pointer-events-auto cursor-pointer"
      />

      {/* Modal content */}

      {modalType === "edit" ? (
        <div className="relative bg-white text-black p-6 rounded-lg shadow-md z-10 pointer-events-auto">
          <h2 className="text-xl font-bold mb-4">Edit Sensor</h2>
          <p>Your content here</p>
        </div>
      ) : (
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
                const selected = sensorTypes.find(
                  (t) => t.value === e.target.value
                );
                if (selected) {
                  setSelectedSensorType(selected.value);
                  setSensorName(`${selected.label} - ${uuidv4().slice(0, 8)}`);
                }
              }}
              className="flex border-2 border-slate-500 w-full p-2 rounded-md cursor-pointer"
            >
              {sensorTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
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
              placeholder="Enter radius in meters"
              value={sensorName}
              className="flex border-2 border-slate-500 w-full h-full p-2 rounded-md h-full cursor-pointer"
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
                placeholder="Enter position in meters"
                value={100}
                className="flex border-2 border-slate-500 w-full h-full p-2 rounded-md h-full cursor-pointer max-w-40"
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
                placeholder="Enter position in meters"
                value={100}
                className="flex border-2 border-slate-500 w-full h-full p-2 rounded-md h-full cursor-pointer max-w-40"
              />
            </div>
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
              value={30}
              className="flex border-2 border-slate-500 w-full h-full p-2 rounded-md h-full cursor-pointer"
            />
          </div>
          <button
            type="submit"
            className="text-white bg-green-600 bg-blue p-2 rounded-md hover:bg-blue-hover font-bold flex justify-center items-center w-full max-w-[12em] hover:scale-[1.02] hover:brightness-110 translate-y-1 mb-3 hover:scale-[1.02] hover:brightness-110 translate-y-1 cursor-pointer"
          >
            Submit
          </button>
        </div>
      )}
    </form>
  );
}
