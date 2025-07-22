import type { Room } from "../other/Types";

// Function to draw a room with walls
export default function DrawRoomWithWalls(
  ctx: CanvasRenderingContext2D,
  room: Room,
  viewport: { x: number; y: number },
  wallThickness = 3
) {
  const screenX = room.x - viewport.x;
  const screenY = room.y - viewport.y;

  ctx.save();

  const walls = {
    top: { x: screenX, y: screenY, w: room.width, h: wallThickness },
    bottom: {
      x: screenX,
      y: screenY + room.height - wallThickness,
      w: room.width,
      h: wallThickness,
    },
    left: { x: screenX, y: screenY, w: wallThickness, h: room.height },
    right: {
      x: screenX + room.width - wallThickness,
      y: screenY,
      w: wallThickness,
      h: room.height,
    },
  };

  // Draw all walls
  ctx.fillStyle = "#020617";
  for (const wall of Object.values(walls)) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  }

  // Draw doors (as white sections)
  room.doors?.forEach(({ side, offset, length = 30 }) => {
    const wall = walls[side];
    ctx.fillStyle = "#ffffff";
    if (side === "top" || side === "bottom") {
      ctx.fillRect(wall.x + offset, wall.y, length, wall.h);
    } else {
      ctx.fillRect(wall.x, wall.y + offset, wall.w, length);
    }

    // Draw small brown rectangle to indicate door
    // ctx.fillStyle = "#654321";
    // if (side === "top" || side === "bottom") {
    //   ctx.fillRect(wall.x + offset, wall.y, 8, wall.h);
    // } else {
    //   ctx.fillRect(wall.x, wall.y + offset, wall.w, 8);
    // }
  });

  // Draw windows (as light blue segments)
  room.windows?.forEach(({ side, offset, length = 30 }) => {
    const wall = walls[side];
    ctx.fillStyle = "#66ccff";
    if (side === "top" || side === "bottom") {
      ctx.fillRect(wall.x + offset, wall.y, length, 4);
    } else {
      ctx.fillRect(wall.x, wall.y + offset, 4, length);
    }
  });

  // Room label
  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#020617";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(room.name, screenX + room.width / 2, screenY + room.height / 2);

  ctx.restore();
}
