export default function Scale() {
  return (
    <div className="absolute bottom-6 right-6 bg-white/95 px-3 py-2 rounded border border-gray-300 shadow text-black font-mono text-xs">
      <div className="text-center font-bold tracking-wider">SCALE: 1:50</div>

      <div className="flex justify-between gap-[3.2em] -translate-x-[0.2em]">
        <span>0</span>
        <span>3</span>
        <span>6</span>
        <span>9</span>
        <span>12</span>
        <span>15</span>
      </div>
      <div className="relative h-5 mt-1 mb-1 w-60">
        {/* Horizontal bar */}
        <div className="absolute top-2 left-0 right-0 h-0.5 bg-black" />

        {/* Ticks */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 w-0.5 bg-black"
            style={{
              left: `${i * 20}%`,
              height: i === 0 || i === 5 ? "100%" : "60%",
            }}
          />
        ))}
      </div>
      <div className="text-center font-bold tracking-wider">meters</div>
    </div>
  );
}
