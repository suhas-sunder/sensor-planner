import type { Device } from "../other/Types";

export default function DrawDevice(
  ctx: CanvasRenderingContext2D,
  Device: Device,
  isSelected: boolean,
  viewport: { x: number; y: number },
  pulsePhase: number
): void {
  const screenX = Device.x - viewport.x;
  const screenY = Device.y - viewport.y;
  const screenFillYOffset = 25;

  const baseRadius = Device.device_rad || 30;
  const sideLength = Math.max(10, baseRadius * 2);

  const innerSize = 10;
  const innerColor = "#053b01ff"; // dark green
  const selectedColor = "#ff0000ff";
  const borderColor = isSelected ? selectedColor : "#222";

  const fontSettings = "10px Arial";
  const fontColor = "#000";

  // Green pulse range (visible effect)
  const greenStart = [80, 200, 30]; // medium green
  const greenEnd = [140, 255, 90]; // light green

  // Use pulsePhase directly for smooth bounce
  const interp = pulsePhase;

  const r = Math.floor(greenStart[0] + (greenEnd[0] - greenStart[0]) * interp);
  const g = Math.floor(greenStart[1] + (greenEnd[1] - greenStart[1]) * interp);
  const b = Math.floor(greenStart[2] + (greenEnd[2] - greenStart[2]) * interp);
  const alpha = 0.25 + 0.1 * Math.sin(pulsePhase * 20 * Math.PI); // subtle oscillation in opacity

  const pulseColor = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;

  // Outer rounded square (visible pulse)
  ctx.beginPath();
  ctx.fillStyle = pulseColor;
  drawRoundedSquare(ctx, screenX, screenY, sideLength, 4); // smaller corner radius
  ctx.fill();
  ctx.closePath();

  // Inner square
  ctx.beginPath();
  ctx.fillStyle = innerColor;
  drawRoundedSquare(ctx, screenX, screenY, innerSize, 2);
  ctx.fill();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.closePath();

  // Label
  ctx.font = fontSettings;
  ctx.fillStyle = fontColor;
  const text = Device.name;
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(text, screenX - textWidth / 2, screenY + screenFillYOffset);
}

// Helper: centered rounded square
function drawRoundedSquare(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  radius: number
) {
  const x = cx - size / 2;
  const y = cy - size / 2;
  const r = Math.min(radius, size / 2);

  ctx.moveTo(x + r, y);
  ctx.lineTo(x + size - r, y);
  ctx.quadraticCurveTo(x + size, y, x + size, y + r);
  ctx.lineTo(x + size, y + size - r);
  ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
  ctx.lineTo(x + r, y + size);
  ctx.quadraticCurveTo(x, y + size, x, y + size - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}
