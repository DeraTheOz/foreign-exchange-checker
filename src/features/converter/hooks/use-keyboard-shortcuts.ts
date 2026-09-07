import { useEffect } from "react";
import { useConverterStore } from "../store/converter-store";

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if ((event.ctrlKey || event.metaKey) && !event.altKey && key === "k") {
        event.preventDefault();
        useConverterStore.setState({ pickerTarget: "from" });
        return;
      }

      if (isEditable(event.target)) return;

      if (!event.ctrlKey && !event.metaKey && !event.altKey && key === "s") {
        event.preventDefault();
        useConverterStore.getState().swap();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
}