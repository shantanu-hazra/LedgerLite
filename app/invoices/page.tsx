'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface Invoice {
  id: number;
  invoice_number: string;
  client_id: number;
  total_cost: number;
  status: string;
  issued_time: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const url =
        filter === 'all'
          ? '/api/invoices'
          : `/api/invoices?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await fetch(`/api/invoices?id=${id}`, { method: 'DELETE' });
        fetchInvoices();
      } catch (error) {
        console.error('Failed to delete invoice:', error);
      }
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your invoices
            </p>
          </div>
          <Link
            href="/invoices/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            New Invoice
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'draft', 'issued'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground border border-border hover:border-primary'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Invoices Table */}
        <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading invoices...
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No invoices found. Create one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-border hover:bg-background/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {invoice.invoice_number}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(invoice.issued_time).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        ${invoice.total_cost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/invoices/${invoice.id}`}
                            className="p-2 hover:bg-background rounded transition-colors text-muted-foreground hover:text-foreground"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            className="p-2 hover:bg-background rounded transition-colors text-muted-foreground hover:text-foreground"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(invoice.id)}
                            className="p-2 hover:bg-red-100 rounded transition-colors text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
