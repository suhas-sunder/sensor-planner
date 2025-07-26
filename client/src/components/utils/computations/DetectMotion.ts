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

      const dx = sensor.x - person.currentPosition.x;
      const dy = sensor.y - person.currentPosition.y;
      const distance = Math.hypot(dx, dy);

      const isInside = distance <= radius;
      const key = `${sensor.id}-${person.id}`;

      if (isInside) {
        // Start or continue detection
        if (!activeDetections[key]) {
          console.log(
            `[MOTION START] Sensor: ${sensor.name}, Person: ${person.id}, Time: ${now}`
          );
          activeDetections[key] = {
            sensorId: sensor.id,
            personId: person.id,
            startTime: now,
          };
        }
        newActiveDetections[key] = activeDetections[key];
      } else {
        // Person moved out
        if (activeDetections[key]) {
          console.log(
            `[MOTION END] Sensor: ${sensor.name}, Person: ${person.id}, Time: ${now}`
          );
        }
      }
    }
  }

  activeDetections = newActiveDetections;
}
