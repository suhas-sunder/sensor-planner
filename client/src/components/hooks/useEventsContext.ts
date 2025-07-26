import { useContext } from "react";
import {
  EventsContext,
  type EventsContextType,
} from "../context/EventsContextDefs";

// Hook to use EventsContext
export default function useEventsContext(): EventsContextType {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}
