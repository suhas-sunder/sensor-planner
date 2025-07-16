import { useMemo, useState } from "react";

const GRID_WIDTH = 5;
const GRID_HEIGHT = 10;
const CELL_SIZE = 100;
const TOTAL_WIDTH = GRID_WIDTH * CELL_SIZE;

export default function Home() {
  const cellWidthRatios = useMemo(
    () =>
      Array.from({ length: GRID_HEIGHT }, () =>
        Array.from({ length: GRID_WIDTH }, () => 0.8 + Math.random() * 0.6)
      ),
    []
  );

  const visualCellWidths = useMemo(() => {
    return cellWidthRatios.map((row) => {
      const sum = row.reduce((a, b) => a + b, 0);
      return row.map((r) => (r / sum) * TOTAL_WIDTH);
    });
  }, [cellWidthRatios]);

  const [circles, setCircles] = useState([
    { id: 1, name: "Circle 1", cx: 130, cy: 100, r: 40, fill: "rgba(255,0,0,0.6)" },
    { id: 2, name: "Circle 2", cx: 30, cy: 100, r: 40, fill: "rgba(255,0,0,0.6)" },
    { id: 3, name: "Circle 3", cx: 130, cy: 50, r: 40, fill: "rgba(255,0,0,0.6)" }
  ]);
  const [squares, setSquares] = useState([
    { id: 1, name: "Square 1", x: 200, y: 120, size: 20, fill: "rgba(0,200,255,0.6)" },
    { id: 2, name: "Square 2", x: 60, y: 300, size: 20, fill: "rgba(0,200,255,0.6)" }
  ]);

  const [draggedCircleId, setDraggedCircleId] = useState<number | null>(null);
  const [draggedSquareId, setDraggedSquareId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [viewTransform, setViewTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - svg.left;
    const mouseY = e.clientY - svg.top;

    const transformedX = (mouseX - viewTransform.x) / viewTransform.scale;
    const transformedY = (mouseY - viewTransform.y) / viewTransform.scale;
    const newX = transformedX - dragOffset.x;
    const newY = transformedY - dragOffset.y;

    if (draggedCircleId !== null) {
      const updated = circles.map((circle) =>
        circle.id === draggedCircleId ? { ...circle, cx: newX, cy: newY } : circle
      );
      setCircles(updated);
      checkOverlaps(squares, updated);
    }

    if (draggedSquareId !== null) {
      const updated = squares.map((sq) =>
        sq.id === draggedSquareId ? { ...sq, x: newX, y: newY } : sq
      );
      setSquares(updated);
      checkOverlaps(updated, circles);
    }
  };

  const handleMouseUp = () => {
    setDraggedCircleId(null);
    setDraggedSquareId(null);
  };

  const handleCircleMouseDown = (
    e: React.MouseEvent<SVGCircleElement>,
    id: number
  ) => {
    const svgRect = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    const circle = circles.find((c) => c.id === id);
    if (!circle) return;

    const transformedX = (mouseX - viewTransform.x) / viewTransform.scale;
    const transformedY = (mouseY - viewTransform.y) / viewTransform.scale;

    setDragOffset({
      x: transformedX - circle.cx,
      y: transformedY - circle.cy
    });
    setDraggedCircleId(id);
  };

  const handleSquareMouseDown = (
    e: React.MouseEvent<SVGRectElement>,
    id: number
  ) => {
    const svgRect = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    const square = squares.find((s) => s.id === id);
    if (!square) return;

    const transformedX = (mouseX - viewTransform.x) / viewTransform.scale;
    const transformedY = (mouseY - viewTransform.y) / viewTransform.scale;

    setDragOffset({
      x: transformedX - square.x,
      y: transformedY - square.y
    });
    setDraggedSquareId(id);
  };

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
      setIsZoomed(true);
    } else {
      setViewTransform({ x: 0, y: 0, scale: 1 });
      setIsZoomed(false);
    }
  };

  function checkOverlaps(
    squares: typeof squares,
    circles: typeof circles
  ) {
    const overlaps: { square: string; circle: string }[] = [];

    for (const sq of squares) {
      const { x, y, size, name: squareName } = sq;
      const half = size / 2;

      for (const c of circles) {
        const dx = Math.max(Math.abs(c.cx - x) - half, 0);
        const dy = Math.max(Math.abs(c.cy - y) - half, 0);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < c.r) {
          overlaps.push({ square: squareName, circle: c.name });
        }
      }
    }

    if (overlaps.length) {
      console.log("🟦⭕ Touching shapes:");
      overlaps.forEach(({ square, circle }) =>
        console.log(`🔹 ${square} overlaps with ${circle}`)
      );
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="relative" style={{ width: TOTAL_WIDTH, height: GRID_HEIGHT * CELL_SIZE }}>
        <svg
          width={TOTAL_WIDTH}
          height={GRID_HEIGHT * CELL_SIZE}
          onDoubleClick={handleGridDoubleClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="absolute top-0 left-0"
          style={{
            transform: `translate(${viewTransform.x}px, ${viewTransform.y}px) scale(${viewTransform.scale})`,
            transformOrigin: "top left",
            transition: "transform 0.5s ease"
          }}
        >
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
                />
              );
              x += width;
              return rect;
            });
          })}
          {circles.map(({ id, cx, cy, r, fill }) => (
            <circle
              key={id}
              cx={cx}
              cy={cy}
              r={r}
              fill={fill}
              onMouseDown={(e) => handleCircleMouseDown(e, id)}
              className="cursor-grab"
            />
          ))}

          {/* Squares */}
          {squares.map(({ id, x, y, size, fill }) => (
            <rect
              key={`square-${id}`}
              x={x - size / 2}
              y={y - size / 2}
              width={size}
              height={size}
              fill={fill}
              onMouseDown={(e) => handleSquareMouseDown(e, id)}
              className="cursor-grab"
            />
          ))}

        </svg>
      </div>
    </div>
  );
}
