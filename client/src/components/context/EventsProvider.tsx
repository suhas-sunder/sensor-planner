import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { EventsContext } from "./EventsContextDefs";
import type { SimulationEvent } from "../utils/other/Types";
import useLocalStorage from "../hooks/useLocalStorage";

export const EventsProvider = ({ children }: { children: React.ReactNode }) => {
  const [eventLog, setEventLog] = useState<SimulationEvent[]>([]);
  const [floorIds, setFloorIds] = useState<string[]>(
    Array.from({ length: 6 }, () => uuidv4())
  );

  const addEvent = (event: Omit<SimulationEvent, "id" | "timestamp">) => {
    const newEvent: SimulationEvent = {
      ...event,
      id: uuidv4(),
      timestamp: Date.now(),
    };
    setEventLog((prev) => [...prev, newEvent]);
  };

  const clearEvents = () => setEventLog([]);

  // Load from localStorage on mount
  useLocalStorage({
    actionType: "init",
    setEventLog,
    setFloorIds,
  });

  // Sync to localStorage on every change
  useLocalStorage({
    actionType: "sync",
    eventLog,
    floorIds,
  });

  return (
    <EventsContext.Provider
      value={{ eventLog, addEvent, clearEvents, floorIds, setFloorIds }}
    >
      {children}
    </EventsContext.Provider>
  );
};
