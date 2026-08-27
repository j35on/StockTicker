import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export function App() {
  const [symbol, setSymbol] = useState('TSLA');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStockData = async (ticker) => {
    if (!ticker.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/stocks/${ticker.trim().toUpperCase()}`
      );
      setData(response.data);
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to connect to server.';
      setError(message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData('TSLA');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStockData(symbol);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Stock Ticker Tracker</h1>
      </header>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter Stock Ticker (e.g. TSLA, AAPL, NVDA)"
          className="search-input"
        />
        <button
          type="submit"
          disabled={loading}
          className="search-button"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {data.length > 0 && (
        <div>
          <h3>Daily Data Table ({symbol.toUpperCase()})</h3>
          <div className="table-wrapper">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Low Average ($)</th>
                  <th>High Average ($)</th>
                  <th>Volume</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.day}>
                    <td>{row.day}</td>
                    <td>{row.lowAverage.toFixed(4)}</td>
                    <td>{row.highAverage.toFixed(4)}</td>
                    <td>{row.volume.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;