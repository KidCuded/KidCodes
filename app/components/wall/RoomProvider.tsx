"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import RoomDialog, { type RoomView } from "./RoomDialog";
import { toggleRoomTheme } from "./theme";

const VIEWS: RoomView[] = ["resume", "contact", "about", "quick"];

/** Water the bush (both layouts): drops fall, leaves rustle, and it flowers or closes up. */
function waterPlant() {
  document.querySelectorAll('[data-room="plant"]').forEach((el) => {
    el.removeAttribute("data-watered");
    void (el as SVGGElement).getBoundingClientRect(); // restart the animation
    el.setAttribute("data-watered", "");
    el.toggleAttribute("data-bloom");
  });
}

/**
 * Turns the room's objects (and the corner nav's About / Resume / Contact) into
 * openers for the in-room views. Elements opt in with `data-opens="<view>"`.
 * They are real links in the server HTML, so without JavaScript they still go
 * to /resume, /contact, /about. With JavaScript, a click (or Enter/Space)
 * opens the view instead. Only one view is open at a time.
 */
export default function RoomProvider({ about, children }: { about: string[]; children: ReactNode }) {
  const [view, setView] = useState<RoomView | null>(null);
  // The element focus returns to when the view closes.
  const opener = useRef<HTMLElement | SVGElement | null>(null);
  // Where the view flies in from (the opener's on-screen box).
  const [origin, setOrigin] = useState<DOMRect | null>(null);

  const open = useCallback((next: RoomView, from: HTMLElement | SVGElement | null, keepOpener = false) => {
    if (!keepOpener) opener.current = from;
    setOrigin(from ? from.getBoundingClientRect() : null);
    setView(next);
  }, []);

  const close = useCallback(() => {
    setView(null);
    const el = opener.current;
    // Return focus to whatever opened the view (for quick-link swaps: the computer).
    if (el) requestAnimationFrame(() => (el as HTMLElement).focus({ preventScroll: true }));
  }, []);

  function findOpener(target: EventTarget | null) {
    const el = (target as Element | null)?.closest?.("[data-opens]") as (HTMLElement | SVGElement) | null;
    const v = el?.getAttribute("data-opens") as RoomView | null;
    return el && v && VIEWS.includes(v) ? { el, v } : null;
  }

  return (
    <div
      className="contents"
      onClickCapture={(e) => {
        // Let modified clicks (new tab etc.) behave like normal links.
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if ((e.target as Element).closest?.('[data-action="toggle-theme"]')) {
          e.preventDefault();
          toggleRoomTheme();
          return;
        }
        if ((e.target as Element).closest?.('[data-action="water-plant"]')) {
          e.preventDefault();
          waterPlant();
          return;
        }
        const hit = findOpener(e.target);
        if (!hit) return;
        e.preventDefault();
        e.stopPropagation();
        open(hit.v, hit.el);
      }}
      onKeyDown={(e) => {
        // The light switch is a focusable <g role="button">: Enter and Space toggle it.
        if ((e.key === "Enter" || e.key === " ") && (e.target as Element).closest?.('[data-action="toggle-theme"]')) {
          e.preventDefault();
          toggleRoomTheme();
          return;
        }
        // Links fire click on Enter already; objects announced as buttons also take Space.
        if (e.key !== " ") return;
        const hit = findOpener(e.target);
        if (!hit || hit.el.getAttribute("role") !== "button") return;
        e.preventDefault();
        open(hit.v, hit.el);
      }}
    >
      {children}
      <RoomDialog
        view={view}
        origin={origin}
        about={about}
        onClose={close}
        onSwap={(next) => open(next, null, true)}
      />
    </div>
  );
}
