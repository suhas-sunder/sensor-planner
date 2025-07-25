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
  const hasInitialized = useRef(false); // Track if the app has been initialized

  useEffect(() => {
    // Only run this effect once when the app initializes
    if (actionType === "init" && !hasInitialized.current) {
      // Load data from localStorage
      const storedSensors = localStorage.getItem("sensorData");
      const storedDevices = localStorage.getItem("deviceData");

      // Parse and set data if available
      if (storedSensors && setSensors) {
        try {
          setSensors(JSON.parse(storedSensors));
        } catch {
          console.error("Failed to parse sensor data");
        }
      }

      // Parse and set device data if available
      if (storedDevices && setDevices) {
        try {
          setDevices(JSON.parse(storedDevices));
        } catch {
          console.error("Failed to parse device data");
        }
      }
    }

    // Set hasInitialized to true after a short delay to ensure the initial load is complete
    // This prevents immediate sync issues on first load causing local storage to be overwritten by empty state
    const timer = setTimeout(() => {
      hasInitialized.current = true;
    }, 100);

    // Cleanup function to clear the timer so it doesn't leak memory
    return () => {
      clearTimeout(timer);
    };
  }, [actionType, setSensors, setDevices]);

  // Sync changes after init
  useEffect(() => {
    // Only sync if the app has been initialized and actionType is sync
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
      
      // If userId does not exist, generate a new one
      if (!userId) {
        const userName = generateUsername("-", 2, 20, "University Student");
        localStorage.setItem("userId", `user-${uuidv4()}`);
        localStorage.setItem("userName", userName);
      }
    }
  }, [actionType]);
}
