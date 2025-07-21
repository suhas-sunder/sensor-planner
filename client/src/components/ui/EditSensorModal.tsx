import { useState } from "react";

export default function EditSensorModal({
  setShowSensorModal,
  modalType,
}: {
  setShowSensorModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: string;
}) {
  const [selectedSensorType, setSelectedSensorType] = useState("motion");
  const [sensorName, setSensorName] = useState("Motion Sensor");

  const sensorTypes = [
    { value: "motion", label: "Motion" },
    { value: "temperature", label: "Temperature" },
    { value: "humidity", label: "Humidity" },
    { value: "pressure", label: "Pressure" },
    { value: "co2", label: "CO₂" },
    { value: "voc", label: "VOC" },
    { value: "pm", label: "Particulate Matter (PM2.5)" },
    { value: "air_quality", label: "Air Quality" },
    { value: "light", label: "Light" },
    { value: "sound", label: "Sound Level" },
    { value: "noise", label: "Noise Detection" },
    { value: "gas", label: "Gas Leak" },
    { value: "smoke", label: "Smoke Detector" },
    { value: "leak", label: "Water Leak" },
    { value: "occupancy", label: "Occupancy" },
    { value: "presence", label: "Presence Detection" },
    { value: "vibration", label: "Vibration" },
    { value: "floor_pressure", label: "Floor Pressure" },
    { value: "fall", label: "Fall Detection" },
    { value: "thermal", label: "Thermal Sensor" },
    { value: "infrared", label: "Infrared Sensor" },
    { value: "bluetooth", label: "Bluetooth Beacon" },
    { value: "wifi", label: "WiFi Coverage Node" },
    { value: "fridge", label: "Fridge Monitor" },
    { value: "tv", label: "TV Monitor" },
    { value: "door", label: "Door Sensor" },
    { value: "window", label: "Window Sensor" },
    { value: "camera", label: "Camera Module" },
    { value: "ambient", label: "Ambient Sensor" },
    { value: "proximity", label: "Proximity Sensor" },
    { value: "uv", label: "UV Sensor" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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

          <div className="flex flex-col gap-2 mb-3">
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
                  setSensorName(`${selected.label} Sensor`);
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
          <div className="flex flex-col gap-2 mb-3 max-w-40 justify-center  items-center ">
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
        </div>
      )}
    </div>
  );
}
