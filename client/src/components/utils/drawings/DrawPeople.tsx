import type { Person } from "../other/Types";

export default function DrawPeople(
  ctx: CanvasRenderingContext2D,
  person: Person,
  viewport: { x: number; y: number }
) {
  const { currentPosition, path, blink, color = "hotpink" } = person;

  // Adjusted position based on viewport
  const x = currentPosition.x - viewport.x;
  const y = currentPosition.y - viewport.y;

  // Draw blinking person as square
  if (blink) {
    ctx.fillStyle = color;
    ctx.fillRect(x - 4, y - 4, 8, 8);
  }

  // Draw dotted path — one-way only
  if (path.length > 1) {
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    for (let i = 0; i < path.length - 1; i++) {
      const start = path[i];
      const end = path[i + 1];

      ctx.moveTo(start.x - viewport.x, start.y - viewport.y);
      ctx.lineTo(end.x - viewport.x, end.y - viewport.y);
    }

    ctx.stroke();
    ctx.setLineDash([]);
  }
}
