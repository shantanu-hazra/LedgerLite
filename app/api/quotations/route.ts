import { NextRequest, NextResponse } from 'next/server';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  type: 'product' | 'service';
}

interface Quotation {
  id: number;
  quotation_number: string;
  client_id: number;
  items: QuoteItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_cost: number;
  issued_by: string;
  issued_time: string;
  status: string;
  pdf_id: string;
  created_at: string;
}

// In-memory storage
let quotations: Quotation[] = [];
let quoteIdCounter = 1;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');
  const status = searchParams.get('status');

  let filtered = quotations;

  if (clientId) {
    filtered = filtered.filter((quote) => quote.client_id === parseInt(clientId));
  }

  if (status) {
    filtered = filtered.filter((quote) => quote.status === status);
  }

  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    client_id,
    items,
    issued_by,
    tax_percentage = 0,
  } = body;

  if (!client_id || !items || items.length === 0) {
    return NextResponse.json(
      { error: 'Client ID and items are required' },
      { status: 400 }
    );
  }

  // Calculate totals
  const subtotal = items.reduce(
    (sum: number, item: QuoteItem) => sum + item.amount,
    0
  );
  const tax_amount = (subtotal * tax_percentage) / 100;
  const total_cost = subtotal + tax_amount;

  const quotation: Quotation = {
    id: quoteIdCounter++,
    quotation_number: `QT-${Date.now()}`,
    client_id,
    items,
    subtotal,
    tax_amount,
    discount_amount: 0,
    total_cost,
    issued_by: issued_by || 'System',
    issued_time: new Date().toISOString(),
    status: 'draft',
    pdf_id: '',
    created_at: new Date().toISOString(),
  };

  quotations.push(quotation);
  return NextResponse.json(quotation, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, status, items, tax_percentage = 0 } = body;

  if (!id) {
    return NextResponse.json(
      { error: 'Quotation ID is required' },
      { status: 400 }
    );
  }

  const index = quotations.findIndex((quote) => quote.id === id);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Quotation not found' },
      { status: 404 }
    );
  }

  const updatedQuote = { ...quotations[index] };

  if (items) {
    updatedQuote.items = items;
    const subtotal = items.reduce(
      (sum: number, item: QuoteItem) => sum + item.amount,
      0
    );
    updatedQuote.subtotal = subtotal;
    updatedQuote.tax_amount = (subtotal * tax_percentage) / 100;
    updatedQuote.total_cost = subtotal + updatedQuote.tax_amount;
  }

  if (status) {
    updatedQuote.status = status;
  }

  quotations[index] = updatedQuote;
  return NextResponse.json(updatedQuote);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'ID is required' },
      { status: 400 }
    );
  }

  const index = quotations.findIndex((quote) => quote.id === parseInt(id));
  if (index === -1) {
    return NextResponse.json(
      { error: 'Quotation not found' },
      { status: 404 }
    );
  }

  quotations.splice(index, 1);
  return NextResponse.json({ success: true });
}
