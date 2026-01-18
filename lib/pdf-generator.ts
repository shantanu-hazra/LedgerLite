export interface PDFGeneratorOptions {
  title: string;
  number: string;
  clientName: string;
  date: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  taxPercentage: number;
  total: number;
  issuedBy?: string;
  notes?: string;
}

export async function generatePDF(options: PDFGeneratorOptions): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Header
  doc.setFontSize(24);
  doc.setTextColor(45, 120, 200); // Primary color
  doc.text(options.title, margin, margin + 10);

  // Company Info (top right)
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const rightX = pageWidth - margin;
  doc.text(`${options.title} #: ${options.number}`, rightX, margin + 5, { align: 'right' });
  doc.text(`Date: ${options.date}`, rightX, margin + 12, { align: 'right' });

  // Client Section
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.text('Bill To:', margin, margin + 25);

  doc.setFontSize(10);
  doc.text(options.clientName, margin, margin + 32);
  if (options.issuedBy) {
    doc.setTextColor(100, 100, 100);
    doc.text(`Issued By: ${options.issuedBy}`, margin, margin + 39);
  }

  // Items Table
  const tableData = options.items.map((item) => [
    item.description,
    item.quantity.toString(),
    `$${item.rate.toFixed(2)}`,
    `$${item.amount.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: margin + 50,
    head: [['Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    margin: margin,
    didDrawPage: () => {
      // Footer page numbers if needed
    },
    headStyles: {
      fillColor: [45, 120, 200],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  const tableEndY = (doc as any).lastAutoTable.finalY;

  // Totals Section
  doc.setFontSize(10);
  const totalX = pageWidth - margin - 50;

  doc.setTextColor(100, 100, 100);
  doc.text('Subtotal:', totalX, tableEndY + 10);
  doc.text('Tax (' + options.taxPercentage + '%):', totalX, tableEndY + 17);

  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.text(`$${options.subtotal.toFixed(2)}`, pageWidth - margin, tableEndY + 10, {
    align: 'right',
  });
  doc.text(`$${options.tax.toFixed(2)}`, pageWidth - margin, tableEndY + 17, {
    align: 'right',
  });

  // Total Line
  doc.setDrawColor(200, 200, 200);
  doc.line(totalX, tableEndY + 24, pageWidth - margin, tableEndY + 24);

  doc.setFontSize(12);
  doc.setTextColor(45, 120, 200);
  doc.setFont(undefined, 'bold');
  doc.text('Total:', totalX, tableEndY + 32);
  doc.text(`$${options.total.toFixed(2)}`, pageWidth - margin, tableEndY + 32, {
    align: 'right',
  });

  // Notes/Terms
  if (options.notes) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Notes:', margin, tableEndY + 50);
    doc.setFont(undefined, 'normal');
    const splitText = doc.splitTextToSize(options.notes, pageWidth - margin * 2);
    doc.text(splitText, margin, tableEndY + 57);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Thank you for your business!',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  return doc.output('blob');
}

export async function downloadPDF(blob: Blob, filename: string): Promise<void> {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
