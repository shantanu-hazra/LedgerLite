import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demonstration
let clients: Array<{
  id: number;
  name: string;
  gst_in: string;
  address: string;
  email_id: string;
  discount_value: number;
  created_at: string;
}> = [];

let clientIdCounter = 1;

export async function GET() {
  return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, gst_in, address, email_id, discount_value } = body;

  if (!name) {
    return NextResponse.json(
      { error: 'Client name is required' },
      { status: 400 }
    );
  }

  const discount = discount_value || 0;
  if (discount < 0 || discount > 15) {
    return NextResponse.json(
      { error: 'Discount must be between 0 and 15%' },
      { status: 400 }
    );
  }

  const client = {
    id: clientIdCounter++,
    name,
    gst_in: gst_in || '',
    address: address || '',
    email_id: email_id || '',
    discount_value: discount,
    created_at: new Date().toISOString(),
  };

  clients.push(client);
  return NextResponse.json(client, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, name, gst_in, address, email_id, discount_value } = body;

  if (!id) {
    return NextResponse.json(
      { error: 'Client ID is required' },
      { status: 400 }
    );
  }

  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Client not found' },
      { status: 404 }
    );
  }

  const discount = discount_value !== undefined ? discount_value : clients[index].discount_value;
  if (discount < 0 || discount > 15) {
    return NextResponse.json(
      { error: 'Discount must be between 0 and 15%' },
      { status: 400 }
    );
  }

  clients[index] = {
    ...clients[index],
    name: name || clients[index].name,
    gst_in: gst_in !== undefined ? gst_in : clients[index].gst_in,
    address: address !== undefined ? address : clients[index].address,
    email_id: email_id !== undefined ? email_id : clients[index].email_id,
    discount_value: discount,
  };

  return NextResponse.json(clients[index]);
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

  const index = clients.findIndex((c) => c.id === parseInt(id));
  if (index === -1) {
    return NextResponse.json(
      { error: 'Client not found' },
      { status: 404 }
    );
  }

  clients.splice(index, 1);
  return NextResponse.json({ success: true });
}
