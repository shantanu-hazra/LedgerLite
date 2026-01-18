'use client';

import React from "react"

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import {
  TrendingUp,
  FileText,
  DollarSign,
  Clock,
} from 'lucide-react';

interface Invoice {
  id: number;
  invoice_number: string;
  client_id: number;
  total_cost: number;
  status: string;
  issued_time: string;
}

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingAmount: 0,
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      const data = await response.json();
      setInvoices(data);

      // Calculate stats
      const totalRevenue = data.reduce(
        (sum: number, inv: Invoice) => sum + inv.total_cost,
        0
      );

      setStats({
        totalInvoices: data.length,
        totalRevenue,
        pendingAmount: data
          .filter((inv: Invoice) => inv.status === 'draft')
          .reduce((sum: number, inv: Invoice) => sum + inv.total_cost, 0),
      });
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back to Procura. Here is your billing overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Invoices"
            value={stats.totalInvoices}
            icon={<FileText className="w-6 h-6" />}
            color="text-accent"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={<DollarSign className="w-6 h-6" />}
            color="text-primary"
          />
          <StatCard
            title="Pending Amount"
            value={`$${stats.pendingAmount.toFixed(2)}`}
            icon={<Clock className="w-6 h-6" />}
            color="text-orange-500"
          />
        </div>

        {/* Recent Invoices */}
        <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Invoices</h2>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>

          {invoices.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No invoices yet. Create your first invoice to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {invoices.slice(0, 5).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <div>
                    <p className="font-semibold text-foreground">
                      {invoice.invoice_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.issued_time).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ${invoice.total_cost.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        invoice.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`${color}`}>{icon}</div>
      </div>
    </div>
  );
}
