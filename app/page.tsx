'use client';

import React from "react"

import Link from 'next/link';
import { FileText, Package, Users, BarChart3, Zap, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-accent">Procura</div>
          <Link
            href="/dashboard"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Professional Billing,
              <span className="text-accent"> Offline-First</span>
            </h1>
            <p className="text-xl text-muted-foreground mt-6 max-w-2xl leading-relaxed">
              Procura is a desktop-first billing system designed for businesses that need
              professional invoices, quotations, and customer management—all working offline.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-8">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold inline-flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Launch App
            </Link>
            <a
              href="#features"
              className="px-8 py-3 border border-border text-foreground rounded-lg hover:bg-background/50 transition-colors font-semibold inline-flex items-center justify-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-card/50 border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Powerful Features</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Everything you need to manage your billing, organized and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-accent" />}
              title="Invoice Management"
              description="Create, track, and manage invoices with automatic calculations and templates."
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-accent" />}
              title="Quotations"
              description="Generate professional quotations and convert them to invoices effortlessly."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-accent" />}
              title="Client Database"
              description="Maintain a comprehensive client database with GST, discounts, and contact info."
            />
            <FeatureCard
              icon={<Package className="w-8 h-8 text-accent" />}
              title="Product Library"
              description="Organize products and services with pricing and HSN codes for quick invoice creation."
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-accent" />}
              title="PDF Generation"
              description="Export invoices and quotations as professional PDF files for sharing and archiving."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-accent" />}
              title="Offline-First"
              description="Work completely offline. Your data stays local and syncs when you're ready."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard number="∞" label="Invoices" description="Create unlimited invoices" />
          <StatCard number="100%" label="Offline" description="Works without internet" />
          <StatCard number="0" label="Cost" description="Completely free to use" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 border-y border-border py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your billing?</h2>
          <p className="text-muted-foreground mb-8">
            Get started with Procura today. No setup required, just open and start billing.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold gap-2"
          >
            <Zap className="w-5 h-5" />
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-accent">Procura</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Professional billing system for modern businesses
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">
                Built with care for your business needs
              </p>
              <p className="text-muted-foreground text-xs mt-2">© 2026 Procura. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function StatCard({
  number,
  label,
  description,
}: {
  number: string;
  label: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-8 text-center">
      <div className="text-4xl font-bold text-accent mb-2">{number}</div>
      <div className="text-lg font-semibold mb-1">{label}</div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
