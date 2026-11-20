// Day / night theme for the room. The theme lives on <html data-room-theme>
// ("day" or absent = night), is remembered in localStorage, and is applied
// before first paint by the inline script in app/layout.tsx.

export type RoomTheme = "day" | "night";

export const THEME_KEY = "room-theme";
export const THEME_EVENT = "room-theme-change";

/** Runs in <head> before paint (no flash). Kept tiny and dependency-free. */
export const THEME_INIT_SCRIPT = `try{if(localStorage.getItem("${THEME_KEY}")==="day")document.documentElement.dataset.roomTheme="day"}catch(e){}`;

export function getRoomTheme(): RoomTheme {
  if (typeof document === "undefined") return "night";
  return document.documentElement.dataset.roomTheme === "day" ? "day" : "night";
}

export function setRoomTheme(theme: RoomTheme) {
  const root = document.documentElement;
  if (theme === "day") root.dataset.roomTheme = "day";
  else delete root.dataset.roomTheme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage blocked (private mode etc.): the theme still applies for this visit.
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
}

export function toggleRoomTheme() {
  setRoomTheme(getRoomTheme() === "day" ? "night" : "day");
}
