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
        - portfolio.ts
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
node portfolio.ts list
```

### 2. Add Holding
Add a new stock or crypto holding.

**Command:**
```
node portfolio.ts add <symbol> <quantity> <price> <name> [type]
```

**Examples:**
```
node portfolio.ts add AAPL 10 150 "Apple Inc." stock
node portfolio.ts add BTC 0.5 45000 Bitcoin crypto
```

### 3. Sell Holding
Sell shares using FIFO (First-In-First-Out) cost basis method.

**Command:**
```
node portfolio.ts sell <symbol> <quantity> <price> [date]
```

**Examples:**
```
node portfolio.ts sell AAPL 5 180 2025-06-01
node portfolio.ts sell BTC 0.25 50000
```

### 4. Transaction History
View sell history for all holdings or a specific symbol.

**Command:**
```
node portfolio.ts history [symbol]
```

**Examples:**
```
node portfolio.ts history
node portfolio.ts history AAPL
```

### 5. P&L Summary
Show both realized and unrealized profit/loss.

**Command:**
```
node portfolio.ts pnl
```

### 6. Remove Holding
Remove a holding by symbol.

**Command:**
```
node portfolio.ts remove <symbol>
```

### 4. Portfolio Value
Show total portfolio value and P&L.

**Command:**
```
node portfolio.ts value
```

### 5. Manage Portfolios
List, switch, or create portfolios.

**Commands:**
```
node portfolio.ts portfolios
node portfolio.ts switch "Portfolio Name"
node portfolio.ts create "New Portfolio"
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

Portfolio data is stored locally in `data/portfolio.tson`. The data file is created automatically on first run with an empty portfolio.

## Features

- Real-time stock prices via Yahoo Finance API
- Real-time crypto prices via CoinGecko API
- Multiple portfolio support
- P&L tracking per holding
- CLI and optional web interface
