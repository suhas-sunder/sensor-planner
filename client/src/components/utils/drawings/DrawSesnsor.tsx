import type { Sensor } from "../other/Types";

// Function to draw a Sensor on the canvas
export default function DrawSensor(
  ctx: CanvasRenderingContext2D,
  Sensor: Sensor,
  isSelected: boolean,
  viewport: { x: number; y: number },
  pulsePhase: number // ← NEW
): void {
  const screenX = Sensor.x - viewport.x;
  const screenY = Sensor.y - viewport.y;

  const maxRadius = Sensor.sensor_rad || 30;
  const animatedRadius = pulsePhase * maxRadius;

  // Pulsing ring effect
  ctx.beginPath();
  ctx.strokeStyle = "rgba(0, 123, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.arc(screenX, screenY, animatedRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  const secondaryRadius = ((pulsePhase + 0.5) % 1) * maxRadius;
  ctx.beginPath();
  ctx.strokeStyle = "rgba(0, 123, 255, 0.2)";
  ctx.lineWidth = 1;
  ctx.arc(screenX, screenY, secondaryRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  // Static transparent sensor area
  ctx.beginPath();
  ctx.fillStyle = "rgba(0, 123, 255, 0.15)";
  ctx.arc(screenX, screenY, maxRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  // Main circle
  ctx.beginPath();
  ctx.fillStyle = isSelected ? "#ff0000ff" : "#333";
  ctx.arc(screenX, screenY, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  // 🏷 Sensor label
  ctx.font = "10px Arial";
  ctx.fillStyle = "#000";
  const text = Sensor.name;
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(text, screenX - textWidth / 2, screenY + 25);
}
