// Small drawing helpers.

/** Mix a hex colour toward white (amount > 0) or black (amount < 0). */
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.round(amount >= 0 ? c + (255 - c) * amount : c * (1 + amount)),
  );
  return `#${ch.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Deterministic pseudo-random number in [0, 1) for a seed (stable across renders). */
export function rand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
