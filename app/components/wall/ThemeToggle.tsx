"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { getRoomTheme, THEME_EVENT, toggleRoomTheme } from "./theme";

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

/** Sun/moon button in the corner nav that switches the room between night and day. */
export default function ThemeToggle() {
  // The theme lives on <html>; the server always assumes night.
  const theme = useSyncExternalStore(subscribe, getRoomTheme, () => "night" as const);
  const toDay = theme === "night";
  return (
    <button
      type="button"
      onClick={toggleRoomTheme}
      aria-label={toDay ? "Switch to day mode" : "Switch to night mode"}
      title={toDay ? "Day mode" : "Night mode"}
      className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-white/10 hover:text-accent"
    >
      {toDay ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </button>
  );
}
