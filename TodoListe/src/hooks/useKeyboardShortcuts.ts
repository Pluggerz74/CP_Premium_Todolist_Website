import { useEffect, type RefObject } from "react";

type ShortcutHandlers = {
  onQuickAdd?: () => void;
  onEscape?: () => void;
  searchInputRef?: RefObject<HTMLInputElement | null>;
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && handlers.onEscape) {
        handlers.onEscape();
        return;
      }

      if (isTypingTarget(event.target)) return;

      if (event.key === "/" && handlers.searchInputRef?.current) {
        event.preventDefault();
        handlers.searchInputRef.current.focus();
        return;
      }

      if (event.key === "n" && !event.metaKey && !event.ctrlKey && !event.altKey && handlers.onQuickAdd) {
        event.preventDefault();
        handlers.onQuickAdd();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}
