/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { getGlobalSiteData } from '@/lib/getSiteData';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { AnnouncementTicker } from '@/components/layout/AnnouncementTicker';
import { Footer } from '@/components/layout/Footer';

import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const revalidate = 0; // Fresh site settings & navigation on every load

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, navItems, sisterJournals, announcements } = await getGlobalSiteData();

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <TopBar settings={settings} />
        <Header settings={settings} />
        <Navbar items={navItems} />
        <AnnouncementTicker
          announcements={announcements}
          defaultBannerText={settings.bannerText}
          isActive={settings.bannerActive}
        />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} sisterJournals={sisterJournals} />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
