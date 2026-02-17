import { NextResponse } from 'next/server';
import { 
  getActivePortfolio, 
  createPortfolio, 
  deletePortfolio, 
  setActivePortfolio, 
  loadPortfolio,
  addHolding, 
  updateHolding, 
  removeHolding,
  exportToCsv 
} from '@/lib/storage';
import { Holding, Portfolio } from '@/lib/types';

export async function GET() {
  const portfolio = getActivePortfolio();
  const state = loadPortfolio();
  return NextResponse.json({
    portfolio,
    portfolios: state.portfolios,
    activePortfolioId: state.activePortfolioId,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.action === 'createPortfolio') {
      const portfolio = createPortfolio(body.name);
      return NextResponse.json(portfolio, { status: 201 });
    }
    
    if (body.action === 'setActive') {
      const portfolio = setActivePortfolio(body.id);
      if (!portfolio) {
        return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
      }
      return NextResponse.json(portfolio);
    }
    
    if (body.action === 'deletePortfolio') {
      const success = deletePortfolio(body.id);
      if (!success) {
        return NextResponse.json({ error: 'Cannot delete last portfolio' }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }
    
    const holding = addHolding({
      symbol: body.symbol,
      name: body.name,
      type: body.type,
      quantity: body.quantity,
      purchasePrice: body.purchasePrice,
      purchaseDate: body.purchaseDate,
    });
    return NextResponse.json(holding, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, updates } = await request.json();
    const holding = updateHolding(id, updates);
    if (!holding) {
      return NextResponse.json({ error: 'Holding not found' }, { status: 404 });
    }
    return NextResponse.json(holding);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update holding' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const success = removeHolding(id);
    if (!success) {
      return NextResponse.json({ error: 'Holding not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove holding' }, { status: 500 });
  }
}
