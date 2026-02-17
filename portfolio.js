#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadPortfolio() {
  ensureDataDir();
  if (!fs.existsSync(PORTFOLIO_FILE)) {
    const defaultPortfolio = {
      id: crypto.randomUUID(),
      name: 'Main Portfolio',
      holdings: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    const state = { portfolios: [defaultPortfolio], activePortfolioId: defaultPortfolio.id };
    fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(state, null, 2));
    return state;
  }
  return JSON.parse(fs.readFileSync(PORTFOLIO_FILE, 'utf-8'));
}

function savePortfolio(state) {
  fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(state, null, 2));
}

function getActivePortfolio(state) {
  return state.portfolios.find(p => p.id === state.activePortfolioId) || state.portfolios[0];
}

async function fetchPrice(symbol, type) {
  try {
    if (type === 'crypto') {
      const coinId = symbol.toLowerCase().replace('-usdt', '').replace('-usd', '');
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`);
      const data = await res.json();
      if (data[coinId]) {
        return { price: data[coinId].usd, change: data[coinId].usd_24h_change || 0 };
      }
    } else {
      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`);
      const data = await res.json();
      const result = data.chart?.result?.[0];
      if (result) {
        const price = result.meta.regularMarketPrice;
        const prev = result.meta.chartPreviousClose || result.meta.previousClose;
        const change = prev ? ((price - prev) / prev) * 100 : 0;
        return { price, change };
      }
    }
  } catch (e) {
    console.error(`Error fetching ${symbol}:`, e.message);
  }
  return null;
}

const command = process.argv[2];
const args = process.argv.slice(3);

async function run() {
  const state = loadPortfolio();
  const portfolio = getActivePortfolio(state);

  switch (command) {
    case 'list':
    case 'ls':
      console.log(`\n📊 ${portfolio.name}\n`);
      if (portfolio.holdings.length === 0) {
        console.log('  No holdings yet.\n');
        return;
      }
      console.log('  Symbol    Type      Qty     Cost      Value     P&L');
      console.log('  ' + '-'.repeat(60));
      
      let totalCost = 0, totalValue = 0;
      
      for (const h of portfolio.holdings) {
        const priceData = await fetchPrice(h.symbol, h.type);
        const price = priceData?.price || h.purchasePrice;
        const value = price * h.quantity;
        const cost = h.purchasePrice * h.quantity;
        const pnl = value - cost;
        totalCost += cost;
        totalValue += value;
        
        const pnlStr = pnl >= 0 ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`;
        console.log(`  ${h.symbol.padEnd(8)} ${h.type.padEnd(8)} ${h.quantity.toString().padEnd(7)} $${cost.toFixed(2).padStart(8)} $${value.toFixed(2).padStart(9)} ${pnlStr.padStart(10)}`);
      }
      
      console.log('  ' + '-'.repeat(60));
      const totalPnl = totalValue - totalCost;
      console.log(`\n  Total Cost:  $${totalCost.toFixed(2)}`);
      console.log(`  Total Value: $${totalValue.toFixed(2)}`);
      console.log(`  Total P&L:   ${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}\n`);
      break;

    case 'add':
      if (args.length < 4) {
        console.log('Usage: portfolio add <symbol> <quantity> <price> <name> [type]');
        console.log('Example: portfolio add AAPL 10 150 "Apple Inc." stock');
        process.exit(1);
      }
      const [symbol, qty, price, name, type = 'stock'] = args;
      portfolio.holdings.push({
        id: crypto.randomUUID(),
        symbol: symbol.toUpperCase(),
        name,
        type,
        quantity: parseFloat(qty),
        purchasePrice: parseFloat(price),
        purchaseDate: new Date().toISOString().split('T')[0],
      });
      portfolio.lastUpdated = new Date().toISOString();
      savePortfolio(state);
      console.log(`✅ Added ${qty} ${symbol.toUpperCase()} to ${portfolio.name}`);
      break;

    case 'remove':
    case 'rm':
      if (args.length < 1) {
        console.log('Usage: portfolio remove <symbol>');
        process.exit(1);
      }
      const sym = args[0].toUpperCase();
      const idx = portfolio.holdings.findIndex(h => h.symbol === sym);
      if (idx === -1) {
        console.log(`❌ ${sym} not found in portfolio`);
        process.exit(1);
      }
      portfolio.holdings.splice(idx, 1);
      portfolio.lastUpdated = new Date().toISOString();
      savePortfolio(state);
      console.log(`✅ Removed ${sym} from ${portfolio.name}`);
      break;

    case 'portfolios':
    case 'pf':
      console.log('\n📁 Portfolios:\n');
      state.portfolios.forEach(p => {
        const active = p.id === state.activePortfolioId ? ' (active)' : '';
        console.log(`  - ${p.name}${active} (${p.holdings.length} holdings)`);
      });
      console.log('');
      break;

    case 'switch':
      if (args.length < 1) {
        console.log('Usage: portfolio switch <portfolio-name>');
        process.exit(1);
      }
      const pfName = args.join(' ');
      const pf = state.portfolios.find(p => p.name.toLowerCase() === pfName.toLowerCase());
      if (!pf) {
        console.log(`❌ Portfolio "${pfName}" not found`);
        process.exit(1);
      }
      state.activePortfolioId = pf.id;
      savePortfolio(state);
      console.log(`✅ Switched to "${pf.name}"`);
      break;

    case 'create':
      if (args.length < 1) {
        console.log('Usage: portfolio create <name>');
        process.exit(1);
      }
      const newName = args.join(' ');
      const newPf = {
        id: crypto.randomUUID(),
        name: newName,
        holdings: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      state.portfolios.push(newPf);
      state.activePortfolioId = newPf.id;
      savePortfolio(state);
      console.log(`✅ Created and switched to "${newName}"`);
      break;

    case 'value':
    case 'val':
      let tv = 0, tc = 0;
      for (const h of portfolio.holdings) {
        const priceData = await fetchPrice(h.symbol, h.type);
        const price = priceData?.price || h.purchasePrice;
        tv += price * h.quantity;
        tc += h.purchasePrice * h.quantity;
      }
      const pnl = tv - tc;
      console.log(`\n💰 ${portfolio.name}`);
      console.log(`   Value: $${tv.toFixed(2)}`);
      console.log(`   Cost:  $${tc.toFixed(2)}`);
      console.log(`   P&L:   ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${((pnl/tc)*100).toFixed(2)}%)\n`);
      break;

    case 'help':
    default:
      console.log(`
💰 Portfolio Tracker CLI

Usage: portfolio <command> [options]

Commands:
  list, ls                    List all holdings with values
  add <sym> <qty> <price> <name> [type]
                              Add a holding
  remove, rm <symbol>         Remove a holding
  value, val                  Show portfolio total value
  portfolios, pf              List all portfolios
  switch <name>               Switch to another portfolio
  create <name>               Create a new portfolio
  help                        Show this help

Examples:
  portfolio add AAPL 10 150 "Apple Inc." stock
  portfolio add BTC 0.5 45000 "Bitcoin" crypto
  portfolio remove AAPL
  portfolio switch "Crypto"
  portfolio create "My Portfolio"
`);
  }
}

run();
