"use client";

import { useEffect, useState } from "react";

/** Hour and minute in Kuala Lumpur (UTC+8, no daylight saving). */
function klTime(now: Date) {
  const utcMin = now.getUTCHours() * 60 + now.getUTCMinutes();
  const kl = (utcMin + 8 * 60) % (24 * 60);
  return { h: Math.floor(kl / 60), m: kl % 60 };
}

/**
 * Wall clock showing the current time in Kuala Lumpur. Rendered inside a
 * wall-plane transform (2D, room units, centred on 0,0). The server renders
 * 10:10; the client sets the real time and updates it every 30 s.
 */
export default function Clock({ r, transform }: { r: number; transform: string }) {
  const [t, setT] = useState<{ h: number; m: number } | null>(null);

  useEffect(() => {
    const tick = () => setT(klTime(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const h = t?.h ?? 10;
  const m = t?.m ?? 10;
  const minuteDeg = m * 6;
  const hourDeg = (h % 12) * 30 + m * 0.5;
  const label = t ? `Kuala Lumpur time ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}` : "Kuala Lumpur time";

  return (
    <g data-room="clock" transform={transform}>
      <title>{label}</title>
      <circle cx={0.03} cy={0.05} r={r} fill="#000" opacity={0.25} />
      <circle r={r} fill="#2b3346" />
      <circle r={r * 0.86} fill="#f3f1ea" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          x={-0.012}
          y={-r * 0.8}
          width={0.024}
          height={i % 3 === 0 ? r * 0.16 : r * 0.08}
          fill="#2b3346"
          transform={`rotate(${i * 30})`}
        />
      ))}
      <rect className="clock-hand" x={-0.025} y={-r * 0.45} width={0.05} height={r * 0.5} rx={0.02} fill="#1b2235" transform={`rotate(${hourDeg})`} />
      <rect className="clock-hand" x={-0.018} y={-r * 0.68} width={0.036} height={r * 0.74} rx={0.015} fill="#1b2235" transform={`rotate(${minuteDeg})`} />
      <circle r={0.04} fill="#e2574c" />
      <text y={r * 0.42} fontSize={r * 0.17} fontWeight={700} textAnchor="middle" fill="#8a93a6">
        KL
      </text>
    </g>
  );
}
