export default function DrawOriginMarker(
  ctx: CanvasRenderingContext2D,
  viewport: { x: number; y: number }
) {
  const originX = 0 - viewport.x;
  const originY = 0 - viewport.y;

  // Draw crosshair
  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(originX - 5, originY);
  ctx.lineTo(originX + 5, originY);
  ctx.moveTo(originX, originY - 5);
  ctx.lineTo(originX, originY + 5);
  ctx.stroke();

  // Draw label
  ctx.fillStyle = "red";
  ctx.font = "12px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Origin (0m, 0m)", originX - 120, originY - 6);
}
