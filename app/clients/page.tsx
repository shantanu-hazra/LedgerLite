'use client';

import React from "react"

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Plus, Edit2, Trash2, Mail } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  gst_in: string;
  address: string;
  email_id: string;
  discount_value: number;
  created_at: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gst_in: '',
    address: '',
    email_id: '',
    discount_value: 0,
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add client');

      setFormData({
        name: '',
        gst_in: '',
        address: '',
        email_id: '',
        discount_value: 0,
      });
      setShowForm(false);
      fetchClients();
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
        fetchClients();
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground mt-1">
              Manage your customer database
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            New Client
          </button>
        </div>

        {/* Add Client Form */}
        {showForm && (
          <form
            onSubmit={handleAddClient}
            className="bg-card text-card-foreground rounded-lg border border-border p-6"
          >
            <h2 className="text-lg font-bold mb-4">Add New Client</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Client Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="GST IN"
                value={formData.gst_in}
                onChange={(e) => setFormData({ ...formData, gst_in: e.target.value })}
                className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email_id}
                onChange={(e) => setFormData({ ...formData, email_id: e.target.value })}
                className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Discount %"
                min="0"
                max="15"
                value={formData.discount_value}
                onChange={(e) =>
                  setFormData({ ...formData, discount_value: parseFloat(e.target.value) })
                }
                className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <textarea
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-background text-foreground border border-border rounded-lg hover:bg-background/80 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Add Client
              </button>
            </div>
          </form>
        )}

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading clients...</div>
          ) : clients.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No clients yet. Add one to get started.
            </div>
          ) : (
            clients.map((client) => (
              <div
                key={client.id}
                className="bg-card text-card-foreground rounded-lg border border-border p-6 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">{client.name}</h3>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-background rounded transition-colors text-muted-foreground hover:text-foreground">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="p-2 hover:bg-red-100 rounded transition-colors text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {client.gst_in && (
                    <p>
                      <span className="text-muted-foreground">GST:</span>{' '}
                      <span className="font-medium">{client.gst_in}</span>
                    </p>
                  )}
                  {client.email_id && (
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{client.email_id}</span>
                    </p>
                  )}
                  {client.address && (
                    <p>
                      <span className="text-muted-foreground">Address:</span>
                      <br />
                      <span className="font-medium">{client.address}</span>
                    </p>
                  )}
                  {client.discount_value > 0 && (
                    <p>
                      <span className="text-muted-foreground">Discount:</span>{' '}
                      <span className="font-medium text-accent">
                        {client.discount_value}%
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
