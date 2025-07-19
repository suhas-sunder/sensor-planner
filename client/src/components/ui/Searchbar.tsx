import { useEffect, useState } from "react";
import type { Device, SearchItem, Sensor } from "../utils/other/Types";

export default function Searchbar() {
  const [sensors, _setSensors] = useState<Sensor[]>([]);
  const [devices, _setDevices] = useState<Device[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);

  const allItems: SearchItem[] = [
    ...sensors.map((s) => ({ id: s.id, name: s.name, type: s.type })),
    ...devices.map((d) => ({ id: d.id, name: d.name, type: d.type })),
  ];

  useEffect(() => {
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      setResults([]);
      return;
    }

    setResults(
      allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.type.toLowerCase().includes(lowerQuery)
      )
    );
  }, [query, sensors, devices]);

  return (
    <div className="flex relative w-full max-w-[12.5em] mb-2  fill-slate-400 text-slate-100">
      <input
        type="text"
        className="w-full p-2 border border-slate-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <svg
        className="flex absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
      >
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path>
      </svg>

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-400 rounded shadow">
          {results.map((item) => (
            <div
              key={item.id}
              className="px-4 py-2 hover:bg-slate-400 cursor-pointer"
              onClick={() => {
                console.log("Clicked:", item.id);
              }}
            >
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-slate-500">{item.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
