"use client";

import { useEffect, useRef } from "react";
import { motion, MotionConfig, useAnimate } from "motion/react";
import { X } from "lucide-react";
import ResumeView from "@/app/components/content/ResumeView";
import ContactCard from "@/app/components/content/ContactCard";
import AboutContent from "@/app/components/content/AboutContent";
import QuickTerminal from "./QuickTerminal";

export type RoomView = "resume" | "contact" | "about" | "quick";

type Props = {
  view: RoomView | null;
  /** The opener's on-screen box; the view flies in from there. */
  origin: DOMRect | null;
  about: string[];
  onClose: () => void;
  /** Swap to another view (from the computer's quick links). */
  onSwap: (view: RoomView) => void;
};

const TITLES: Record<RoomView, string> = {
  resume: "Resume",
  contact: "Contact",
  about: "About me",
  quick: "Quick links",
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * One native <dialog> for every in-room view, opened with showModal(): the
 * page behind it is inert and Esc closes it. Only one view exists at a time;
 * swapping views reuses the same dialog. The panel flies in from the object
 * that opened it (Motion; under reduced motion it only fades).
 */
export default function RoomDialog({ view, origin, about, onClose, onSwap }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const closing = useRef(false);

  // Open / close the native dialog to match `view`.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (view && !d.open) {
      closing.current = false;
      d.showModal();
    } else if (!view && d.open) {
      d.close();
    }
    if (view) {
      // Focus the first control in the new view (the close button comes last in
      // the DOM so the view's own content is reached first).
      requestAnimationFrame(() => {
        const first = d.querySelector<HTMLElement>(`[data-view] ${FOCUSABLE}`);
        first?.focus({ preventScroll: true });
      });
    }
  }, [view]);

  async function requestClose() {
    if (closing.current || !view) return;
    closing.current = true;
    if (scope.current) {
      await animate(scope.current, { opacity: 0, scale: 0.97 }, { duration: 0.14 });
    }
    onClose();
  }

  // Fly in from the opener: start where the object is, at a small scale.
  const from = (() => {
    if (!origin || typeof window === "undefined") return { opacity: 0, scale: 0.92 };
    const dx = origin.left + origin.width / 2 - window.innerWidth / 2;
    const dy = origin.top + origin.height / 2 - window.innerHeight / 2;
    return { opacity: 0, x: dx, y: dy, scale: 0.2 };
  })();

  const titleId = "room-dialog-title";

  return (
    <dialog
      ref={dialogRef}
      className="room-dialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        // Esc: animate out, then close (and return focus).
        e.preventDefault();
        void requestClose();
      }}
      onClick={(e) => {
        // Click on the backdrop (outside the panel) closes.
        if (e.target === dialogRef.current) void requestClose();
      }}
      onKeyDown={(e) => {
        // Keep Tab inside the dialog.
        if (e.key !== "Tab" || !dialogRef.current) return;
        const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => el.offsetParent !== null || el === document.activeElement,
        );
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }}
    >
      <MotionConfig reducedMotion="user">
        {view && (
          <motion.div
            key={view}
            ref={scope}
            data-view={view}
            className={`room-panel room-panel-${view}`}
            initial={from}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 26, opacity: { duration: 0.18 } }}
          >
            <h2 id={titleId} className={view === "about" ? "room-panel-title" : "sr-only"}>
              {TITLES[view]}
            </h2>

            {view === "resume" && <ResumeView />}
            {view === "contact" && <ContactCard />}
            {view === "about" && (
              <div className="room-bubble">
                <AboutContent paragraphs={about} variant="bubble" />
              </div>
            )}
            {view === "quick" && <QuickTerminal onSwap={onSwap} onClose={onClose} />}

            {/* Last in the DOM so the view's own content is reached first. On the monitor it sits on the red title-bar dot. */}
            <button type="button" className="room-panel-close" aria-label="Close" onClick={() => void requestClose()}>
              <X className="h-5 w-5" aria-hidden />
            </button>
          </motion.div>
        )}
      </MotionConfig>
    </dialog>
  );
}
