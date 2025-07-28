import type { LocalStorageData } from "./../utils/other/Types";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { generateUsername } from "unique-username-generator";

// Custom React hook for managing localStorage interactions for sensors, devices, people, and user info
export default function useLocalStorage({
  actionType,
  sensors,
  devices,
  people,
  selectedNodeId,
  eventLog,
  floorIds,
  setSensors,
  setDevices,
  setPeople,
  setSelectedNodeId,
  setEventLog,
  setFloorIds,
}: LocalStorageData) {
  const hasInitialized = useRef(false); // Used across all effects

  // Universal timer to mark initialization done
  useEffect(() => {
    const timer = setTimeout(() => {
      hasInitialized.current = true;
    }, 100); // Enough delay for init effect to complete

    return () => clearTimeout(timer);
  }, []);

  // Initialization: load from localStorage
  useEffect(() => {
    if (actionType !== "init" || hasInitialized.current) return;

    const storedSensors = localStorage.getItem("sensorData");
    const storedDevices = localStorage.getItem("deviceData");
    const storedPeople = localStorage.getItem("peopleData");
    const storedEvents = localStorage.getItem("eventLog");
    const storedFloorIds = localStorage.getItem("floorIds");
    const storedSelectedNodeId = localStorage.getItem("selectedNodeId");

    try {
      if (storedSensors && setSensors) setSensors(JSON.parse(storedSensors));
    } catch {
      console.error("Failed to parse sensor data");
    }

    try {
      if (storedDevices && setDevices) setDevices(JSON.parse(storedDevices));
    } catch {
      console.error("Failed to parse device data");
    }

    try {
      if (storedPeople && setPeople) setPeople(JSON.parse(storedPeople));
    } catch {
      console.error("Failed to parse people data");
    }

    try {
      if (storedEvents && setEventLog) setEventLog(JSON.parse(storedEvents));
    } catch {
      console.error("Failed to parse event log data");
    }

    try {
      if (storedFloorIds && setFloorIds) {
        const parsed = JSON.parse(storedFloorIds);
        if (
          Array.isArray(parsed) &&
          parsed.every((id) => typeof id === "string")
        ) {
          setFloorIds(parsed);
        }
      }
    } catch {
      console.error("Failed to parse floorIds");
    }

    if (storedSelectedNodeId && setSelectedNodeId) {
      setSelectedNodeId(storedSelectedNodeId);
    }
  }, [
    actionType,
    setSensors,
    setDevices,
    setPeople,
    setEventLog,
    setSelectedNodeId,
    setFloorIds,
  ]);

  // Sync changes to localStorage
  useEffect(() => {
    if (actionType !== "sync" || !hasInitialized.current) return;
    if (sensors) localStorage.setItem("sensorData", JSON.stringify(sensors));
    if (devices) localStorage.setItem("deviceData", JSON.stringify(devices));
    if (people) localStorage.setItem("peopleData", JSON.stringify(people));
    if (eventLog) localStorage.setItem("eventLog", JSON.stringify(eventLog));
    if (floorIds) localStorage.setItem("floorIds", JSON.stringify(floorIds));
    if (selectedNodeId || selectedNodeId === null)
      localStorage.setItem("selectedNodeId", selectedNodeId || "");
  }, [
    actionType,
    sensors,
    devices,
    people,
    eventLog,
    selectedNodeId,
    floorIds,
  ]);

  // Generate user info on first load if missing
  useEffect(() => {
    if (actionType !== "user-update") return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      const userName = generateUsername("-", 2, 20, "University Student");
      localStorage.setItem("userId", `user-${uuidv4()}`);
      localStorage.setItem("userName", userName);
    }
  }, [actionType]);
}
