import { createContext } from "react";
import type { SimulationEvent } from "../utils/other/Types";

// Defines the shape of the context for managing simulation events
export interface EventsContextType {
  eventLog: SimulationEvent[]; // Full log of all events
  addEvent: (event: Omit<SimulationEvent, "id" | "timestamp">) => void; // Adds a new event
  clearEvents: () => void; // Clears the log
  floorIds: string[];
  setFloorIds: React.Dispatch<React.SetStateAction<string[]>>;
}

// Create the context (defaults to null until wrapped in provider)
export const EventsContext = createContext<EventsContextType | null>(null);
