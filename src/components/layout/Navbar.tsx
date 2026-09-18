'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, ExternalLink, Search, ShoppingBag, BookOpen, Building2, Calculator, Truck } from 'lucide-react';

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

  // Strip any accidental emojis from seeded label strings
  const cleanLabel = (text: string) => {
    return text.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])|[\u2600-\u27BF]/g, '').trim();
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md text-stone-800 sticky top-0 z-40 border-b border-stone-200/90 shadow-2xs">
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
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                        active
                          ? 'bg-stone-100 text-stone-900 font-semibold'
                          : 'text-stone-700 hover:bg-stone-50 hover:text-stone-950'
                      }`}
                    >
                      <span>{cleanLabel(item.label)}</span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 text-stone-400" strokeWidth={1.5} />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute left-0 top-full pt-1.5 w-64 hidden group-hover:block transition-all z-50 animate-in fade-in-50 duration-150">
                      <div className="bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 text-stone-800 overflow-hidden ring-1 ring-black/5">
                        {item.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={child.path}
                            target={child.openInNewTab ? '_blank' : '_self'}
                            rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                            className={`flex items-center justify-between px-4 py-2.5 text-xs font-medium hover:bg-stone-50 hover:text-stone-950 transition-colors ${
                              pathname === child.path ? 'bg-stone-50 text-stone-900 font-semibold' : 'text-stone-600'
                            }`}
                          >
                            <span>{cleanLabel(child.label)}</span>
                            {child.isExternal && <ExternalLink className="w-3 h-3 text-stone-400" strokeWidth={1.5} />}
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
                  className={`inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                    active
                      ? 'bg-stone-100 text-stone-900 font-semibold'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-stone-950'
                  }`}
                >
                  <span>{cleanLabel(item.label)}</span>
                  {item.isExternal && <ExternalLink className="w-3 h-3 text-stone-400" strokeWidth={1.5} />}
                </Link>
              );
            })}
          </div>

          {/* Journal Store, Institutional PO & Shortcuts */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/institutions"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathname === '/institutions'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200'
              }`}
              title="Institutional & Library Subscription Orders"
            >
              <Building2 className="w-3.5 h-3.5 text-stone-500" strokeWidth={1.5} />
              <span>Library Acquisition</span>
            </Link>

            <Link
              href="/publish-books"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathname === '/publish-books'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200'
              }`}
              title="Publish Academic Books, Edited Volumes & Monographs with ISBN"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-500" strokeWidth={1.5} />
              <span>Publish Books</span>
            </Link>

            <Link
              href="/store"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathname === '/store'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-stone-500" strokeWidth={1.5} />
              <span>Store</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Journal Index &amp; Navigation
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-700 hover:text-stone-950 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDropdown === item.id;

            if (hasChildren) {
              return (
                <div key={item.id} className="py-1">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 rounded-md"
                  >
                    <span>{cleanLabel(item.label)}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180 text-stone-900' : 'text-stone-400'}`}
                      strokeWidth={1.5}
                    />
                  </button>

                  {isOpen && (
                    <div className="pl-4 pr-2 py-1 space-y-1 bg-stone-50/70 rounded-md mt-1 border-l-2 border-stone-300">
                      {item.children?.map((child) => (
                        <Link
                          key={child.id}
                          href={child.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-1.5 text-xs text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded"
                        >
                          {cleanLabel(child.label)}
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
                className={`block px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-stone-100 text-stone-950 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50 hover:text-stone-950'
                }`}
              >
                {cleanLabel(item.label)}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-stone-200 mt-2 flex flex-col gap-2">
            <Link
              href="/store"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Print Edition Bookstore</span>
            </Link>
            <Link
              href="/publish-books"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-medium rounded-lg border border-stone-200 flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-600" strokeWidth={1.5} />
              <span>Publish Academic Books (ISBN)</span>
            </Link>
            <Link
              href="/institutions"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-medium rounded-lg border border-stone-200 flex items-center justify-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-stone-600" strokeWidth={1.5} />
              <span>Library Proforma Invoicing</span>
            </Link>
            <Link
              href="/ugc-api-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-medium rounded-lg border border-stone-200 flex items-center justify-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5 text-stone-600" strokeWidth={1.5} />
              <span>UGC CAS &amp; API Score Calculator</span>
            </Link>
            <Link
              href="/dispatch-tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-medium rounded-lg border border-stone-200 flex items-center justify-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-stone-600" strokeWidth={1.5} />
              <span>Track Speed Post Dispatch</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
