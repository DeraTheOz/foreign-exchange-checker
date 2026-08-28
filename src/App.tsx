import logo from "./assets/images/logo.svg";

const liveRates = [
  ["EUR/USD", "1.1723", "-0.14%", "down"],
  ["USD/JPY", "157.91", "+0.04%", "up"],
  ["GBP/USD", "1.3575", "-0.22%", "down"],
  ["USD/CHF", "0.9098", "+0.13%", "up"],
  ["EUR/GBP", "0.8633", "+0.11%", "up"],
  ["AUD/USD", "0.7208", "+0.08%", "up"],
  ["USD/CAD", "1.3815", "+0.04%", "up"],
];

const currencies = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NGN"];

function App() {
  return (
    <main className="app-shell">
      <header className="site-header">
        <img className="site-logo" src={logo} />
        <p className="market-source">55 CURRENCIES · EOD · ECB DATA</p>
      </header>

      <section className="live-market-strip">
        <div className="live-market-label">
          <span />
          <p>LIVE MARKETS</p>
        </div>
        <div className="live-market-track">
          {liveRates.map(([pair, value, change, direction]) => (
            <div className="live-rate" key={pair}>
              <span>{pair}</span>
              <strong>{value}</strong>
              <em className={direction}>{change}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="rate-section">
        <h1>CHECK THE RATE</h1>

        <form className="converter-form">
          <div className="converter-top">
            <div className="currency-panel">
              <p>SEND</p>
              <div className="currency-row">
                <input inputMode="decimal" name="amount" placeholder="0" />
                <select name="from" defaultValue="USD">
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button className="swap-button" type="button">
              ⇆
            </button>

            <div className="currency-panel">
              <p>RECEIVE</p>
              <div className="currency-row">
                <input inputMode="decimal" name="converted" placeholder="0" />
                <select name="to" defaultValue="EUR">
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="converter-bottom">
            <p>1 USD = 0.8530 EUR</p>
            <div className="converter-actions">
              <button type="button">☆ FAVORITE</button>
              <button type="button">LOG CONVERSION</button>
            </div>
          </div>
        </form>

        <div className="details-panel">
          <nav className="tabs">
            <a className="active">HISTORY</a>
            <a>COMPARE</a>
            <a>
              FAVORITES <span>0</span>
            </a>
            <a>
              LOG <span>0</span>
            </a>
          </nav>

          <div className="empty-history">
            <p>No chart data available</p>
            <p>
              We couldn't load rate history for USD/EUR right now.
              <br />
              This usually clears up in a minute.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
