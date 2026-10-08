const STARS = [
  { x: 6, y: 8, s: 1.2, d: 0 },
  { x: 18, y: 14, s: 0.8, d: 0.4 },
  { x: 27, y: 6, s: 1, d: 1.1 },
  { x: 41, y: 11, s: 0.7, d: 0.2 },
  { x: 53, y: 5, s: 1.4, d: 1.6 },
  { x: 67, y: 9, s: 0.9, d: 0.7 },
  { x: 78, y: 15, s: 1.1, d: 1.3 },
  { x: 91, y: 7, s: 0.8, d: 0.5 },
  { x: 12, y: 28, s: 0.7, d: 2.1 },
  { x: 33, y: 22, s: 1, d: 0.9 },
  { x: 48, y: 31, s: 0.6, d: 1.8 },
  { x: 62, y: 24, s: 1.2, d: 0.3 },
  { x: 84, y: 29, s: 0.8, d: 1.4 },
  { x: 8, y: 48, s: 0.9, d: 2.4 },
  { x: 22, y: 56, s: 0.6, d: 0.6 },
  { x: 39, y: 44, s: 1.1, d: 1.9 },
  { x: 71, y: 52, s: 0.7, d: 0.1 },
  { x: 88, y: 46, s: 1, d: 2.2 },
  { x: 15, y: 72, s: 0.8, d: 1.2 },
  { x: 44, y: 68, s: 1.3, d: 0.8 },
  { x: 58, y: 78, s: 0.7, d: 1.7 },
  { x: 76, y: 70, s: 0.9, d: 2.6 },
  { x: 93, y: 82, s: 0.6, d: 0.4 },
  { x: 4, y: 88, s: 1, d: 1.5 },
] as const;

export function Starfield() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {STARS.map((star, index) => (
        <span
          key={index}
          className="star-twinkle absolute rounded-full bg-gold"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.s,
            height: star.s,
            animationDelay: `${star.d}s`,
            boxShadow: "0 0 6px color-mix(in oklab, var(--color-gold) 70%, transparent)",
          }}
        />
      ))}
    </div>
  );
}
