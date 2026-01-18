import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demonstration
let services: Array<{
  id: number;
  type: string;
  original_cost: number;
  hsn: string;
  created_at: string;
}> = [];

let serviceIdCounter = 1;

export async function GET() {
  return NextResponse.json(services);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, original_cost, hsn } = body;

  if (!type || !original_cost) {
    return NextResponse.json(
      { error: 'Type and original_cost are required' },
      { status: 400 }
    );
  }

  const service = {
    id: serviceIdCounter++,
    type,
    original_cost,
    hsn: hsn || '',
    created_at: new Date().toISOString(),
  };

  services.push(service);
  return NextResponse.json(service, { status: 201 });
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

  const index = services.findIndex((s) => s.id === parseInt(id));
  if (index === -1) {
    return NextResponse.json(
      { error: 'Service not found' },
      { status: 404 }
    );
  }

  services.splice(index, 1);
  return NextResponse.json({ success: true });
}
