import type { Sensor, Person, SimulationEvent } from "../other/Types";

const defaultSensorRadius = 150;

type DetectionLog = {
  sensorId: string;
  personId: string;
  startTime: string;
  endTime?: string;
};

let activeDetections: Record<string, DetectionLog> = {};

/**
 * Detects motion between people and sensors and triggers event logging via callback.
 */
export default function DetectMotion(
  sensors: Sensor[],
  people: Person[],
  addEvent: (event: Omit<SimulationEvent, "id" | "timestamp">) => void
): void {
  const now = new Date();
  const newActiveDetections: Record<string, DetectionLog> = {};

  for (const sensor of sensors) {
    if (sensor.type !== "motion" && sensor.type !== "presence") continue;

    const radius = sensor.sensor_rad ?? defaultSensorRadius;

    for (const person of people) {
      if (sensor.floor !== person.floor) continue;

      if (
        person.path.length < 2 ||
        person.currentIndex < 0 ||
        person.currentIndex >= person.path.length
      )
        continue;

      const nextIndex = person.currentIndex + person.direction;
      const reachedEnd = nextIndex < 0 || nextIndex >= person.path.length;

      const start = person.path[person.currentIndex];
      const end =
        person.path[
          reachedEnd ? person.currentIndex - person.direction : nextIndex
        ];

      const x = start.x + (end.x - start.x) * (person.progress ?? 0);
      const y = start.y + (end.y - start.y) * (person.progress ?? 0);

      const dx = sensor.x - x;
      const dy = sensor.y - y;
      const distance = Math.hypot(dx, dy);

      const isInside = distance <= radius;
      const key = `${sensor.id}-${person.id}`;

      if (isInside) {
        if (!activeDetections[key]) {
          const message = `Motion START near "${sensor.name}" by "${person.name}"`;

          addEvent({
            nodeId: sensor.id,
            nodeType: "sensor",
            floor: sensor.floor,
            eventType: "motion",
            message,
          });

          activeDetections[key] = {
            sensorId: sensor.id,
            personId: person.id,
            startTime: now.toISOString(),
          };
        }

        newActiveDetections[key] = activeDetections[key];
      } else {
        if (activeDetections[key]) {
          const message = `Motion END near "${sensor.name}" from "${person.name}"`;

          addEvent({
            nodeId: sensor.id,
            nodeType: "sensor",
            floor: sensor.floor,
            eventType: "motion",
            message,
          });
        }
      }
    }
  }

  activeDetections = newActiveDetections;
}
