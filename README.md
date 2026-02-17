# Portfolio Tracker

A CLI tool for tracking stock and crypto portfolios with real-time prices, P&L, and multiple portfolios.

## Quick Start

```bash
# Install dependencies
npm install

# Link for global CLI use (optional)
npm link
```

## CLI Commands

```bash
# List holdings with live prices
portfolio list

# Add a stock
portfolio add AAPL 10 150 "Apple Inc." stock

# Add crypto
portfolio add BTC 0.5 45000 Bitcoin crypto

# Remove a holding
portfolio remove AAPL

# Show total value
portfolio value

# List all portfolios
portfolio portfolios

# Switch portfolio
portfolio switch "Crypto"

# Create new portfolio
portfolio create "My Portfolio"
```

## Web UI (Optional)

Run the optional web interface:

```bash
npm run dev
```

Then open http://localhost:3000

## Data Location

Portfolio data: `data/portfolio.json`

## Features

- **Real-time prices** - Stocks via Yahoo Finance, crypto via CoinGecko
- **Multiple portfolios** - Create, switch, delete portfolios
- **P&L tracking** - Per-asset profit/loss with percentages
- **CLI-first** - Designed for OpenClaw integration
- **Web UI** - Optional browser interface

## Tech Stack

- Node.js (ESM)
- Yahoo Finance API
- CoinGecko API
- Next.js 16 (optional web UI)
