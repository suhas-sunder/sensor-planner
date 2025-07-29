import type { Device } from "../other/Types";

export default function DrawDevice(
  ctx: CanvasRenderingContext2D,
  device: Device,
  isSelected: boolean,
  viewport: { x: number; y: number },
  pulsePhase: number
): void {
  const screenX = device.x - viewport.x;
  const screenY = device.y - viewport.y;
  const screenFillYOffset = 25;

  const baseRadius = device.device_rad || 30;
  const sideLength = Math.max(10, baseRadius * 2);
  const innerSize = 10;

  const fontSettings = "10px Arial";
  const fontColor = "#000";

  const innerColor = "#0f172a";
  const selectedColor = "#4338ca";

  // Color ranges
  const greenStart = [80, 200, 30];
  const greenEnd = [140, 255, 90];

  const redStart = [200, 50, 50];
  const redEnd = [255, 100, 100];

  const alphaMin = 0.25;
  const alphaAmplitude = 0.1;
  const alphaOscillationSpeed = 20 * Math.PI;

  const hasInterference =
    Array.isArray(device.interferenceIds) && device.interferenceIds.length > 0;
  const isConnected =
    Array.isArray(device.connectedSensorIds) &&
    device.connectedSensorIds.length > 0;

  let pulseColor = "rgba(0,0,0,0.05)";

  if (hasInterference) {
    const interp = pulsePhase;
    const [r, g, b] = [
      Math.floor(redStart[0] + (redEnd[0] - redStart[0]) * interp),
      Math.floor(redStart[1] + (redEnd[1] - redStart[1]) * interp),
      Math.floor(redStart[2] + (redEnd[2] - redStart[2]) * interp),
    ];
    const alpha =
      alphaMin + alphaAmplitude * Math.sin(pulsePhase * alphaOscillationSpeed);
    pulseColor = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
  } else if (isConnected) {
    pulseColor = "rgba(14, 165, 233, 0.15)"; // blue
  } else {
    // Default green pulse
    const interp = pulsePhase;
    const [r, g, b] = [
      Math.floor(greenStart[0] + (greenEnd[0] - greenStart[0]) * interp),
      Math.floor(greenStart[1] + (greenEnd[1] - greenStart[1]) * interp),
      Math.floor(greenStart[2] + (greenEnd[2] - greenStart[2]) * interp),
    ];
    const alpha =
      alphaMin + alphaAmplitude * Math.sin(pulsePhase * alphaOscillationSpeed);
    pulseColor = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
  }

  // Outer pulse
  ctx.beginPath();
  ctx.fillStyle = pulseColor;
  drawRoundedSquare(ctx, screenX, screenY, sideLength, 4);
  ctx.fill();
  ctx.closePath();

  // Inner square
  ctx.beginPath();
  ctx.fillStyle = isSelected ? selectedColor : innerColor;
  drawRoundedSquare(ctx, screenX, screenY, innerSize, 2);
  ctx.fill();
  ctx.closePath();

  // Label
  ctx.font = fontSettings;
  ctx.fillStyle = fontColor;
  const text = device.name;
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
