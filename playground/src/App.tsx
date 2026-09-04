import { useState } from "react";
import { ModalDialog } from "./components/ModalDialog";
import { Tabs as HandTabs } from "./components/Tabs";
import { Disclosure as HandDisclosure } from "./components/Disclosure";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import {
  Tabs as ShadcnTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Button } from "./components/ui/button";

import "./App.css";

const handTabs = [
  { id: "overview", label: "Overview", content: <p>Hand-built tabs: Overview</p> },
  { id: "rates", label: "Rates", content: <p>Hand-built tabs: Rates</p> },
  { id: "details", label: "Details", content: <p>Hand-built tabs: Details</p> },
];

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="cmp-app">
      <header className="cmp-header">
        <h1>shadcn vs. Hand-Built</h1>
        <p>
          Compare my components against the shadcn/ui equivalents. Both are
          keyboard accessible.
        </p>
      </header>

      {/* MODAL / DIALOG */}
      <section className="cmp-section">
        <h2>Modal / Dialog</h2>
        <div className="cmp-grid">
          <div className="cmp-cell">
            <h3>1. Hand-built ModalDialog</h3>
            <button
              type="button"
              className="demo-button"
              onClick={() => setIsModalOpen(true)}
            >
              Open modal
            </button>
            <span className="cmp-note">Focus-trapped, Escape to close.</span>
            <ModalDialog
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Hand-built modal"
            >
              <p>Focus is trapped inside this dialog.</p>
              <p>Tab cycles focus, Escape closes.</p>
              <input type="text" placeholder="Some input" />
            </ModalDialog>
          </div>

          <div className="cmp-cell">
            <h3>2. shadcn Dialog</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>shadcn dialog title</DialogTitle>
                  <DialogDescription>
                    Radix-powered dialog with portal, overlay, close button and
                    scroll lock.
                  </DialogDescription>
                </DialogHeader>
                <div className="shadcn-body">
                  <input
                    type="text"
                    placeholder="Some input"
                    className="shadcn-input"
                  />
                </div>
                <DialogFooter>
                  <Button>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <span className="cmp-note">
              Portal + overlay + close X + body scroll lock.
            </span>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="cmp-section">
        <h2>Tabs</h2>
        <div className="cmp-grid">
          <div className="cmp-cell">
            <h3>1. Hand-built Tabs</h3>
            <HandTabs tabs={handTabs} />
            <span className="cmp-note">
              Arrow keys, Home/End, roving tabindex.
            </span>
          </div>

          <div className="cmp-cell">
            <h3>2. shadcn Tabs</h3>
            <ShadcnTabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="rates">Rates</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <p>shadcn tabs: Overview</p>
              </TabsContent>
              <TabsContent value="rates">
                <p>shadcn tabs: Rates</p>
              </TabsContent>
              <TabsContent value="details">
                <p>shadcn tabs: Details</p>
              </TabsContent>
            </ShadcnTabs>
            <span className="cmp-note">
              Radix-powered, focus-visible ring + active indicator.
            </span>
          </div>
        </div>
      </section>

      {/* DISCLOSURE */}
      <section className="cmp-section">
        <h2>Disclosure</h2>
        <div className="cmp-grid">
          <div className="cmp-cell">
            <h3>1. Hand-built Disclosure</h3>
            <HandDisclosure label="What is the source rate?">
              <p>Hand-built disclosure content using aria-expanded/controls.</p>
            </HandDisclosure>
            <span className="cmp-note">
              aria-expanded + aria-controls, Enter/Space toggle.
            </span>
          </div>

          <div className="cmp-cell">
            <h3>2. shadcn Disclosure</h3>
            <p className="cmp-note">
              shadcn/ui ships no standalone disclosure API. The closest patterns
              are the Accordion or Collapsible. This gap is covered in NOTES.md.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
