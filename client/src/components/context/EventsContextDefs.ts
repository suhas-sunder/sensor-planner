import { createContext } from "react";

// Defines the shape of a simulation event
export type SimulationEvent = {
  id: string;
  floor: number;
  nodeId: string;
  nodeType: "sensor" | "device";
  eventType: "connectivity" | "interference" | "motion" | "status";
  timestamp: number;
  message: string;
};

// Defines the shape of the context for managing simulation events
export interface EventsContextType {
  eventLog: SimulationEvent[]; // Full log of all events
  addEvent: (event: Omit<SimulationEvent, "id" | "timestamp">) => void; // Adds a new event
  clearEvents: () => void; // Clears the log
}

// Create the context (defaults to null until wrapped in provider)
export const EventsContext = createContext<EventsContextType | null>(null);
