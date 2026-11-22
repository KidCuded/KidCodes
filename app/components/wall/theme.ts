// Day / night theme for the room. The theme lives on <html data-room-theme>
// ("day" or absent = night) and is applied before first paint by the inline
// script in app/layout.tsx.
//
// On opening the site the visitor's clock decides: day from 7 a.m. until
// 7 p.m., night otherwise. Flipping the switch overrides that for the rest of
// the visit (sessionStorage, so it survives reloads but not a new visit).

export type RoomTheme = "day" | "night";

export const THEME_KEY = "room-theme";
export const THEME_EVENT = "room-theme-change";

/** Day from this hour (inclusive) until NIGHT_FROM, in the visitor's local time. */
export const DAY_FROM = 7;
export const NIGHT_FROM = 19;

/** Runs in <head> before paint (no flash). Kept tiny and dependency-free. */
export const THEME_INIT_SCRIPT = `try{var t=null;try{t=sessionStorage.getItem("${THEME_KEY}")}catch(e){}if(t!=="day"&&t!=="night"){var h=new Date().getHours();t=h>=${DAY_FROM}&&h<${NIGHT_FROM}?"day":"night"}if(t==="day")document.documentElement.dataset.roomTheme="day";try{localStorage.removeItem("${THEME_KEY}")}catch(e){}}catch(e){}`;

export function getRoomTheme(): RoomTheme {
  if (typeof document === "undefined") return "night";
  return document.documentElement.dataset.roomTheme === "day" ? "day" : "night";
}

export function setRoomTheme(theme: RoomTheme) {
  const root = document.documentElement;
  if (theme === "day") root.dataset.roomTheme = "day";
  else delete root.dataset.roomTheme;
  try {
    sessionStorage.setItem(THEME_KEY, theme); // for the rest of this visit only
  } catch {
    // Storage blocked (private mode etc.): the theme still applies for this visit.
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
}

export function toggleRoomTheme() {
  setRoomTheme(getRoomTheme() === "day" ? "night" : "day");
}
