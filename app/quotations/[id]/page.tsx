'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { generatePDF, downloadPDF } from '@/lib/pdf-generator';

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  type: string;
}

interface Quotation {
  id: number;
  quotation_number: string;
  client_id: number;
  items: QuotationItem[];
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

export default function QuotationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const quotationId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    fetchQuotation();
  }, [quotationId]);

  const fetchQuotation = async () => {
    try {
      const response = await fetch('/api/quotations');
      const quotations = await response.json();
      const found = quotations.find((quote: Quotation) => quote.id === parseInt(quotationId));

      if (!found) {
        router.push('/quotations');
        return;
      }

      setQuotation(found);

      // Fetch client details
      const clientRes = await fetch('/api/clients');
      const clients = await clientRes.json();
      const clientData = clients.find((c: Client) => c.id === found.client_id);
      setClient(clientData);
    } catch (error) {
      console.error('Failed to fetch quotation:', error);
      router.push('/quotations');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!quotation || !client) return;

    setDownloading(true);
    try {
      const blob = await generatePDF({
        title: 'QUOTATION',
        number: quotation.quotation_number,
        clientName: client.name,
        date: new Date(quotation.issued_time).toLocaleDateString(),
        items: quotation.items,
        subtotal: quotation.subtotal,
        tax: quotation.tax_amount,
        taxPercentage: quotation.tax_amount > 0 ? 18 : 0,
        total: quotation.total_cost,
        issuedBy: quotation.issued_by,
        notes: `GST IN: ${client.gst_in || 'N/A'}\nAddress: ${client.address || 'N/A'}\n\nThis is a quotation and not an invoice. Please confirm before proceeding.`,
      });

      downloadPDF(blob, `${quotation.quotation_number}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!quotation) return;

    try {
      await fetch('/api/quotations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: quotation.id,
          status: newStatus,
        }),
      });

      setQuotation({ ...quotation, status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center text-muted-foreground">Loading quotation...</div>
      </AppLayout>
    );
  }

  if (!quotation || !client) {
    return (
      <AppLayout>
        <div className="text-center text-muted-foreground">Quotation not found</div>
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
              href="/quotations"
              className="p-2 hover:bg-background rounded transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Quotation</h1>
              <p className="text-muted-foreground">{quotation.quotation_number}</p>
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

        {/* Quotation Preview */}
        <div className="bg-card text-card-foreground rounded-lg border border-border p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-border">
            <div>
              <h2 className="text-3xl font-bold text-accent">QUOTATION</h2>
              <p className="text-muted-foreground mt-2">{quotation.quotation_number}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">
                {new Date(quotation.issued_time).toLocaleDateString()}
              </p>
              <div className="mt-4">
                <select
                  value={quotation.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    quotation.status === 'draft'
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
              <p className="text-muted-foreground text-sm font-medium mb-2">QUOTATION FOR</p>
              <p className="text-lg font-semibold">{client.name}</p>
              {client.gst_in && <p className="text-sm text-muted-foreground">GST: {client.gst_in}</p>}
              {client.address && <p className="text-sm text-muted-foreground">{client.address}</p>}
              {client.email_id && <p className="text-sm text-muted-foreground">{client.email_id}</p>}
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm font-medium mb-2">ISSUED BY</p>
              <p className="text-lg font-semibold">{quotation.issued_by}</p>
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
                {quotation.items.map((item, index) => (
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
                <span>${quotation.subtotal.toFixed(2)}</span>
              </div>
              {quotation.tax_amount > 0 && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Tax (18%):</span>
                  <span>${quotation.tax_amount.toFixed(2)}</span>
                </div>
              )}
              {quotation.discount_amount > 0 && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Discount:</span>
                  <span>-${quotation.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 bg-primary/10 px-4 rounded-lg">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-accent">
                  ${quotation.total_cost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              This is a quotation. Please confirm before proceeding to invoice.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
