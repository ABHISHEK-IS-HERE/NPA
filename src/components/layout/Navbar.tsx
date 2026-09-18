'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, ExternalLink, Search, ShoppingBag } from 'lucide-react';

interface NavChild {
  id: number;
  label: string;
  path: string;
  isExternal: boolean;
  openInNewTab: boolean;
}

interface NavItemData {
  id: number;
  label: string;
  path: string;
  isExternal: boolean;
  openInNewTab: boolean;
  children?: NavChild[];
}

interface NavbarProps {
  items: NavItemData[];
}

export const Navbar: React.FC<NavbarProps> = ({ items }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && path !== '#' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md text-slate-800 sticky top-0 z-40 shadow-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {items.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const active = isActive(item.path);

              if (hasChildren) {
                return (
                  <div
                    key={item.id}
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(item.id)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        active
                          ? 'bg-primary-50 text-primary-900 font-semibold'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 text-slate-400" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute left-0 top-full pt-1.5 w-64 hidden group-hover:block transition-all z-50 animate-in fade-in-50 duration-150">
                      <div className="bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 text-slate-800 overflow-hidden ring-1 ring-black/5">
                        {item.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={child.path}
                            target={child.openInNewTab ? '_blank' : '_self'}
                            rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                            className={`flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-primary-50 hover:text-primary-800 transition-colors ${
                              pathname === child.path ? 'bg-primary-50 text-primary-800 font-semibold' : 'text-slate-700'
                            }`}
                          >
                            <span>{child.label}</span>
                            {child.isExternal && <ExternalLink className="w-3 h-3 text-slate-400" />}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  target={item.openInNewTab ? '_blank' : '_self'}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.isExternal && <ExternalLink className="w-3 h-3 text-slate-400" />}
                </Link>
              );
            })}
          </div>

          {/* Journal Store, Institutional PO & Search shortcuts in navbar */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/institutions"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                pathname === '/institutions'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300'
              }`}
              title="Institutional & Library Subscription Orders"
            >
              <span>🏛️ Libraries &amp; PO</span>
            </Link>

            <Link
              href="/publish-books"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                pathname === '/publish-books'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300'
              }`}
              title="Publish Academic Books, Edited Volumes & Monographs with ISBN"
            >
              <span>📚 Publish Books</span>
            </Link>

            <Link
              href="/store"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                pathname === '/store'
                  ? 'bg-primary-800 text-white font-bold'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-primary-700" />
              <span>Store</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Navigation Menu
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-slate-950 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDropdown === item.id;

            if (hasChildren) {
              return (
                <div key={item.id} className="py-1">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-primary-600' : 'text-slate-400'}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-md mt-1 border-l-2 border-primary-300">
                      {item.children?.map((child) => (
                        <Link
                          key={child.id}
                          href={child.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-2 text-xs font-medium text-slate-600 hover:text-primary-800 hover:bg-slate-100 rounded"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-200 mt-2 flex flex-col gap-2">
            <Link
              href="/store"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Periodical &amp; Issue Store</span>
            </Link>
            <Link
              href="/publish-books"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-2xs"
            >
              📚 Publish Academic Books (ISBN)
            </Link>
            <Link
              href="/institutions"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-md border border-amber-300"
            >
              🏛️ Institutional Proforma Invoice Generator
            </Link>
            <Link
              href="/ugc-api-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-md border border-emerald-300"
            >
              🧮 UGC CAS &amp; API Score Calculator
            </Link>
            <Link
              href="/dispatch-tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md border border-slate-300"
            >
              🚚 Track Speed Post Dispatch
            </Link>
            <Link
              href="/submit-paper"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-md shadow-2xs"
            >
              Submit Paper Online
            </Link>
            <Link
              href="/track-status"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md border border-slate-300"
            >
              Track Paper Status
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
