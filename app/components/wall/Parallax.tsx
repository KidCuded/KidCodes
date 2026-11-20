"use client";

import { useEffect, useRef, type ReactNode } from "react";

// How many degrees of phone tilt reach the full parallax shift.
const TILT_RANGE = 18;

type OrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

const clamp = (n: number) => Math.max(-1, Math.min(1, n));

/**
 * Layered parallax: sets --px / --py (−1 … 1) on the wrapper; CSS moves each
 * layer (.wl-l1/2/3) by a different amount, so the wall reads as having depth.
 * Links move with their art.
 *
 * - Mouse (fine pointer with hover): follows the pointer.
 * - Phone or tablet: follows how the device is tilted (gyro). The angle when
 *   the page starts listening is "level", so the room starts still however the
 *   phone is held. iOS asks permission first, so there it starts on the first tap.
 *
 * Off under reduced motion. Starts at 0 (no layout shift). Keeps the
 * .room-tilt class the tests look for.
 */
export default function Parallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const set = (nx: number, ny: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--px", nx.toFixed(3));
        el.style.setProperty("--py", ny.toFixed(3));
      });
    };
    const reset = () => set(0, 0);

    // --- Mouse ---------------------------------------------------------------
    const onMove = (e: PointerEvent) => {
      if (!canHover.matches || reduced.matches || e.pointerType !== "mouse") return;
      set((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2);
    };

    // --- Gyro (touch devices) -----------------------------------------------
    let level: { beta: number; gamma: number } | null = null;
    const onTilt = (e: DeviceOrientationEvent) => {
      if (reduced.matches || canHover.matches || e.beta == null || e.gamma == null) return;
      // Swap the axes in landscape, so "left/right" stays left/right on screen.
      const angle = (screen.orientation?.angle ?? 0) % 360;
      let lr = e.gamma;
      let fb = e.beta;
      if (angle === 90) [lr, fb] = [e.beta, -e.gamma];
      else if (angle === 270) [lr, fb] = [-e.beta, e.gamma];
      if (!level) level = { beta: fb, gamma: lr };
      // Ease the "level" toward how the phone is being held, so a new resting
      // angle drifts back to centre instead of staying pinned at the edge.
      level.beta += (fb - level.beta) * 0.01;
      level.gamma += (lr - level.gamma) * 0.01;
      set(clamp((lr - level.gamma) / TILT_RANGE), clamp((fb - level.beta) / TILT_RANGE));
    };
    const relevel = () => {
      level = null;
      reset();
    };

    // Listen straight away: most phones send tilt events without asking. iOS (and
    // some newer browsers) only send them after permission, which can only be
    // asked from a tap, so the first tap asks once; if refused, the room stays still.
    const canGyro = typeof DeviceOrientationEvent !== "undefined";
    if (canGyro) window.addEventListener("deviceorientation", onTilt);
    const onFirstTap = () => {
      window.removeEventListener("touchend", onFirstTap);
      const DOE = DeviceOrientationEvent as OrientationEventWithPermission;
      if (canGyro && !canHover.matches && typeof DOE.requestPermission === "function") {
        DOE.requestPermission().catch(() => {});
      }
    };
    window.addEventListener("touchend", onFirstTap, { passive: true });

    const onReducedChange = () => reset();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    reduced.addEventListener("change", onReducedChange);
    screen.orientation?.addEventListener("change", relevel);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", reset);
      reduced.removeEventListener("change", onReducedChange);
      screen.orientation?.removeEventListener("change", relevel);
      window.removeEventListener("touchend", onFirstTap);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  return (
    <div ref={ref} className="room-tilt wall-parallax absolute inset-0">
      {children}
    </div>
  );
}
