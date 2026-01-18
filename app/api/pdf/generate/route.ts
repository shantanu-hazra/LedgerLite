import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      number,
      clientName,
      date,
      items,
      subtotal,
      tax,
      taxPercentage,
      total,
      issuedBy,
      notes,
    } = body;

    // Validate required fields
    if (!title || !number || !clientName || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Return metadata for client-side PDF generation
    // In a real app, you might use a server-side library like puppeteer
    return NextResponse.json(
      {
        success: true,
        message: 'PDF generation parameters validated',
        data: {
          title,
          number,
          clientName,
          date,
          items,
          subtotal,
          tax,
          taxPercentage,
          total,
          issuedBy,
          notes,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
