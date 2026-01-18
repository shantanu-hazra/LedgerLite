import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demonstration
let products: Array<{
  id: number;
  type: string;
  original_rate: number;
  hsn: string;
  created_at: string;
}> = [];

let productIdCounter = 1;

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, original_rate, hsn } = body;

  if (!type || !original_rate) {
    return NextResponse.json(
      { error: 'Type and original_rate are required' },
      { status: 400 }
    );
  }

  const product = {
    id: productIdCounter++,
    type,
    original_rate,
    hsn: hsn || '',
    created_at: new Date().toISOString(),
  };

  products.push(product);
  return NextResponse.json(product, { status: 201 });
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

  const index = products.findIndex((p) => p.id === parseInt(id));
  if (index === -1) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }

  products.splice(index, 1);
  return NextResponse.json({ success: true });
}
