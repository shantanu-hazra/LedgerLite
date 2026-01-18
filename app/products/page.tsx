'use client';

import React from "react"

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Plus, Edit2, Trash2, PackageOpen } from 'lucide-react';

interface Product {
  id: number;
  type: string;
  original_rate: number;
  hsn: string;
  created_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    original_rate: 0,
    hsn: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add product');

      setFormData({ type: '', original_rate: 0, hsn: '' });
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your product inventory and pricing
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            New Product
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <form
            onSubmit={handleAddProduct}
            className="bg-card text-card-foreground rounded-lg border border-border p-6"
          >
            <h2 className="text-lg font-bold mb-4">Add New Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Rate"
                min="0"
                step="0.01"
                value={formData.original_rate}
                onChange={(e) =>
                  setFormData({ ...formData, original_rate: parseFloat(e.target.value) })
                }
                required
                className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="HSN Code"
                value={formData.hsn}
                onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
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
                Add Product
              </button>
            </div>
          </form>
        )}

        {/* Products Table */}
        <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No products yet. Add one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      HSN Code
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Added
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border hover:bg-background/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <PackageOpen className="w-5 h-5 text-accent" />
                          <span className="font-medium text-foreground">{product.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        ${product.original_rate.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {product.hsn || '-'}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-background rounded transition-colors text-muted-foreground hover:text-foreground">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-100 rounded transition-colors text-red-600"
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
