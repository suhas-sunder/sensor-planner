export function Sensors({
  circles,
  onMouseDown
}: {
  circles: {
    id: number;
    cx: number;
    cy: number;
    r: number;
    fill: string;
  }[];
  onMouseDown: (id: number) => void;
}) {
  return (
    <>
      {circles.map(({ id, cx, cy, r, fill }) => (
        <circle
          key={id}
          cx={cx}
          cy={cy}
          r={r}
          fill={fill}
          onMouseDown={() => onMouseDown(id)}
          className="cursor-grab cursor-grabbing"
        />
      ))}
    </>
  );
}
