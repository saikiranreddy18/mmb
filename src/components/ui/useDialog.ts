"use client";

import { type RefObject, useEffect } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Modal behaviour for drawers/menus: Escape closes, focus is trapped inside,
 * page scroll is locked, and focus returns to the trigger on close.
 */
export function useDialog(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  /** Where focus goes on close if the original trigger is gone or disabled. */
  fallbackSelector?: string,
) {
  useEffect(() => {
    if (!open) return;
    const panel = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panel?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      const usable =
        previous && previous !== document.body && previous.isConnected && !(previous as HTMLButtonElement).disabled;
      const target = usable ? previous : fallbackSelector ? document.querySelector<HTMLElement>(fallbackSelector) : null;
      target?.focus();
    };
  }, [open, ref, onClose, fallbackSelector]);
}
