"use client";

import { useEffect } from "react";

/**
 * Desktop labels show on first load, then fade after ~3 s and appear only on
 * hover or focus. This marks the room root once the intro is over. Without
 * JavaScript the labels simply stay visible. Touch devices and reduced motion
 * keep them visible regardless (see globals.css).
 */
export default function LabelsIntro({ targetId }: { targetId: string }) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      document.getElementById(targetId)?.classList.add("labels-done");
    }, 3000);
    return () => window.clearTimeout(t);
  }, [targetId]);
  return null;
}
