import type { LocalStorageData } from "./../utils/other/Types";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { generateUsername } from "unique-username-generator";

// Custom React hook for managing localStorage interactions for sensors, devices, and user info
export default function useLocalStorage({
  actionType,
  sensors,
  devices,
  setSensors,
  setDevices,
  setSelectedNodeId,
  selectedNodeId,
}: LocalStorageData) {
  const hasInitialized = useRef(false); // Ref to track if the app has completed its initial load

  // Effect to load sensor and device data from localStorage on initial app load
  useEffect(() => {
    if (actionType === "init" && !hasInitialized.current) {
      // Only run on initial load
      const storedSensors = localStorage.getItem("sensorData"); // Retrieve sensors from localStorage
      const storedDevices = localStorage.getItem("deviceData"); // Retrieve devices from localStorage

      if (storedSensors && setSensors) {
        // If sensors exist and setter is provided
        try {
          setSensors(JSON.parse(storedSensors)); // Parse and set sensors state
        } catch {
          console.error("Failed to parse sensor data"); // Log error if parsing fails
        }
      }

      if (storedDevices && setDevices) {
        // If devices exist and setter is provided
        try {
          setDevices(JSON.parse(storedDevices)); // Parse and set devices state
        } catch {
          console.error("Failed to parse device data"); // Log error if parsing fails
        }
      }
    }

    const timer = setTimeout(() => {
      hasInitialized.current = true; // Mark initialization as complete after short delay
    }, 100);

    return () => {
      clearTimeout(timer); // Cleanup timer on unmount or dependency change
    };
  }, [actionType, setSensors, setDevices]);

  // Effect to sync sensor and device data to localStorage after initialization
  useEffect(() => {
    if (actionType === "sync" && hasInitialized.current) {
      // Only sync after initialization
      if (sensors) {
        localStorage.setItem("sensorData", JSON.stringify(sensors)); // Store sensors in localStorage
      }
      if (devices) {
        localStorage.setItem("deviceData", JSON.stringify(devices)); // Store devices in localStorage
      }
    }
  }, [actionType, sensors, devices]);

  // Effect to load sensors, devices, and selected node ID from localStorage on initial load
  useEffect(() => {
    if (actionType === "init" && !hasInitialized.current) {
      // Only run on initial load
      const storedSensors = localStorage.getItem("sensorData"); // Retrieve sensors from localStorage
      const storedDevices = localStorage.getItem("deviceData"); // Retrieve devices from localStorage
      const storedSelectedNodeId = localStorage.getItem("selectedNodeId"); // Retrieve selected node ID

      if (storedSensors && setSensors) {
        // If sensors exist and setter is provided
        try {
          setSensors(JSON.parse(storedSensors)); // Parse and set sensors state
        } catch {
          console.error("Failed to parse sensor data"); // Log error if parsing fails
        }
      }

      if (storedDevices && setDevices) {
        // If devices exist and setter is provided
        try {
          setDevices(JSON.parse(storedDevices)); // Parse and set devices state
        } catch {
          console.error("Failed to parse device data"); // Log error if parsing fails
        }
      }

      if (storedSelectedNodeId && setSelectedNodeId) {
        // If selected node ID exists and setter is provided
        setSelectedNodeId(storedSelectedNodeId); // Set selected node ID state
      }
    }

    const timer = setTimeout(() => {
      hasInitialized.current = true; // Mark initialization as complete after short delay
    }, 100);

    return () => {
      clearTimeout(timer); // Cleanup timer on unmount or dependency change
    };
  }, [actionType, setSensors, setDevices, setSelectedNodeId]);

  // Effect to sync sensors, devices, and selected node ID to localStorage after initialization
  useEffect(() => {
    if (actionType === "sync" && hasInitialized.current) {
      // Only sync after initialization
      if (sensors) {
        localStorage.setItem("sensorData", JSON.stringify(sensors)); // Store sensors in localStorage
      }
      if (devices) {
        localStorage.setItem("deviceData", JSON.stringify(devices)); // Store devices in localStorage
      }

      if (selectedNodeId || selectedNodeId === null) {
        // Store selected node ID (even if null)
        localStorage.setItem("selectedNodeId", selectedNodeId || ""); // Store selected node ID in localStorage
      }
    }
  }, [actionType, sensors, devices, selectedNodeId]);

  // Effect to generate and store a user ID and username if not already present in localStorage
  useEffect(() => {
    if (actionType === "user-update") {
      // Only run when user info needs to be updated
      const userId = localStorage.getItem("userId"); // Check if userId exists

      if (!userId) {
        // If userId does not exist
        const userName = generateUsername("-", 2, 20, "University Student"); // Generate a random username
        localStorage.setItem("userId", `user-${uuidv4()}`); // Generate and store a new userId
        localStorage.setItem("userName", userName); // Store generated username
      }
    }
  }, [actionType]);
}
