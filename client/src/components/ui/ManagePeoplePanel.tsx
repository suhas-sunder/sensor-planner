import { useState } from "react";
import { useParams } from "react-router-dom";
import useSensorDeviceContext from "../hooks/useSensorDeviceContext";
import type { Person } from "../utils/other/Types";

export default function ManagePeoplePanel() {
  const { floorId } = useParams();
  const currentFloor = Number(floorId) || 1;

  const { people, setPeople } = useSensorDeviceContext();
  const visiblePeople = people.filter((p) => p.floor === currentFloor);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedPerson = visiblePeople.find((p) => p.id === selectedId);

  const handleUpdate = (updates: Partial<Person>) => {
    if (!selectedPerson) return;
    const updated = { ...selectedPerson, ...updates };
    setPeople(people.map((p) => (p.id === selectedPerson.id ? updated : p)));
  };

  const handleDelete = () => {
    if (!selectedPerson) return;
    setPeople(people.filter((p) => p.id !== selectedPerson.id));
    setSelectedId(null);
  };

  if (!visiblePeople.length) return <></>;

  return (
    <div className="flex flex-col w-full px-4 py-2 border-t border-slate-600 text-white">
      {!selectedPerson ? (
        <>
          <h3 className="text-lg font-semibold text-white mb-2 mt-4">
            Simulated People
          </h3>
          <ul className="flex flex-col gap-1">
            {visiblePeople.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => setSelectedId(p.id)}
                  className="w-full text-left px-2 py-1 rounded-md hover:bg-slate-700 cursor-pointer transition-colors duration-200"
                >
                  👤 {p.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="flex flex-col gap-3 max-w-[12em] justify-center mb-8">
          <h3 className="text-lg font-semibold mb-2 mt-4">Edit Person Sim</h3>

          {/* Name */}
          <div className="flex flex-col mb-2 w-full">
            <label className="text-sm font-medium text-slate-300">Name</label>
            <input
              type="text"
              value={selectedPerson.name}
              onChange={(e) => handleUpdate({ name: e.target.value })}
              className="px-2 py-1 rounded-md bg-slate-700 text-white border border-slate-500 w-full"
            />
          </div>

          {/* Color */}
          <div className="flex flex-col mb-2 w-full">
            <label className="text-sm font-medium text-slate-300">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedPerson.color}
                onChange={(e) => handleUpdate({ color: e.target.value })}
                className="w-10 h-8 p-0.5 border border-slate-500 rounded-md bg-white"
              />
              <input
                type="text"
                value={selectedPerson.color}
                onChange={(e) => handleUpdate({ color: e.target.value })}
                className="px-2 py-1 rounded-md bg-slate-700 text-white border border-slate-500 w-full"
              />
            </div>
          </div>

          {/* Speed */}
          <div className="flex flex-col mb-2">
            <label className="text-sm font-medium text-slate-300">
              Animation Speed (px/sec)
            </label>
            <input
              type="number"
              value={selectedPerson.animationSpeed}
              min={10}
              max={200}
              step={1}
              onChange={(e) =>
                handleUpdate({ animationSpeed: parseFloat(e.target.value) })
              }
              className="px-2 py-1 rounded-md bg-slate-700 text-white border border-slate-500"
            />
          </div>

          {/* Path Points */}
          <div className="flex flex-col mb-3">
            <label className="text-sm font-medium text-slate-300 mb-1">
              Path Points
            </label>

            {selectedPerson.path.map((pt, idx) => (
              <div className="flex gap-2 items-center mb-1" key={idx}>
                <div className="flex flex-col w-1/2">
                  <label className="text-xs text-slate-400">X</label>
                  <input
                    type="number"
                    value={pt.x}
                    onChange={(e) => {
                      const updatedPath = [...selectedPerson.path];
                      updatedPath[idx] = {
                        ...updatedPath[idx],
                        x: Number(e.target.value),
                      };
                      handleUpdate({ path: updatedPath });
                    }}
                    className="px-2 py-1 rounded-md bg-slate-700 text-white border border-slate-500"
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-xs text-slate-400">Y</label>
                  <input
                    type="number"
                    value={pt.y}
                    onChange={(e) => {
                      const updatedPath = [...selectedPerson.path];
                      updatedPath[idx] = {
                        ...updatedPath[idx],
                        y: Number(e.target.value),
                      };
                      handleUpdate({ path: updatedPath });
                    }}
                    className="px-2 py-1 rounded-md bg-slate-700 text-white border border-slate-500"
                  />
                </div>
                <div className="w-6 flex justify-center items-center">
                  {selectedPerson.path.length > 2 && idx > 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        const updatedPath = selectedPerson.path.filter(
                          (_, i) => i !== idx
                        );
                        if (updatedPath.length >= 2) {
                          handleUpdate({ path: updatedPath });
                        }
                      }}
                      className="text-red-400 hover:text-red-200 text-sm font-bold cursor-pointer ml-1"
                    >
                      ✕
                    </button>
                  ) : (
                    <span className="text-green-400 text-sm ml-1">✓</span>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const last =
                  selectedPerson.path[selectedPerson.path.length - 1];
                const newPath = [
                  ...selectedPerson.path,
                  { x: last.x + 50, y: last.y },
                ];
                handleUpdate({ path: newPath });
              }}
              className="text-blue-400 hover:text-blue-300 text-sm mt-1 text-left cursor-pointer"
            >
              + Add Path Point
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-1 bg-red-600 hover:bg-red-500 hover:brightness-80 text-white rounded-lg cursor-pointer"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedId(null)}
              className="flex-1 px-4 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded-lg cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
