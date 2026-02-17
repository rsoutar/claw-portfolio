---
name: claw-portfolio
description: Track stock and crypto portfolios with CLI - real-time prices, P&L, multiple portfolios
homepage: https://github.com/rsoutar/claw-portfolio
metadata:
  clawdbot:
    emoji: "💰"
    requires:
      env: []
      files:
        - portfolio.js
---

# Portfolio Tracker

A CLI tool for tracking stock and crypto portfolios with real-time prices and P&L.

## When to Use This Skill

Use this skill when you need to:
- Track stock and crypto holdings locally
- Get real-time prices and P&L
- Manage multiple portfolios
- Export portfolio data to CSV

## Tools

This skill provides the following capabilities:

### 1. List Holdings
Show all holdings with current values and P&L.

**Command:**
```
node portfolio.js list
```

### 2. Add Holding
Add a new stock or crypto holding.

**Command:**
```
node portfolio.js add <symbol> <quantity> <price> <name> [type]
```

**Examples:**
```
node portfolio.js add AAPL 10 150 "Apple Inc." stock
node portfolio.js add BTC 0.5 45000 Bitcoin crypto
```

### 3. Remove Holding
Remove a holding by symbol.

**Command:**
```
node portfolio.js remove <symbol>
```

### 4. Portfolio Value
Show total portfolio value and P&L.

**Command:**
```
node portfolio.js value
```

### 5. Manage Portfolios
List, switch, or create portfolios.

**Commands:**
```
node portfolio.js portfolios
node portfolio.js switch "Portfolio Name"
node portfolio.js create "New Portfolio"
```

## Installation

```bash
npm install
```

## NPM Scripts

```bash
npm run dev        # Start web UI (optional)
npm run build      # Build for production
```

## Web UI (Optional)

You can also run an optional web interface:

```bash
npm run dev
```

Then open http://localhost:3000

## Data Storage

Portfolio data is stored locally in `data/portfolio.json`. The data file is created automatically on first run with an empty portfolio.

## Features

- Real-time stock prices via Yahoo Finance API
- Real-time crypto prices via CoinGecko API
- Multiple portfolio support
- P&L tracking per holding
- CLI and optional web interface
