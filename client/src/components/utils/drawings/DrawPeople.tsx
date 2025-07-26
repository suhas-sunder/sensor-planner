import type { Person } from "../other/Types";

export default function DrawPeople(
  ctx: CanvasRenderingContext2D,
  person: Person,
  viewport: { x: number; y: number }
) {
  const {
    path,
    currentIndex,
    direction,
    progress = 0,
    color = "#FF1493", // fallback color
    name = "",
  } = person;

  // --- Guard: Must have at least 2 points to draw/animate ---
  if (!Array.isArray(path) || path.length < 2) return;

  const nextIndex = currentIndex + direction;
  const reachedEnd = nextIndex < 0 || nextIndex >= path.length;

  const start = path[currentIndex];
  const end = path[reachedEnd ? currentIndex - direction : nextIndex];

  // --- Guard: Defensive check for missing points ---
  if (!start || !end) return;

  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const x = start.x + dx * progress - viewport.x;
  const y = start.y + dy * progress - viewport.y;

  // --- Draw person square ---
  ctx.fillStyle = color;
  ctx.fillRect(x - 4, y - 4, 8, 8);

  // --- Draw label ---
  if (name) {
    ctx.font = "12px sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(name, x, y - 6);
  }

  // --- Draw dotted path ---
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  for (let i = 0; i < path.length - 1; i++) {
    const s = path[i];
    const e = path[i + 1];

    if (!s || !e) continue;

    ctx.moveTo(s.x - viewport.x, s.y - viewport.y);
    ctx.lineTo(e.x - viewport.x, e.y - viewport.y);
  }

  ctx.stroke();
  ctx.setLineDash([]);
}
