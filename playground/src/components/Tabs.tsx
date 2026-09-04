import { useCallback, useRef, useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTabId, onChange }: TabsProps) {
  const [activeTabId, setActiveTabId] = useState(
    defaultTabId ?? tabs[0]?.id ?? "",
  );
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const registerTab = useCallback(
    (id: string, el: HTMLButtonElement | null) => {
      if (el) {
        tabRefs.current.set(id, el);
      } else {
        tabRefs.current.delete(id);
      }
    },
    [],
  );

  const selectTab = useCallback(
    (tabId: string) => {
      setActiveTabId(tabId);
      onChange?.(tabId);
      tabRefs.current.get(tabId)?.focus();
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const ids = tabs.map((t) => t.id);
      const currentIndex = ids.indexOf(activeTabId);
      if (currentIndex === -1) return;

      let nextIndex: number;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          nextIndex = (currentIndex + 1) % ids.length;
          break;
        case "ArrowLeft":
          e.preventDefault();
          nextIndex = (currentIndex - 1 + ids.length) % ids.length;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = ids.length - 1;
          break;
        default:
          return;
      }

      selectTab(ids[nextIndex]);
    },
    [tabs, activeTabId, selectTab],
  );

  const activePanel = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="tabs-container">
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Tabs"
        onKeyDown={handleKeyDown}
        className="tab-list">
        {tabs.map((tab) => {
          const isSelected = tab.id === activeTabId;
          const panelId = `tabpanel-${tab.id}`;
          const tabId = `tab-${tab.id}`;

          return (
            <button
              key={tab.id}
              ref={(el) => registerTab(tab.id, el)}
              role="tab"
              id={tabId}
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              className={`tab-button ${isSelected ? "tab-button--active" : ""}`}>
              {tab.label}
            </button>
          );
        })}
      </div>
      {activePanel && (
        <div
          role="tabpanel"
          id={`tabpanel-${activePanel.id}`}
          aria-labelledby={`tab-${activePanel.id}`}
          tabIndex={0}
          className="tab-panel">
          {activePanel.content}
        </div>
      )}
    </div>
  );
}
