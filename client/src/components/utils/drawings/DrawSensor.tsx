import type { Sensor } from "../other/Types";

export default function DrawSensor(
  ctx: CanvasRenderingContext2D,
  Sensor: Sensor,
  isSelected: boolean,
  viewport: { x: number; y: number },
  pulsePhase: number
): void {
  const screenX = Sensor.x - viewport.x;
  const screenY = Sensor.y - viewport.y;
  const minRadius = 0.1;
  const screenFillYOffset = 25;
  const sensorCenterDotRad = 5;
  const phaseOffset = 0.5;
  const phaseWrap = 1;

  const fontSettings = "10px Arial";
  const fontColor = "#000";
  const selectedColor = "#4338ca";
  const idleCenterDotColor = "#0f172a"; // always this unless selected

  // Determine connection/interference status
  const hasInterference =
    Array.isArray(Sensor.interferenceIds) && Sensor.interferenceIds.length > 0;
  const isConnected =
    Array.isArray(Sensor.connectedDeviceIds) &&
    Sensor.connectedDeviceIds.length > 0;

  // Outer area fill and ring color logic
  let pulseColor = "rgba(0, 123, 255, 0.2)";
  let fillColor = "rgba(0, 123, 255, 0.15)"; // default blue

  if (hasInterference) {
    pulseColor = "rgba(185, 28, 28, 0.2)"; // red
    fillColor = "rgba(185, 28, 28, 0.15)";
  } else if (isConnected) {
    pulseColor = "rgba(14, 165, 233, 0.2)"; // blue
    fillColor = "rgba(14, 165, 233, 0.15)";
  }

  const maxRadius = Math.max(minRadius, Sensor.sensor_rad || 30);
  const animatedRadius = Math.max(minRadius, pulsePhase * maxRadius);
  const secondaryRadius = Math.max(
    minRadius,
    ((pulsePhase + phaseOffset) % phaseWrap) * maxRadius
  );

  // Pulsing ring effect
  ctx.beginPath();
  ctx.strokeStyle = pulseColor;
  ctx.lineWidth = 2;
  ctx.arc(screenX, screenY, animatedRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.strokeStyle = pulseColor;
  ctx.lineWidth = 1;
  ctx.arc(screenX, screenY, secondaryRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  // Static transparent sensor area
  ctx.beginPath();
  ctx.fillStyle = fillColor;
  ctx.arc(screenX, screenY, maxRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  // Main center dot (only changes on selection)
  ctx.beginPath();
  ctx.fillStyle = isSelected ? selectedColor : idleCenterDotColor;
  ctx.arc(screenX, screenY, sensorCenterDotRad, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  // Sensor label
  ctx.font = fontSettings;
  ctx.fillStyle = fontColor;
  const text = Sensor.name;
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(text, screenX - textWidth / 2, screenY + screenFillYOffset);
}
