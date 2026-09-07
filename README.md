# Foreign Exchange Checker

Foreign Exchange Checker helps users convert currencies using real-time market data while providing deep insights into historical exchange rate trends. It takes standard currency pairs, visualizes their performance over time, and generates automated market analysis so teams do not have to guess where the market is heading.

## System Architecture

```mermaid
flowchart LR
  Client["Web Client"]
  API["Backend API"]
  Exchange["Exchange Rate API"]
  GenAI["Google GenAI"]

  Client --> Exchange
  Client --> API
  API --> GenAI

  style Client fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff
  style API fill:#2e1065,stroke:#8b5cf6,stroke-width:2px,color:#fff
  style Exchange fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff
  style GenAI fill:#022c22,stroke:#10b981,stroke-width:2px,color:#fff
```

## Usage

Users can open the application in any modern web browser to perform immediate currency conversions. Select a base currency and a target currency from the dropdown menus to see the current exchange rate and the converted amount.

To share a specific conversion pair with colleagues, append the currency codes to the URL parameters like this:

```text
https://example.com/?from=USD&to=EUR
```

The application includes an insights panel below the conversion form. Users can click through the tabs to view historical charts, compare rates against multiple currencies, check pinned favorites, or review their local conversion log.

For faster navigation, the application supports keyboard shortcuts. Pressing these keys will trigger the following actions:

- **Ctrl/Cmd + K**: Open the currency search menu.
- **S**: Swap the currently selected currencies.

To generate an AI analysis of a specific currency pair, select the "AI Analyst" tab and click the generate button. The application will process the historical data for the selected date range and provide a trend summary along with key market insights.

## Features

### Real-Time Conversion

Instantly convert amounts between dozens of global currencies using up-to-date market rates. The system features offline resilience, automatically falling back to locally cached rates if network connectivity drops.

```mermaid
sequenceDiagram
  actor User
  participant Client
  participant Cache as "Local Storage"
  participant API as "Exchange API"

  User->>Client: Enter amount and currencies
  Client->>API: Fetch latest exchange rate
  alt Network Success
    API->>Client: Return live rate
    Client->>Cache: Save rate for offline use
  else Network Failure
    Client->>Cache: Retrieve last known rate
    Cache->>Client: Return cached rate
  end
  Client->>User: Display converted amount
```

### AI Market Analyst

Generate automated, plain English summaries that explain historical rate movements and their potential implications using Google GenAI.

```mermaid
sequenceDiagram
  actor User
  participant Client as "Web Client"
  participant API as "Backend API"
  participant AI as "Google GenAI"

  User->>Client: Click Generate Analysis
  Client->>Client: Prepare historical rate data
  Client->>API: POST /api/ai/analyze
  API->>AI: Send prompt with rate data
  AI->>API: Return JSON trend summary
  API->>Client: Return analysis result
  Client->>User: Display trend and insight
```

### Historical Charts

Visualize exchange rate movements over customizable periods ranging from 1 day to 5 years. This helps users spot long-term trends and short-term volatility.

### Multi-Currency Comparison

View how a specific base amount translates across a list of popular or pinned currencies at a single glance.

### Favorites and Logging

Pin frequently used pairs for quick access and maintain a private, local history of past conversions. The local conversion log can also be exported as a CSV file.

## Technologies Used

| Technology     | Description                         |
| :------------- | :---------------------------------- |
| React          | Frontend UI library                 |
| TypeScript     | Strongly typed programming language |
| Vite           | Frontend build tool                 |
| Tailwind CSS   | Utility-first CSS framework         |
| TanStack Query | Asynchronous state management       |
| Zustand        | Client state management             |
| Recharts       | Composable charting library         |
| Google GenAI   | Backend AI processing               |

## Author

- LinkedIn: https://linkedin.com/in/emmanuel-ihemedu
- X: https://x.com/deraamaobi

## Built With

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
