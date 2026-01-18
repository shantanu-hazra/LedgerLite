'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import { generatePDF, downloadPDF } from '@/lib/pdf-generator';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  type: string;
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
}

interface Client {
  id: number;
  name: string;
  gst_in: string;
  address: string;
  email_id: string;
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const invoiceId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch('/api/invoices');
      const invoices = await response.json();
      const found = invoices.find((inv: Invoice) => inv.id === parseInt(invoiceId));

      if (!found) {
        router.push('/invoices');
        return;
      }

      setInvoice(found);

      // Fetch client details
      const clientRes = await fetch('/api/clients');
      const clients = await clientRes.json();
      const clientData = clients.find((c: Client) => c.id === found.client_id);
      setClient(clientData);
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      router.push('/invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice || !client) return;

    setDownloading(true);
    try {
      const blob = await generatePDF({
        title: 'INVOICE',
        number: invoice.invoice_number,
        clientName: client.name,
        date: new Date(invoice.issued_time).toLocaleDateString(),
        items: invoice.items,
        subtotal: invoice.subtotal,
        tax: invoice.tax_amount,
        taxPercentage: invoice.tax_amount > 0 ? 18 : 0, // Default to 18%
        total: invoice.total_cost,
        issuedBy: invoice.issued_by,
        notes: `GST IN: ${client.gst_in || 'N/A'}\nAddress: ${client.address || 'N/A'}`,
      });

      downloadPDF(blob, `${invoice.invoice_number}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!invoice) return;

    try {
      await fetch('/api/invoices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: invoice.id,
          status: newStatus,
        }),
      });

      setInvoice({ ...invoice, status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center text-muted-foreground">Loading invoice...</div>
      </AppLayout>
    );
  }

  if (!invoice || !client) {
    return (
      <AppLayout>
        <div className="text-center text-muted-foreground">Invoice not found</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/invoices"
              className="p-2 hover:bg-background rounded transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Invoice</h1>
              <p className="text-muted-foreground">{invoice.invoice_number}</p>
            </div>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>

        {/* Invoice Preview */}
        <div className="bg-card text-card-foreground rounded-lg border border-border p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-border">
            <div>
              <h2 className="text-3xl font-bold text-accent">INVOICE</h2>
              <p className="text-muted-foreground mt-2">{invoice.invoice_number}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">
                {new Date(invoice.issued_time).toLocaleDateString()}
              </p>
              <div className="mt-4">
                <select
                  value={invoice.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    invoice.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  <option value="draft">Draft</option>
                  <option value="issued">Issued</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-2">BILL TO</p>
              <p className="text-lg font-semibold">{client.name}</p>
              {client.gst_in && <p className="text-sm text-muted-foreground">GST: {client.gst_in}</p>}
              {client.address && <p className="text-sm text-muted-foreground">{client.address}</p>}
              {client.email_id && <p className="text-sm text-muted-foreground">{client.email_id}</p>}
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm font-medium mb-2">ISSUED BY</p>
              <p className="text-lg font-semibold">{invoice.issued_by}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 text-sm font-semibold text-muted-foreground">
                    Description
                  </th>
                  <th className="text-center py-3 text-sm font-semibold text-muted-foreground">
                    Qty
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-muted-foreground">
                    Rate
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-muted-foreground">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3">{item.description}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">${item.rate.toFixed(2)}</td>
                    <td className="text-right font-medium">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full md:w-64 space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.tax_amount > 0 && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Tax (18%):</span>
                  <span>${invoice.tax_amount.toFixed(2)}</span>
                </div>
              )}
              {invoice.discount_amount > 0 && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Discount:</span>
                  <span>-${invoice.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 bg-primary/10 px-4 rounded-lg">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-accent">
                  ${invoice.total_cost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Thank you for your business!
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
