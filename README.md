# Foreign Exchange Checker

A modern foreign exchange currency converter built with React, TypeScript, and Vite.

This application allows users to convert between currencies using real-time exchange rates, analyze historical trends, save favorite currency pairs, export conversion history, and generate AI-powered exchange rate insights.

---

## Features

### Currency Conversion

- Real-time currency conversion
- Support for multiple international currencies
- Currency pair swapping
- URL-shareable conversions

Example:

/?from=USD&to=NGN

---

### Historical Exchange Rate Charts

- Interactive charts powered by Recharts
- Historical rate visualization
- Multiple date ranges

Supported ranges:

- 7 Days
- 30 Days
- 90 Days
- 1 Year

---

### AI Exchange Rate Analyst

Generate AI-powered insights from historical exchange rate data.

The AI provides:

- Trend summaries
- Market movement explanations
- Currency appreciation/depreciation insights

Example:

> USD/NGN increased by 8.4% over the last 90 days.
>
> The appreciation of the US dollar relative to the Nigerian naira may increase the cost of imported goods and international purchases priced in USD.

Note:

The AI feature explains historical trends and does not provide financial advice or future predictions.

---

### Favorites

Save frequently used currency pairs for quick access.

Examples:

- USD → NGN
- EUR → GBP
- CAD → AUD

---

### Conversion History

Track previous conversions locally.

Stored information includes:

- Amount
- Source currency
- Target currency
- Exchange rate
- Timestamp

---

### CSV Export

Export conversion history to CSV format for further analysis or record keeping.

---

### Theme Support

- Light Mode
- Dark Mode

Theme preference is persisted locally.

---

### Keyboard Shortcuts

| Shortcut     | Action                |
| ------------ | --------------------- |
| Ctrl/Cmd + K | Open currency search  |
| S            | Swap currencies       |
| 1            | 7-day chart           |
| 2            | 30-day chart          |
| 3            | 90-day chart          |
| 4            | 1-year chart          |
| ?            | Open shortcuts dialog |

---

### Offline-Friendly Experience

When exchange rate requests fail:

- Cached rates are used when available
- Users are informed when data may be stale

Example:

"Using exchange rates cached 2 hours ago."

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Styling

- Tailwind CSS

### Forms & Validation

- React Hook Form
- Zod

### State Management

- Zustand

### Data Fetching

- TanStack Query

### Charts

- Recharts

### Routing

- React Router

### Icons

- Lucide React

### AI

- LLM Provider (OpenAI, Gemini, or Groq)

---

## Accessibility

The application is built with accessibility in mind.

Features include:

- Keyboard navigation
- Focus management
- Semantic HTML
- Screen reader support
- Accessible chart summaries

---

## Performance

- TanStack Query caching
- Local storage persistence
- Lazy-loaded routes where appropriate
- Optimized chart rendering

---

## Future Improvements

- More chart intervals
- Additional currencies
- Multi-currency comparison
- PWA support
- Exchange rate alerts
- AI-generated comparison reports
