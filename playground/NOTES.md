# NOTES.md — Hand-rolled vs shadcn/ui (Dialog & Tabs)

## How to view the comparison

The playground is its own Vite project so it doesn't collide with the main app's
dependency tree (two separate React/node_modules would break the build). To see the
hand-built components side by side with the shadcn equivalents:

```bash
cd playground
npm run dev
```

The `App` renders three sections — Modal/Dialog, Tabs, Disclosure — each showing
"1. Hand-built" and "2. shadcn" versions. All are keyboard-testable (Tab, arrows,
Escape, Enter/Space).

## What shadcn handled that I missed

### 1. Portal rendering for the dialog

My `ModalDialog` renders content inline in the DOM. shadcn wraps `DialogContent` inside a `DialogPortal` (Radix's `Portal`), which teleports the overlay and content to `document.body`. This prevents clipping by overflow:hidden ancestors, stacking-context issues, and z-index conflicts with the host page. My version would silently break if placed inside a `position: sticky` container or an element with `overflow: auto`.

### 2. Accessible close button with sr-only text

shadcn includes a dedicated close `<Button>` rendered inside `DialogContent` that uses `DialogPrimitive.Close`. The button contains an `XIcon` plus a `<span className="sr-only">Close</span>` for screen readers. My implementation only supports closing via the Escape key or clicking the overlay — there is no visible close affordance, which fails WCAG 2.1 Success Criterion 2.4.4 (Link Purpose) and is a common usability anti-pattern for modal dialogs.

### 3. Composed sub-component API (DialogHeader / DialogFooter / DialogTitle / DialogDescription)

shadcn exports separate `DialogTitle`, `DialogDescription`, `DialogHeader`, and `DialogFooter` components. Each is a thin wrapper that applies consistent data-slot attributes and styling, while the primitives (`DialogPrimitive.Title`, `DialogPrimitive.Description`) attach the correct ARIA attributes (`aria-labelledby`, `aria-describedby`) automatically. My component uses a single `title` prop rendered as a raw `<h2>`, which:
- Does not populate `aria-describedby` for the dialog (the W3C pattern recommends both `aria-labelledby` AND `aria-describedby` when a description is present).
- Forces a specific heading level with no way to override it.

### 4. Tabs: orientation support

shadcn's `Tabs` accepts an `orientation` prop (`"horizontal"` | `"vertical"`) and uses `data-orientation` attribute to adjust layout (flex-row vs flex-col). Radix TabsPrimitive handles arrow key direction accordingly — Up/Down for vertical, Left/Right for horizontal. My implementation only supports horizontal orientation with hardcoded arrow key behavior.

### 5. Tabs: variant styling via class-variance-authority

shadcn uses `cva` to define `TabsListVariants` with `default` (pill-style with background) and `line` (underline indicator using an `::after` pseudo-element) visual variants. This is pure presentation, but the `data-active` attribute on triggers lets CSS respond to state without JavaScript class toggling — a cleaner separation of state and style.

### 6. Focus ring visibility

shadcn's `TabsTrigger` includes `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring`, giving a clearly visible focus indicator that appears only for keyboard users. My `tab-button` relies on browser defaults and has no explicit focus-visible styling, which may be invisible in some browser/OS combinations.

### 7. Animation on dialog open/close

shadcn uses Tailwind's `animate-in` / `animate-out` with `fade-in-0` / `fade-out-0` and `zoom-in-95` / `zoom-out-95`, applied via `data-open` and `data-closed` state selectors. This creates a subtle scale-and-fade entrance. My dialog appears and disappears instantly with no transition, which can feel jarring.

### 8. Scroll locking

shadcn's Radix Dialog primitive automatically adds `aria-hidden` to sibling content and locks body scroll while the dialog is open (via `Inertial` handling). My version does not prevent background scrolling, meaning users can scroll behind the open overlay.

---

## Summary of concrete gaps

| Gap | My Version | shadcn |
|---|---|---|
| Portal rendering | None (inline) | Yes |
| Close button | None (Escape/overlay only) | Visible button + sr-only label |
| `aria-describedby` | Not set | Auto-set by Radix Title/Description |
| Sub-component API | Single `title` prop | DialogTitle/Description/Header/Footer |
| Tab orientation | Horizontal only | Horizontal + vertical with correct arrows |
| Focus-visible ring | Browser default only | Explicit `focus-visible:ring` utility |
| Dialog animation | Instant show/hide | Scale + fade transitions |
| Body scroll lock | None | Radix auto-locks |
