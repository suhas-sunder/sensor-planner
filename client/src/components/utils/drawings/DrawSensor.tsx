import { Circle, IText, type Canvas } from "fabric";
import type { Sensor } from "../other/Types";

export default function DrawSensor(
  canvas: Canvas,
  sensor: Sensor,
  isSelected: boolean,
  viewport: { x: number; y: number },
  pulsePhase: number,
  onSensorMove?: (id: string, newX: number, newY: number) => void
) {
  const screenX = sensor.x - viewport.x;
  const screenY = sensor.y - viewport.y;
  const baseRadius = sensor.sensor_rad || 30;
  const sensorCenterDotRad = 5;
  const offsetY = 25;

  // Pulsing rings (non-interactive)
  [pulsePhase, (pulsePhase + 0.5) % 1].forEach((p) => {
    canvas.add(
      new Circle({
        left: screenX,
        top: screenY,
        originX: "center",
        originY: "center",
        radius: Math.max(0.1, baseRadius * p),
        stroke: "rgba(0, 123, 255, 0.2)",
        strokeWidth: 1,
        fill: "",
        selectable: false,
        evented: false,
      })
    );
  });

  // Static transparent range
  canvas.add(
    new Circle({
      left: screenX,
      top: screenY,
      originX: "center",
      originY: "center",
      radius: baseRadius,
      fill: "rgba(0, 123, 255, 0.15)",
      selectable: false,
      evented: false,
    })
  );

  // Draggable center dot (this moves the sensor)
  const center = new Circle({
    left: screenX,
    top: screenY,
    originX: "center",
    originY: "center",
    radius: sensorCenterDotRad,
    fill: isSelected ? "#ff0000ff" : "#333",
    hasBorders: false,
    hasControls: false,
    selectable: true,
    evented: true,
  });

  center.on("moving", () => {
    const newX = center.left! + viewport.x;
    const newY = center.top! + viewport.y;
    onSensorMove?.(sensor.id, newX, newY);
  });

  canvas.add(center);

  // Label
  canvas.add(
    new IText(sensor.name, {
      left: screenX,
      top: screenY + offsetY,
      fontSize: 10,
      fill: "#000",
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
    })
  );
}
