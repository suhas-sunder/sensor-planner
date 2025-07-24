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
  const hasInitialized = useRef(false);

  // Load on first app init
  useEffect(() => {
    if (actionType === "init" && !hasInitialized.current) {
      const storedSensors = localStorage.getItem("sensorData");
      const storedDevices = localStorage.getItem("deviceData");

      if (storedSensors && setSensors) {
        try {
          setSensors(JSON.parse(storedSensors));
        } catch {
          console.error("Failed to parse sensor data");
        }
      }

      if (storedDevices && setDevices) {
        try {
          setDevices(JSON.parse(storedDevices));
        } catch {
          console.error("Failed to parse device data");
        }
      }
    }

    const timer = setTimeout(() => {
      hasInitialized.current = true;
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [actionType, setSensors, setDevices]);

  // Sync changes after init
  useEffect(() => {
    if (actionType === "sync" && hasInitialized.current) {
      if (sensors) {
        localStorage.setItem("sensorData", JSON.stringify(sensors));
      }
      if (devices) {
        localStorage.setItem("deviceData", JSON.stringify(devices));
      }
    }
  }, [actionType, sensors, devices]);

  // User ID generation
  useEffect(() => {
    if (actionType === "user-update") {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        const userName = generateUsername("-", 2, 20, "University Student");
        localStorage.setItem("userId", `user-${uuidv4()}`);
        localStorage.setItem("userName", userName);
      }
    }
  }, [actionType]);
}
