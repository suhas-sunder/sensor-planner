import { useMemo, useState } from "react";

const GRID_WIDTH = 5;
const GRID_HEIGHT = 10;
const CELL_SIZE = 100;
const TOTAL_WIDTH = GRID_WIDTH * CELL_SIZE;

export default function Grid() {
  // Generate a 2D array of width ratios for each cell
  const cellWidthRatios = useMemo(
    () =>
      Array.from({ length: GRID_HEIGHT }, () =>
        Array.from({ length: GRID_WIDTH }, () => 0.8 + Math.random() * 0.6) // range 0.8–1.4
      ),
    []
  );

  // Normalize ratios per row so each sums to TOTAL_WIDTH
  const visualCellWidths = useMemo(() => {
    return cellWidthRatios.map((row) => {
      const sum = row.reduce((a, b) => a + b, 0);
      return row.map((r) => (r / sum) * TOTAL_WIDTH);
    });
  }, [cellWidthRatios]);

  const [viewTransform, setViewTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [_lastClickPosition, setLastClickPosition] = useState<{ x: number; y: number } | null>(null);

  const handleGridDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - svgRect.left;
    const clickY = e.clientY - svgRect.top;

    const cellCol = Math.floor(clickX / CELL_SIZE); // Logical column index
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
      <div className="relative" style={{ width: TOTAL_WIDTH, height: GRID_HEIGHT * CELL_SIZE }}>
        <svg
          width={TOTAL_WIDTH}
          height={GRID_HEIGHT * CELL_SIZE}
          onDoubleClick={handleGridDoubleClick}
          className="absolute top-0 left-0"
          style={{
            transform: `translate(${viewTransform.x}px, ${viewTransform.y}px) scale(${viewTransform.scale})`,
            transformOrigin: "top left",
            transition: "transform 0.5s ease",
          }}
        >
          {/* Grid Cells */}
          {visualCellWidths.map((rowWidths, row) => {
            let x = 0;
            return rowWidths.map((width, col) => {
              const rect = (
                <rect
                  key={`cell-${col}-${row}`}
                  x={x}
                  y={row * CELL_SIZE}
                  width={width}
                  height={CELL_SIZE}
                  fill="white"
                  stroke="gray"
                  className="cursor-pointer"
                />
              );
              x += width;
              return rect;
            });
          })}

          {/* Overlapping Colored Shapes */}
          <circle cx={130} cy={100} r={40} fill="rgba(255,0,0,0.6)" />
          <circle cx={30} cy={100} r={40} fill="rgba(255,0,0,0.6)" />
          <circle cx={130} cy={50} r={40} fill="rgba(255,0,0,0.6)" />
        </svg>
      </div>
    </div>
  );
}
