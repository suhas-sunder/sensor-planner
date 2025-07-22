import { Line, IText, type Canvas } from "fabric";

export default function DrawOriginMarker(
  canvas: Canvas,
  viewport: { x: number; y: number }
) {
  const originX = -viewport.x;
  const originY = -viewport.y;

  // Crosshair lines (horizontal and vertical)
  const crosshairLines = [
    new Line([originX - 5, originY, originX + 5, originY], {
      stroke: "red",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    }),
    new Line([originX, originY - 5, originX, originY + 5], {
      stroke: "red",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    }),
  ];

  crosshairLines.forEach((line) => canvas.add(line));

  // Label text: "Origin (0m, 0m)"
  const label = new IText("Origin (0m, 0m)", {
    left: originX - 120,
    top: originY - 6,
    fontSize: 12,
    fontFamily: "monospace",
    fill: "red",
    selectable: false,
    evented: false,
    originX: "left",
    originY: "top",
  });

  canvas.add(label);
}
