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
    <nav className="bg-navy-950 text-white sticky top-0 z-40 shadow-md border-b border-navy-800">
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
                          ? 'bg-primary-900 text-white'
                          : 'text-slate-200 hover:bg-navy-800 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 text-slate-400" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute left-0 top-full pt-1.5 w-64 hidden group-hover:block transition-all z-50 animate-in fade-in-50 duration-150">
                      <div className="bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 text-slate-800 overflow-hidden">
                        {item.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={child.path}
                            target={child.openInNewTab ? '_blank' : '_self'}
                            rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                            className={`flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-primary-50 hover:text-primary-700 transition-colors ${
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
                      ? 'bg-primary-700 text-white font-semibold'
                      : 'text-slate-200 hover:bg-navy-800 hover:text-white'
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
                  ? 'bg-amber-500 text-navy-950 font-bold'
                  : 'text-amber-200 bg-navy-900 hover:bg-navy-800 border border-amber-500/40'
              }`}
            >
              <span>🏛️ For Libraries &amp; PO</span>
            </Link>

            <Link
              href="/store"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                pathname === '/store'
                  ? 'bg-amber-500 text-navy-950 font-bold'
                  : 'text-slate-200 bg-navy-900 hover:bg-navy-800 border border-navy-700'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Store</span>
            </Link>

            <Link
              href="/current-issue#search-articles"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-navy-900 hover:bg-navy-800 rounded-md border border-navy-700 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search DOIs</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Navigation Menu
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-navy-800 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-900 border-t border-navy-800 px-4 pt-2 pb-6 space-y-1">
          {items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDropdown === item.id;

            if (hasChildren) {
              return (
                <div key={item.id} className="py-1">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-200 hover:bg-navy-800 rounded-md"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-primary-400' : 'text-slate-400'}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pl-4 pr-2 py-1 space-y-1 bg-navy-950/60 rounded-md mt-1">
                      {item.children?.map((child) => (
                        <Link
                          key={child.id}
                          href={child.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-800 rounded"
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
                    ? 'bg-primary-700 text-white font-semibold'
                    : 'text-slate-200 hover:bg-navy-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-navy-800 mt-2 flex flex-col gap-2">
            <Link
              href="/submit-paper"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-primary-700 text-white text-xs font-semibold rounded-md"
            >
              Submit Paper Online
            </Link>
            <Link
              href="/track-status"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-navy-800 text-slate-200 text-xs font-medium rounded-md border border-navy-700"
            >
              Track Paper Status
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
