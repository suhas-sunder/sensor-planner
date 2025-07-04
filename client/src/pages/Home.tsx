import { useState } from "react";

const GRID_WIDTH = 5;
const GRID_HEIGHT = 10;
const CELL_SIZE = 100; // in pixels

export default function Home() {
 const [viewTransform, setViewTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });

  const [selectedCell, setSelectedCell] = useState<{ col: number; row: number } | null>(null);

  const handleCellClick = (col: number, row: number) => {
    if (selectedCell?.col === col && selectedCell?.row === row) {
      // Already selected: toggle zoom out
      setViewTransform({ x: 0, y: 0, scale: 10 });
      setSelectedCell(null);
    } else {
      // Zoom into new cell
      const scale = 2;
      const targetX = col * CELL_SIZE + CELL_SIZE / 2;
      const targetY = row * CELL_SIZE + CELL_SIZE / 2;

      const svgWidth = GRID_WIDTH * CELL_SIZE;
      const svgHeight = GRID_HEIGHT * CELL_SIZE;

      const centerX = svgWidth / 2;
      const centerY = svgHeight / 2;

      setViewTransform({
        scale,
        x: centerX - targetX * scale,
        y: centerY - targetY * scale,
      });
      setSelectedCell({ col, row });
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="relative" style={{ width: GRID_WIDTH * CELL_SIZE, height: GRID_HEIGHT * CELL_SIZE }}>
        <svg
          width={GRID_WIDTH * CELL_SIZE}
          height={GRID_HEIGHT * CELL_SIZE}
          className="absolute top-0 left-0"
          style={{
            transform: `translate(${viewTransform.x}px, ${viewTransform.y}px) scale(${viewTransform.scale})`,
            transformOrigin: "top left",
            transition: "transform 0.5s ease",
          }}
        >
          {/* Grid Cells */}
          {[...Array(GRID_HEIGHT)].map((_, row) =>
            [...Array(GRID_WIDTH)].map((_, col) => (
              <rect
                key={`cell-${col}-${row}`}
                x={col * CELL_SIZE}
                y={row * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill="white"
                stroke="gray"
                onClick={() => handleCellClick(col, row)}
                className="cursor-pointer"
              />
            ))
          )}

          {/* Overlapping Colored Shapes */}
          <circle cx={130} cy={100} r={40} fill="rgba(255,0,0,0.6)" />
          <circle cx={30} cy={100} r={40} fill="rgba(255,0,0,0.6)" />
          <circle cx={130} cy={50} r={40} fill="rgba(255,0,0,0.6)" />
        </svg>
      </div>
    </div>
  );
}