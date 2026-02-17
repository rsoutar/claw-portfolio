---
name: portfolio
description: Track stock and crypto portfolios with CLI - real-time prices, P&L, multiple portfolios
metadata:
  openclaw:
    requires:
      bins:
        - node
        - npm
      env: []
    primaryEnv: ""
    emoji: "💰"
---

# Portfolio Tracker

A CLI tool for tracking stock and crypto portfolios with real-time prices and P&L.

## CLI Commands

Use directly with node:

```bash
node portfolio.js <command>
```

Or install globally:

```bash
npm link
portfolio <command>
```

## Commands

### list (ls)
List all holdings with current values and P&L:
```bash
node portfolio.js list
```

### add
Add a new holding:
```bash
node portfolio.js add <symbol> <quantity> <price> <name> [type]
```
Examples:
```bash
node portfolio.js add AAPL 10 150 "Apple Inc." stock
node portfolio.js add BTC 0.5 45000 Bitcoin crypto
```

### remove (rm)
Remove a holding:
```bash
node portfolio.js remove AAPL
```

### value (val)
Show portfolio total value:
```bash
node portfolio.js value
```

### portfolios (pf)
List all portfolios:
```bash
node portfolio.js portfolios
```

### switch
Switch to another portfolio:
```bash
node portfolio.js switch "Crypto"
```

### create
Create a new portfolio:
```bash
node portfolio.js create "My Portfolio"
```

## Web UI (Optional)

You can also run the optional web interface:
```bash
npm run dev
```
Then open http://localhost:3000

## Data Storage

Portfolio data is stored locally in `data/portfolio.json`.

## Features

- Real-time stock prices via Yahoo Finance API
- Real-time crypto prices via CoinGecko API
- Multiple portfolio support
- P&L tracking per holding
- CLI and optional web interface
