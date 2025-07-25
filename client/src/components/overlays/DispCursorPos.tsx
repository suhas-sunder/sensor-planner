import type { CursorPosition } from "../utils/other/Types";

export default function DispCursorPos({
  cursorPosition,
}: CursorPosition) {
  return (
    <>
      {cursorPosition && (
        <div className="absolute top-4 right-4 bg-white text-sm px-2 py-1 border rounded shadow z-50 pointer-events-none">
          <span>Cursor Position:</span>
          <span>
            {" "}
            X: {cursorPosition.x}, Y: {cursorPosition.y}
          </span>
        </div>
      )}
    </>
  );
}
