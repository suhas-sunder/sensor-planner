import { Rect, IText, type Canvas } from "fabric";
import type { Device } from "../other/Types";

export default function DrawDevice(
  canvas: Canvas,
  device: Device,
  isSelected: boolean,
  viewport: { x: number; y: number },
  pulsePhase: number
) {
  const screenX = device.x - viewport.x;
  const screenY = device.y - viewport.y;
  const baseRadius = device.device_rad || 30;
  const screenFillYOffset = 25;

  const sideLength = Math.max(10, baseRadius * 2);
  const innerSize = 10;

  const innerColor = "#053b01ff";
  const selectedColor = "#ff0000ff";
  const borderColor = isSelected ? selectedColor : "#222";
  const fontColor = "#000";

  // Pulsing green color
  const greenStart = [80, 200, 30];
  const greenEnd = [140, 255, 90];
  const interp = pulsePhase;
  const r = Math.floor(greenStart[0] + (greenEnd[0] - greenStart[0]) * interp);
  const g = Math.floor(greenStart[1] + (greenEnd[1] - greenStart[1]) * interp);
  const b = Math.floor(greenStart[2] + (greenEnd[2] - greenStart[2]) * interp);
  const alpha = 0.25 + 0.1 * Math.sin(pulsePhase * 20 * Math.PI);
  const pulseColor = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;

  // Outer square (pulsing)
  const pulseSquare = new Rect({
    left: screenX - sideLength / 2,
    top: screenY - sideLength / 2,
    width: sideLength,
    height: sideLength,
    rx: 4,
    ry: 4,
    fill: pulseColor,
    selectable: false,
    evented: false,
  });

  // Inner square (core device)
  const coreSquare = new Rect({
    left: screenX - innerSize / 2,
    top: screenY - innerSize / 2,
    width: innerSize,
    height: innerSize,
    rx: 2,
    ry: 2,
    fill: innerColor,
    stroke: borderColor,
    strokeWidth: 1,
    selectable: false,
    evented: false,
  });

  // Label
  const label = new IText(device.name, {
    left: screenX,
    top: screenY + screenFillYOffset,
    fontSize: 10,
    fontFamily: "Arial",
    fill: fontColor,
    originX: "center",
    originY: "top",
    selectable: false,
    evented: false,
  });

  canvas.add(pulseSquare, coreSquare, label);
}
