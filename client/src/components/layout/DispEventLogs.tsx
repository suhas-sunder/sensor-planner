import { useParams } from "react-router-dom";
import useEventsContext from "../hooks/useEventsContext";
import type { SimulationEvent } from "../utils/other/Types";

export default function DispEventLogs() {
  const { eventLog } = useEventsContext();
  const { floorId } = useParams();
  const currentFloor = Number(floorId) || 1;

  const EVENT_LIMIT = 20;

  const renderMessage = (message: string) => {
    const parts = message.split(/(".*?")/g); // split at quoted text
    return parts.map((part, idx) =>
      part.startsWith('"') && part.endsWith('"') ? (
        <span key={idx} className="text-red-600 font-semibold">
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  const renderFilteredEvents = (
    type: SimulationEvent["eventType"],
    nodeType?: SimulationEvent["nodeType"]
  ) => {
    const filtered = eventLog
      .filter((e) => e.eventType === type && e.floor === currentFloor)
      .filter((e) => !nodeType || e.nodeType === nodeType)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, EVENT_LIMIT);

    return filtered.length ? (
      <ul className="space-y-2 mt-2 w-full max-h-[20em] overflow-y-auto pr-1">
        {filtered.map((event) => (
          <li
            key={event.id}
            className="flex flex-col border border-slate-300 bg-slate-50 rounded-md p-2 shadow-sm"
          >
            <div className="text-[0.85rem] font-semibold mb-1 text-pink-600">
              {new Date(event.timestamp).toLocaleTimeString()}
            </div>
            <div className="text-sm text-green-800">
              {renderMessage(event.message)}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-slate-400 mt-2">No events</p>
    );
  };

  return (
    <div className="flex flex-col gap-5 bg-slate-200 w-full min-w-20 p-4 overflow-hidden">
      <h2 className="flex font-semibold text-sm text-slate-800 text-[2rem] underline">
        Summary of Simulation & Activity
      </h2>

      <div className="grid grid-cols-3 gap-4 mx-8 overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
        <div className="flex flex-col items-start bg-white p-4 rounded-lg">
          <h3 className="text-slate-800 font-medium mb-1">
            Movement Detection
          </h3>
          {renderFilteredEvents("motion")}
        </div>

        <div className="flex flex-col items-start bg-white p-4 rounded-lg">
          <h3 className="text-slate-800 font-medium mb-1">
            Device Status Updates
          </h3>
          {renderFilteredEvents("status", "device")}
        </div>

        <div className="flex flex-col items-start bg-white p-4 rounded-lg">
          <h3 className="text-slate-800 font-medium mb-1">
            Sensor Status Updates
          </h3>
          {renderFilteredEvents("status", "sensor")}
        </div>

        <div className="flex flex-col items-start bg-white p-4 rounded-lg">
          <h3 className="text-slate-800 font-medium mb-1">Connected Nodes</h3>
          {renderFilteredEvents("connectivity")}
        </div>

        <div className="flex flex-col items-start bg-white p-4 rounded-lg">
          <h3 className="text-slate-800 font-medium mb-1">Interfering Nodes</h3>
          {renderFilteredEvents("interference")}
        </div>

        <div className="flex flex-col items-start bg-white p-4 rounded-lg col-span-1">
          <h3 className="text-slate-800 font-medium mb-1">Recent Events</h3>
          {eventLog.length ? (
            <ul className="space-y-2 mt-2 w-full max-h-[20em] overflow-y-auto pr-1">
              {eventLog
                .filter((e) => e.floor === currentFloor)
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, EVENT_LIMIT)
                .map((event) => (
                  <li
                    key={event.id}
                    className="flex flex-col border border-slate-300 bg-slate-50 rounded-md p-2 shadow-sm"
                  >
                    <div className="text-[0.85rem] font-semibold mb-1 text-pink-600">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-sm text-green-800">
                      {renderMessage(event.message)}
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 mt-2">No recent events</p>
          )}
        </div>
      </div>
    </div>
  );
}
