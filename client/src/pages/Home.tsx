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

  const [isZoomed, setIsZoomed] = useState(false);
  const [lastClickPosition, setLastClickPosition] = useState<{ x: number; y: number } | null>(null);

  const handleGridDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - svgRect.left;
    const clickY = e.clientY - svgRect.top;

    const cellCol = Math.floor(clickX / CELL_SIZE);
    const cellRow = Math.floor(clickY / CELL_SIZE);

    if (!isZoomed) {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const zoomAreaWidth = screenWidth * 0.75;
      const zoomAreaHeight = screenHeight * 0.75;

      const scaleX = zoomAreaWidth / CELL_SIZE;
      const scaleY = zoomAreaHeight / CELL_SIZE;
      const scale = Math.min(scaleX, scaleY);

      const targetX = cellCol * CELL_SIZE + CELL_SIZE / 2;
      const targetY = cellRow * CELL_SIZE + CELL_SIZE / 2;

      const gridOffsetX = (screenWidth - GRID_WIDTH * CELL_SIZE) / 4;
      const offsetX = gridOffsetX - (GRID_WIDTH * CELL_SIZE) / 2 - targetX * scale;

      const gridOffsetY = (screenHeight - GRID_HEIGHT * CELL_SIZE) / 2;
    const offsetY = gridOffsetY + (GRID_HEIGHT * CELL_SIZE) / 3.5 - targetY * scale;


      setViewTransform({ x: offsetX, y: offsetY, scale });
      setLastClickPosition({ x: cellCol, y: cellRow });
      setIsZoomed(true);
    } else {
      setViewTransform({ x: 0, y: 0, scale: 1 });
      setIsZoomed(false);
      setLastClickPosition(null);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div
        className="relative"
        style={{ width: GRID_WIDTH * CELL_SIZE, height: GRID_HEIGHT * CELL_SIZE }}
      >
        <svg
          width={GRID_WIDTH * CELL_SIZE}
          height={GRID_HEIGHT * CELL_SIZE}
          className="absolute top-0 left-0"
          onDoubleClick={handleGridDoubleClick}
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
