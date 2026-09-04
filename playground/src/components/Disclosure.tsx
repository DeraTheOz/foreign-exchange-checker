import { useCallback, useId, useState } from "react";

interface DisclosureProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({ label, children, defaultOpen = false }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const buttonId = useId();
  const panelId = useId();

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
    [toggle],
  );

  return (
    <div className="disclosure-container">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className="disclosure-button"
      >
        {label}
      </button>
      <div
        role="region"
        aria-labelledby={buttonId}
        id={panelId}
        hidden={!isOpen}
        className="disclosure-panel"
      >
        {children}
      </div>
    </div>
  );
}
