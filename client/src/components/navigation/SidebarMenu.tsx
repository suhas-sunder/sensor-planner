import { useEffect, useState } from "react";
import type { Device, SearchItem, Sensor } from "../utils/other/Types";

export default function SidebarMenu() {
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
    <div className="flex flex-col min-w-60 items-center bg-slate-800 gap-5 text-white">
      <h1 className="flex font-bold text-2xl mt-4 "> 4th Floor </h1>
      <div className="relative w-full max-w-md mx-auto mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="Search sensors, devices..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {results.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow">
            {results.map((item) => (
              <div
                key={item.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  console.log("Clicked:", item.id);
                }}
              >
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">{item.type}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col bg-slate-700 gap-3 rounded-md p-4 px-5">
        <div>Motion Sensor 1 </div>
        <div className="flex justify-center items-center min-w-40 min-h-40 bg-slate-600 rounded-md">
          PREVIEW IMG
        </div>
        <div>Status: Active </div>
        <div>Setting 1</div>
        <div>Setting 2</div>
        <div>Setting 3</div>
        <div>Setting 4</div>
      </div>

      <div className="flex flex-col gap-4 mt-auto -translate-y-6">
        <button className="flex min-w-[12em] justify-center items-center cursor-pointer hover:bg-white hover:fill-slate-900 fill-white font-semibold hover:text-slate-900 border-2 border-white rounded-md p-2">
          <svg
            className="flex w-6 h-6 mr-2"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path>
          </svg>
          <span>Add New Sensor</span>
        </button>
        <button className="flex min-w-[12em] justify-center items-center cursor-pointer hover:bg-white hover:fill-slate-900 fill-white font-semibold hover:text-slate-900 border-2 border-white rounded-md p-2">
          <svg
            className="flex w-6 h-6 mr-2"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path>
          </svg>
          <span>Add New Device</span>
        </button>
        <button className="flex min-w-[12em] justify-center items-center cursor-pointer hover:bg-white hover:fill-slate-900 fill-white font-semibold hover:text-slate-900 border-2 border-white rounded-md p-2">
          <svg
            className="flex w-6 h-6 mr-2"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7M2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2m4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3z"></path>
          </svg>{" "}
          <span>Hide All Sensors</span>
        </button>
        <button className="flex min-w-[12em] justify-center items-center cursor-pointer hover:bg-white hover:fill-slate-900 fill-white font-semibold hover:text-slate-900 border-2 border-white rounded-md p-2">
          <svg
            className="flex w-6 h-6 mr-2 "
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7M2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2m4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3z"></path>
          </svg>{" "}
          <span>Hide All Devices</span>
        </button>
      </div>
    </div>
  );
}
