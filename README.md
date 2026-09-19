# National Research Journal of Business Economics (NRJBE)
### Academic Journal Publishing Portal & Scholarly Storefront

A modern, full-stack academic journal web platform built for **National Research Journal of Business Economics (NRJBE)**, published by **National Press Associates (NPA)**.

The platform bridges academic credibility and digital commercial distribution by combining an **e-commerce periodical storefront** on the frontend with a **non-technical, task-oriented Admin Content Management System (CMS)** on the backend.

---

## ✨ Key Features

### 🛍️ 1. Scholarly E-Commerce Storefront
- **Realistic 3D Periodical Magazine Covers**: Rendered with bound volume depth, glossy sheen highlight reflections, gold-foil embossed ISSN (`2349-2015`), and Impact Factor (`6.74`).
- **Persistent Slide-Over Shopping Bag (`<CartDrawer />`)**:
  - Quantity stepper controls `[-]` and `[+]`.
  - Complimentary Speed Post postal shipping badge across India.
  - Real-time subtotal and currency conversion (INR / USD).
- **Dedicated Journal Store & Editions Catalog (`/store`)**:
  - Filterable catalog for **Physical Print Copies (₹450)**, **Annual Subscription Packages (₹3,500 - ₹6,500)**, and **Author Publication APC Bundles (₹1,800 - ₹2,300)**.
- **3-Step Checkout Flow**:
  1. **Customer & Delivery Info**: Postal address, pincode, email, and mobile.
  2. **Payment Methods**: Direct UPI QR Code (`editornrjbe@okhdfcbank`), NEFT/IMPS Bank Details, and Institutional Purchase Order / Cheque.
  3. **Order Confirmation**: Generates unique order slip (`NRJBE-ORD-XXXX`), printable receipt, and 1-click WhatsApp order confirmation.

---

### 🛡️ 2. Non-Technical Admin CMS
- **Task-Oriented Dashboard (`/admin`)**:
  - 8 prominent *"What would you like to do today?"* action cards.
  - Real-time aggregation of articles, volumes, issues, submissions, and customer orders.
- **Edge Middleware Authentication**:
  - Next.js edge middleware guards all `/admin/*` routes.
  - JWT session tokens via `jose` and `bcryptjs` with `httpOnly` secure cookies.
  - In-memory rate limiting and brute force throttling on login.
- **Customer Order & Dispatch Management (`/admin/subscriptions`)**:
  - Order queue with itemized purchase breakdown.
  - Status transitions (*Pending &rarr; Paid &rarr; Dispatched &rarr; Delivered*).
  - India Post Speed Post tracking number assignment.
  - **1-Click WhatsApp Customer Messaging**: Sends pre-composed order updates directly to the customer's WhatsApp.
- **Tabbed Settings Console (`/admin/settings`)**:
  - Management of phone numbers, email, WhatsApp, APC rates, journal identity, and announcement ticker.
- **Issues & Covers Manager (`/admin/issues`)**:
  - Upload front cover images and adjust physical print prices per volume.

---

### 🧾 3. Official Tax Invoices & Cash Receipts (`/order/[orderNumber]/invoice`)
- Print-ready and downloadable A4 tax invoices with full publisher letterhead (*National Press Associates*).
- Formatted with official publication particulars: HSN/SAC Code `4902` (Periodicals & Journals - GST Exempted), Order ID, and Invoice Date.
- Displays live Speed Post consignment tracking number.
- Official publisher seal graphic and Authorized Signatory sign-off line.

---

### 🎖️ 4. Author Certificate & Acceptance Letter Generator
- Built-in generator in `/admin/certificate/[type]/[id]` for published papers and accepted submissions:
  - **Certificate of Publication**: Ornate academic border in navy and gold, corner flourishes, watermark crest, author particulars, Zenodo DOI, and embossed circular gold medal seal.
  - **Official Letter of Acceptance**: Formal publisher letterhead with Reference Number for faculty CAS / API promotion scoring and university thesis clearance.
  - 1-click PDF printing and 1-click WhatsApp document sharing.

---

### 🔬 5. Academic Core & Search Engine Indexing
- **Current Issue & Archives**: Full paper previews, abstract summaries, author affiliations, and PDF downloads.
- **Citation Generator**: 1-click BibTeX and APA 7th edition citation copying.
- **Google Scholar & CrossRef Metadata**: Standardized `<meta name="citation_*">` tags for automated scholarly web crawling.
- **Dynamic XML Sitemap & Robots.txt**: Auto-generated `sitemap.xml` and `robots.txt` for search engines.
- **Structured Data**: JSON-LD schema markup (`Periodical`, `PublishingHouse`).
- **Online Manuscript Submission**: Author submission portal (`/submit-paper`) with online status tracking (`/track-status`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) (PostgreSQL / SQLite)
- **Authentication**: Edge JWT via `jose` and `bcryptjs`
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone git@github.com:ABHISHEK-IS-HERE/NPA.git
   cd NPA
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and configure your database URL and JWT secret:
   ```bash
   cp .env.example .env
   ```

4. **Initialize the database**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔑 Administrator Access

- **Admin Login URL**: `/admin/login`
- Initial administrator credentials are set during database seeding (`prisma/seed.ts`).
- For security in production, always update the default admin password immediately upon first login via the admin profile console or seed configuration.

---

## 📄 License & Intellectual Property

Copyright © 2026 Abhishek. All rights reserved.

This repository and its contents are provided for portfolio and
evaluation purposes only. No permission is granted to copy, modify,
distribute, sublicense, or commercially use this project or substantial
portions of its source code without prior written permission from the
copyright holder.
