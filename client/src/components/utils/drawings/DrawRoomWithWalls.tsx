import { Rect, IText, type Canvas } from "fabric";
import type { Room } from "../other/Types";

export default function DrawRoomWithWalls(
  canvas: Canvas,
  room: Room,
  viewport: { x: number; y: number },
  wallThickness = 3
) {
  const screenX = room.x - viewport.x;
  const screenY = room.y - viewport.y;
  const wallColor = "#020617";
  const doorColor = "#ffffff";
  const windowColor = "#66ccff";

  const walls = {
    top: {
      left: screenX,
      top: screenY,
      width: room.width,
      height: wallThickness,
    },
    bottom: {
      left: screenX,
      top: screenY + room.height - wallThickness,
      width: room.width,
      height: wallThickness,
    },
    left: {
      left: screenX,
      top: screenY,
      width: wallThickness,
      height: room.height,
    },
    right: {
      left: screenX + room.width - wallThickness,
      top: screenY,
      width: wallThickness,
      height: room.height,
    },
  };

  // Draw walls
  Object.values(walls).forEach((wall) => {
    canvas.add(
      new Rect({
        ...wall,
        fill: wallColor,
        selectable: false,
        evented: false,
      })
    );
  });

  // Draw doors
  room.doors?.forEach(({ side, offset, length = 30 }) => {
    const wall = walls[side];
    const doorRect =
      side === "top" || side === "bottom"
        ? {
            left: wall.left + offset,
            top: wall.top,
            width: length,
            height: wall.height,
          }
        : {
            left: wall.left,
            top: wall.top + offset,
            width: wall.width,
            height: length,
          };

    canvas.add(
      new Rect({
        ...doorRect,
        fill: doorColor,
        selectable: false,
        evented: false,
      })
    );
  });

  // Draw windows
  room.windows?.forEach(({ side, offset, length = 30 }) => {
    const wall = walls[side];
    const windowRect =
      side === "top" || side === "bottom"
        ? {
            left: wall.left + offset,
            top: wall.top,
            width: length,
            height: 4,
          }
        : {
            left: wall.left,
            top: wall.top + offset,
            width: 4,
            height: length,
          };

    canvas.add(
      new Rect({
        ...windowRect,
        fill: windowColor,
        selectable: false,
        evented: false,
      })
    );
  });

  // Draw room label
  const label = new IText(room.name, {
    left: screenX + room.width / 2,
    top: screenY + room.height / 2,
    fontSize: 14,
    fontFamily: "sans-serif",
    fill: wallColor,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });

  canvas.add(label);
}
