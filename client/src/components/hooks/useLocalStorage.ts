import type { LocalStorageData } from "./../utils/other/Types";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { generateUsername } from "unique-username-generator";

export default function useLocalStorage({
  actionType,
  sensors,
  devices,
  setSensors,
  setDevices,
}: LocalStorageData) {
  const didInitRef = useRef(false);

  useEffect(() => {
    if (actionType === "user-update") {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        const userName = generateUsername("-", 2, 20, "University Student");
        localStorage.setItem("userId", `user-${uuidv4().toString()}`);
        localStorage.setItem("userName", userName);
      }
    }

    if (actionType === "init") {
      if (!didInitRef.current) {
        // Load from localStorage once
        const storedSensors = localStorage.getItem("sensorData");
        const storedDevices = localStorage.getItem("deviceData");

        if (storedSensors && setSensors) {
          try {
            setSensors(JSON.parse(storedSensors));
          } catch {
            console.error("Failed to parse sensor data from localStorage");
            setSensors([]); // Reset to empty array if parsing fails
          }
        }

        if (storedDevices && setDevices) {
          try {
            setDevices(JSON.parse(storedDevices));
          } catch {
            console.error("Failed to parse device data from localStorage");
            setDevices([]); // Reset to empty array if parsing fails
          }
        }

        didInitRef.current = true;
      }
    }

    if (actionType === "sync") {
      // Save only after initial load
      if (didInitRef.current) {
        if (sensors) {
          localStorage.setItem("sensorData", JSON.stringify(sensors));
        }
        if (devices) {
          localStorage.setItem("deviceData", JSON.stringify(devices));
        }
      }
    }
  }, [actionType, sensors, devices, setSensors, setDevices]);
}
