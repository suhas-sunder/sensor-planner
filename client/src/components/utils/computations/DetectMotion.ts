// utils/computations/DetectMotion.ts
import type { Sensor, Person } from "../other/Types";

const defaultSensorRadius = 150;

type DetectionLog = {
  sensorId: string;
  personId: string;
  startTime: string;
  endTime?: string;
};

let activeDetections: Record<string, DetectionLog> = {};

export default function DetectMotion(
  sensors: Sensor[],
  people: Person[]
): void {
  const now = new Date().toISOString();
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
          console.log(
            `[MOTION START] Sensor: ${sensor.name}, Person: ${person.name}, Time: ${now}`
          );
          activeDetections[key] = {
            sensorId: sensor.id,
            personId: person.id,
            startTime: now,
          };
        }
        newActiveDetections[key] = activeDetections[key];
      } else {
        if (activeDetections[key]) {
          console.log(
            `[MOTION END] Sensor: ${sensor.name}, Person: ${person.name}, Time: ${now}`
          );
        }
      }
    }
  }

  activeDetections = newActiveDetections;
}
