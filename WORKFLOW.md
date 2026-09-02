# Branch Comparison: ui/rate-checker vs ui/rate-checker-precise

## Overview

This document compares two feature branches implementing the foreign exchange rate checker UI. The `ui/rate-checker` branch provides a basic implementation with a monolithic App component, while `ui/rate-checker-precise` offers a production-ready, modular architecture with comprehensive improvements across correctness, accessibility, and edge case handling.

---

## Correctness

**`ui/rate-checker`**: Contains hardcoded currency data and inline form handling. The conversion logic is embedded directly in the component, making it difficult to test and verify accuracy. Input validation is minimal, with no Zod schema integration.

**`ui/rate-checker-precise`**: Implements proper form validation using React Hook Form with Zod schemas (`converter-schema.ts`). Currency data is centralized in `constants.ts` with type-safe currency codes. The `AmountInput` component includes input sanitization that strips non-numeric characters while preserving decimal points, preventing invalid state. Number formatting uses `Intl.NumberFormat` with explicit `maximumFractionDigits: 20` for precise decimal handling. The form state is properly managed through `useForm` with `zodResolver`, ensuring all submitted values meet validation criteria before processing.

---

## Accessibility

**`ui/rate-checker`**: Uses basic HTML elements without ARIA attributes. Currency selection uses native `<select>` elements which have limited keyboard support and no screen reader context. Tab navigation is handled through standard anchor tags.

**`ui/rate-checker-precise`**: Implements comprehensive accessibility patterns:

- `CurrencySelect` uses `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls` for proper screen reader announcements
- `CurrencyPickerItem` uses `role="option"` and `aria-selected` for listbox item states
- Search input includes `sr-only` label for screen readers
- `CurrencyFlag` images use `alt=""` (decorative) to avoid redundant announcements
- Focus states use `focus-visible:outline` with primary color for keyboard navigation visibility
- Live market strip includes `aria-hidden` on duplicate content groups
- `prefers-reduced-motion` media query disables marquee and pulse animations

---

## Edge Cases

**`ui/rate-checker`**: Limited edge case handling. Empty states are not differentiated, and the UI may break with empty currency lists or invalid input.

**`ui/rate-checker-precise`**: Addresses multiple edge cases:

- `sanitizeAmountInput` prevents multiple decimal points and strips invalid characters
- `CurrencySection` returns `null` for empty currency arrays, preventing empty section headers
- `CurrencyPicker` displays "No currencies found" message when search yields zero results
- `AmountInput` handles `NaN` values gracefully in `formatNumber`
- `formatNumber` preserves decimal input without truncation while formatting integer parts
- `CurrencyFlag` component handles missing currency gracefully with conditional rendering
- The `CurrencySelect` component handles click-outside and Escape key for dismissal

---

## Review Effort

**`ui/rate-checker`**: Lower initial review effort due to simpler structure, but higher long-term maintenance cost. The monolithic `App.tsx` (112 lines) requires careful review as changes affect the entire UI. Lack of component boundaries makes it harder to isolate issues.

**`ui/rate-checker-precise`**: Higher initial review effort due to 15+ new components and 91 file changes. However, the feature-first organization (`features/converter`, `features/insights`, `features/market`) allows focused review of individual concerns. Each component has a single responsibility:

- `AmountInput`: Handles numeric input and sanitization
- `CurrencyPicker`: Search and selection logic
- `CurrencySelect`: Dropdown behavior and state
- `ConversionForm`: Form orchestration
- `TabsNav`: Navigation state

This separation means reviewers can validate correctness of each component independently. The Zod schema provides clear validation rules that can be verified against requirements.

---

## AI Mistakes Caught During Review

### Bug: Amount input rejects decimal values (150.52, 124.7)

**Symptom**: The amount field only accepted whole numbers (100, 250, 25, etc.). Typing a decimal value such as `150.52` or `124.7` was rejected — the fraction digits were dropped or the value never registered.

**Root cause**: `AmountInput` in `ui/rate-checker-precise` is a React **controlled input** whose `value` is `formatNumber(value)` (from `src/lib/format-number.ts`). `formatNumber` reformats the integer portion through `Intl.NumberFormat` on every keystroke. When the user types a decimal point, the field transitions between the integer formatting branch and the decimal formatting branch while React re-renders the controlled value. This reformatting — combined with the `sanitizeAmountInput` handler round-tripping through `event.target.value` — causes React's caret to jump to the end of the field. As a result the fraction digits typed after the decimal point (e.g. `.52`, `.7`) get overwritten or dropped, so the sanitized/validated raw value never retains its fractional part and effectively behaves like a whole number.

**Why it matters**: It invalidates the "preserve decimal input without truncation" claim made for the component and violates `converter-schema.ts`, which is explicitly designed to accept values like `150.52` (`Number("150.52")` is not `NaN`). For a currency converter this is a correctness bug — partial units and non-integer amounts are a core use case.

**Fix recommendation**: Decouple the raw value from the formatted display. Store the unformatted raw string as the source of truth in state/form, and apply `formatNumber` only for presentation (e.g., a separate display string or a masked-input wrapper that preserves caret position). Ensure the controlled `value` and the DOM caret stay in sync so decimal entry is not truncated.

---

## Recommendation

`ui/rate-checker-precise` is the recommended branch for production use. While it requires more initial review, the improved correctness guarantees, accessibility compliance, edge case handling, and maintainable architecture provide significantly better long-term value. The modular structure also enables incremental testing and future feature additions without touching existing working code.
