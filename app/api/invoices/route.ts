import { NextRequest, NextResponse } from 'next/server';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  type: 'product' | 'service';
}

interface Invoice {
  id: number;
  invoice_number: string;
  client_id: number;
  items: InvoiceItem[];
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
let invoices: Invoice[] = [];
let invoiceIdCounter = 1;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');
  const status = searchParams.get('status');

  let filtered = invoices;

  if (clientId) {
    filtered = filtered.filter((inv) => inv.client_id === parseInt(clientId));
  }

  if (status) {
    filtered = filtered.filter((inv) => inv.status === status);
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
    (sum: number, item: InvoiceItem) => sum + item.amount,
    0
  );
  const tax_amount = (subtotal * tax_percentage) / 100;
  const total_cost = subtotal + tax_amount;

  const invoice: Invoice = {
    id: invoiceIdCounter++,
    invoice_number: `INV-${Date.now()}`,
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

  invoices.push(invoice);
  return NextResponse.json(invoice, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, status, items, tax_percentage = 0 } = body;

  if (!id) {
    return NextResponse.json(
      { error: 'Invoice ID is required' },
      { status: 400 }
    );
  }

  const index = invoices.findIndex((inv) => inv.id === id);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Invoice not found' },
      { status: 404 }
    );
  }

  const updatedInvoice = { ...invoices[index] };

  if (items) {
    updatedInvoice.items = items;
    const subtotal = items.reduce(
      (sum: number, item: InvoiceItem) => sum + item.amount,
      0
    );
    updatedInvoice.subtotal = subtotal;
    updatedInvoice.tax_amount = (subtotal * tax_percentage) / 100;
    updatedInvoice.total_cost = subtotal + updatedInvoice.tax_amount;
  }

  if (status) {
    updatedInvoice.status = status;
  }

  invoices[index] = updatedInvoice;
  return NextResponse.json(updatedInvoice);
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

  const index = invoices.findIndex((inv) => inv.id === parseInt(id));
  if (index === -1) {
    return NextResponse.json(
      { error: 'Invoice not found' },
      { status: 404 }
    );
  }

  invoices.splice(index, 1);
  return NextResponse.json({ success: true });
}
