'use client';

import React from "react"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, PackageOpen, Users, BarChart3, Settings } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-accent">Procura</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Billing System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          href="/dashboard"
          icon={<BarChart3 className="w-5 h-5" />}
          label="Dashboard"
          active={isActive('/dashboard')}
        />
        <NavLink
          href="/invoices"
          icon={<FileText className="w-5 h-5" />}
          label="Invoices"
          active={isActive('/invoices')}
        />
        <NavLink
          href="/quotations"
          icon={<FileText className="w-5 h-5" />}
          label="Quotations"
          active={isActive('/quotations')}
        />
        <NavLink
          href="/products"
          icon={<PackageOpen className="w-5 h-5" />}
          label="Products"
          active={isActive('/products')}
        />
        <NavLink
          href="/clients"
          icon={<Users className="w-5 h-5" />}
          label="Clients"
          active={isActive('/clients')}
        />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <NavLink
          href="/settings"
          icon={<Settings className="w-5 h-5" />}
          label="Settings"
          active={isActive('/settings')}
        />
      </div>
    </aside>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/20'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
