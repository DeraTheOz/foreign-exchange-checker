# AGENTS.md

## Project Overview

A modern foreign exchange currency converter built with React, TypeScript, and Vite.

The application allows users to:

- Convert between currencies using real-time exchange rates.
- View historical exchange rate trends.
- Save favorite currency pairs.
- Track conversion history.
- Export conversion history as CSV.
- Share conversion pairs through URL parameters.
- Use keyboard shortcuts for faster navigation.
- Switch between light and dark themes.
- Access cached exchange rates when API requests fail.
- Generate AI-powered exchange rate analysis from historical data.

---

## Tech Stack

### Core

- React
- TypeScript
- Vite

### Styling

- Tailwind CSS

### Forms

- React Hook Form
- Zod

### Data Fetching

- TanStack Query

### State Management

- Zustand

### Data Visualization

- Recharts

### Routing

- React Router

### Icons

- Lucide React

### AI

- LLM Provider (OpenAI, Gemini, Groq, etc.)

---

## Development Principles

### Keep Components Small

Aim for:

- Single responsibility
- Easy testing
- Easy reuse

If a component exceeds ~200 lines, consider splitting it.

---

### Prefer Composition Over Prop Drilling

Avoid deeply nested prop chains.

Use:

- Zustand
- Custom hooks
- Context only when appropriate

---

### Server State vs Client State

Use TanStack Query for:

- Exchange rates
- Historical rates
- Currency metadata

Use Zustand for:

- Favorites
- Conversion history
- UI state
- User preferences

Never duplicate Query state inside Zustand.

---

### Feature-First Organization

New features belong in:

src/features/<feature-name>

Keep related:

- components
- hooks
- schemas
- utils
- store

inside the same feature.

---

### Forms

All forms must:

- Use React Hook Form
- Use Zod validation
- Avoid manual validation logic

---

### URL State

Currency pairs should remain shareable.

Preferred format:

/?from=USD&to=NGN

The URL is the source of truth for:

- from currency
- to currency

---

### Local Storage

Persist:

- theme
- favorites
- conversion history

Never persist API responses directly.

---

### Accessibility

All interactive elements must:

- Be keyboard accessible
- Have proper labels
- Have visible focus states

Charts should include accessible summaries.

---

### Performance

Avoid unnecessary re-renders.

Use:

- memo
- useMemo
- useCallback

only when profiling indicates benefit.

Do not prematurely optimize.

---

### Error Handling

Every API request should support:

- loading state
- success state
- error state

Provide meaningful error messages.

---

### Cached Fallback

When exchange rate requests fail:

1. Check local cache.
2. Display cached values.
3. Inform the user data may be stale.

Example:

"Using exchange rates cached 2 hours ago."

---

## AI Exchange Rate Analyst

### Goal

Provide users with an AI-generated explanation of exchange rate trends based on historical market data.

The AI feature should:

- Analyze chart data.
- Summarize recent trends.
- Highlight notable movements.
- Explain potential implications of appreciation or depreciation.
- Avoid financial advice or future predictions.

---

### Example Output

Trend Summary

USD/NGN increased by 8.4% over the last 90 days.

Key Insight

The appreciation of the US dollar relative to the Nigerian naira may increase the cost of imported goods and international transactions priced in USD.

---

### Rules

The AI must:

- Explain historical trends only.
- Avoid investment recommendations.
- Avoid forecasting future rates.
- Avoid claiming certainty.
- Remain concise and easy to understand.

---

### AI Prompting

The AI receives:

- Currency pair
- Current rate
- Historical rate data
- Percentage change
- Selected date range

The AI returns:

- Trend Summary
- Key Insight

Maximum response length:

200 words

---

### Charts

Historical charts should:

- Support multiple ranges.
- Be responsive.
- Show meaningful tooltips.

Suggested ranges:

- 7 days
- 30 days
- 90 days
- 1 year

---

### CSV Export

Conversion history exports should:

- Use UTF-8 encoding.
- Generate downloadable CSV files.
- Include timestamps.

---

### Keyboard Shortcuts

Support:

- Ctrl/Cmd + K → Open currency search
- S → Swap currencies
- 1 → 7-day chart
- 2 → 30-day chart
- 3 → 90-day chart
- 4 → 1-year chart
- ? → Open shortcuts help dialog

---

### Code Style

Prefer:

- Named exports
- Functional components
- Explicit types

Avoid:

- any
- Large utility files
- Deep nesting

---

### Goal

Every implementation should balance:

- Simplicity
- Maintainability
- Production readiness

Avoid over-engineering.
