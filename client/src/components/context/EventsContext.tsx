import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { EventsContext, type SimulationEvent } from "./EventsContextDefs";

// Wraps the EventsContext with state and functions
export const EventsProvider = ({ children }: { children: React.ReactNode }) => {
  const [eventLog, setEventLog] = useState<SimulationEvent[]>([]);

  const addEvent = (event: Omit<SimulationEvent, "id" | "timestamp">) => {
    const newEvent: SimulationEvent = {
      ...event,
      id: uuidv4(),
      timestamp: Date.now(),
    };
    setEventLog((prev) => [...prev, newEvent]);
  };

  const clearEvents = () => setEventLog([]);

  return (
    <EventsContext.Provider value={{ eventLog, addEvent, clearEvents }}>
      {children}
    </EventsContext.Provider>
  );
};
