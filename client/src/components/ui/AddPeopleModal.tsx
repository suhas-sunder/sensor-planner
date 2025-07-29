import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSensorDeviceContext } from "../hooks/useSensorDeviceContext";
import type { Person } from "../utils/other/Types";
import { useParams } from "react-router-dom";
import useEventsContext from "../hooks/useEventsContext";

export default function AddPeopleModal({
  setShowPeopleModal,
}: {
  setShowPeopleModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { floorId } = useParams();
  const currentFloor = Number(floorId) || 1;

  const { setPeople } = useSensorDeviceContext();
  const { addEvent } = useEventsContext();

  const [name, setName] = useState(`Person - ${uuidv4().slice(0, 8)}`);
  const [speed, setSpeed] = useState(100);
  const [color, setColor] = useState("#FF1493"); // Hex code for deeppink

  const [pathPoints, setPathPoints] = useState([
    { x: 100, y: 100 },
    { x: 400, y: 100 },
  ]);

  const handlePositionChange = (
    index: number,
    axis: "x" | "y",
    value: number
  ) => {
    // Update the specific point's x or y value
    setPathPoints((prev) =>
      prev.map((points, i) =>
        i === index ? { ...points, [axis]: value } : points
      )
    );
  };

  const handleAddPoint = () => {
    const last = pathPoints[pathPoints.length - 1];
    setPathPoints([...pathPoints, { x: last.x + 50, y: last.y }]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pathPoints.length < 2) return;
    const first = pathPoints[0];
    const second = pathPoints[1];
    if (first.x === second.x && first.y === second.y) {
      alert("First two path points must be different for animation to work.");
      return;
    }

    setShowPeopleModal(false);

    const newPerson: Person = {
      id: `person-${uuidv4()}`,
      name,
      floor: currentFloor,
      path: pathPoints,
      currentIndex: 0,
      direction: 1,
      animationSpeed: speed,
      color,
    };

    setPeople((prev: Person[]) => [...prev, newPerson]);

    addEvent({
      nodeId: newPerson.id,
      nodeType: "person",
      eventType: "motion",
      floor: currentFloor,
      message: `New animated person added: "${newPerson.name}" with speed "${newPerson.animationSpeed}px/sec"`,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <button
        type="button"
        onClick={() => setShowPeopleModal(false)}
        className="absolute inset-0 bg-slate-900 opacity-10 pointer-events-auto cursor-pointer"
      />
      <div className="flex flex-col gap-3 relative min-w-1/4 bg-white text-black p-6 rounded-lg shadow-md z-10 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-700">
          Add Animated Person
        </h2>

        {/* Name */}
        <div className="flex flex-col gap-2 mb-3 w-full">
          <label htmlFor="person-name" className="font-bold text-slate-700">
            Name
          </label>
          <input
            id="person-name"
            name="person_name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-slate-500 p-2 rounded-md"
          />
        </div>

        {/* Path Points */}
        <div className="flex flex-col gap-3 mb-3 w-full">
          <label className="font-bold text-slate-700">Path Points</label>
          {pathPoints.map((pt, idx) => (
            <div className="flex gap-4 items-center" key={idx}>
              <div className="flex flex-col gap-1 w-1/2">
                <label className="text-sm text-slate-600">X</label>
                <input
                  type="number"
                  value={pt.x}
                  onChange={(e) =>
                    handlePositionChange(idx, "x", Number(e.target.value))
                  }
                  className="border-2 border-slate-500 p-1 rounded-md"
                />
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <label className="text-sm text-slate-600">Y</label>
                <input
                  type="number"
                  value={pt.y}
                  onChange={(e) =>
                    handlePositionChange(idx, "y", Number(e.target.value))
                  }
                  className="border-2 border-slate-500 p-1 rounded-md"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddPoint}
            className="text-blue-600 font-medium underline text-left hover:brightness-150 transition-transform cursor-pointer"
          >
            + Add Path Point
          </button>
        </div>

        {/* Speed */}
        <div className="flex flex-col gap-2 mb-3 w-full">
          <label htmlFor="speed" className="font-bold text-slate-700">
            Animation Speed (pixels/sec)
          </label>
          <input
            id="speed"
            name="speed"
            type="number"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="border-2 border-slate-500 p-2 rounded-md"
          />
        </div>

        {/* Color Picker with Manual Hex Input */}
        <div className="flex flex-col gap-2 mb-3 w-full">
          <label htmlFor="color" className="font-bold text-slate-700">
            Color
          </label>
          <div className="flex items-center gap-4 w-full">
            <input
              id="color"
              name="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 border-2 p-[0.16em] border-slate-500 rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only valid hex codes or partial hex values
                const isValidHex =
                  /^#([0-9A-Fa-f]{3}){1,2}$/.test(value) ||
                  /^#?[0-9A-Fa-f]{0,6}$/.test(value);

                if (isValidHex)
                  setColor(value.startsWith("#") ? value : `#${value}`);
              }}
              className="w-full border-2 border-slate-500 p-1 rounded-md font-mono"
              placeholder="#RRGGBB"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="text-white bg-blue-600 p-2 rounded-md font-bold hover:brightness-110 hover:scale-105 transition-transform cursor-pointer"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
