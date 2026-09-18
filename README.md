# National Research Journal of Business Economics (NRJBE)
### Academic Journal Publishing Portal & E-Commerce Storefront

A modern, full-stack academic journal web platform built for **National Research Journal of Business Economics (NRJBE)**, published by **National Press Associates (NPA)**.

The platform bridges academic credibility and digital commercial distribution by combining an **e-commerce periodical storefront** on the frontend with a **non-technical, task-oriented Admin Content Management System (CMS)** on the backend.

---

## ✨ Key Features

### 🛍️ 1. Scholarly E-Commerce Storefront
- **Realistic 3D Periodical Magazine Covers**: Rendered with bound volume depth, glossy sheen highlight reflections, gold-foil embossed ISSN (`2349-2015`), and Impact Factor (`6.74`).
- **Persistent Slide-Over Shopping Bag (`<CartDrawer />`)**:
  - Quantity stepper controls `[-]` and `[+]`.
  - Complimentary Speed Post postal shipping badge across India.
  - Real-time subtotal and tax calculation.
- **Dedicated Journal Store & Editions Catalog (`/store`)**:
  - Filterable catalog for **Physical Print Copies (₹450)**, **Annual Subscription Packages (₹3,500 - ₹6,500)**, and **Author Publication APC Bundles (₹1,800 - ₹2,300)**.
- **3-Step Checkout Flow**:
  1. **Customer & Delivery Info**: Postal address, pincode, email, and mobile.
  2. **Payment Methods**: Direct UPI QR Code (`editornrjbe@okhdfcbank`), NEFT/IMPS Bank Details, and Institutional Purchase Order / Cheque.
  3. **Order Confirmation**: Generates unique order slip (`NRJBE-ORD-XXXX`), printable receipt, and 1-click WhatsApp order confirmation.

---

### 🛡️ 2. "Boring But Easy to Use" Non-Technical Admin CMS
- **Task-Oriented Dashboard (`/admin`)**:
  - Replaces developer jargon with 8 prominent *"What would you like to do today?"* action cards.
- **Customer Order & Dispatch Management (`/admin/subscriptions`)**:
  - Real-time order queue with itemized purchase breakdown.
  - One-click status transitions (*Pending &rarr; Paid &rarr; Dispatched &rarr; Delivered*).
  - India Post Speed Post tracking number assignment.
  - **1-Click WhatsApp Customer Messaging**: Sends pre-composed order updates directly to the customer's WhatsApp without manual typing.
- **Tabbed Settings Console (`/admin/settings`)**:
  - Single-page management of phone numbers, email, WhatsApp, APC rates, journal identity, and announcement ticker.
- **Issues & Covers Manager (`/admin/issues`)**:
  - Upload front cover images and adjust physical print prices per volume.

---

### 🧾 3. Official Tax Invoices & Cash Receipts (`/order/[orderNumber]/invoice`)
- Print-ready and downloadable A4 tax invoices with full publisher letterhead (*National Press Associates*).
- Formatted with official publication particulars: HSN/SAC Code `4902` (Periodicals & Journals - GST Exempted), Order ID, and Invoice Date.
- Displays live Speed Post consignment tracking number (`ED829104829IN`).
- Official publisher seal graphic and Authorized Signatory sign-off line.

---

### 🎖️ 4. Author Certificate & Acceptance Letter Generator
- Built-in generator in `/admin/certificate/[type]/[id]` for published papers and accepted submissions:
  - **Certificate of Publication**: Ornate academic border in navy and gold, corner flourishes, watermark crest, author particulars, Zenodo DOI, and embossed circular gold medal seal.
  - **Official Letter of Acceptance**: Formal publisher letterhead with Reference Number (`NRJBE/ACCEPT/2026/XXXX`) for faculty CAS / API promotion scoring and university thesis clearance.
  - Features quick-edit fields, 1-click PDF printing, and 1-click WhatsApp document sharing.

---

### 🔬 5. Academic Core & Search Engine Indexing
- **Current Issue & Archives**: Full paper previews, abstract summaries, author affiliations, and PDF downloads.
- **Citation Generator**: 1-click BibTeX, APA, MLA, and Chicago citation copying.
- **Google Scholar & CrossRef Metadata**: Standardized `<meta name="citation_*">` tags for automated scholarly web crawling.
- **Online Manuscript Submission**: Author submission portal (`/submit-paper`) with online status tracking (`/track-status`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with SQLite (`dev.db`)
- **Authentication**: JWT session tokens via `jose` and `bcryptjs`
- **Tunnels & Live Demo**: Cloudflare Quick Tunnels (`cloudflared`) & Pinggy

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

3. **Initialize the database**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build and run for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔑 Default Credentials

- **Admin Login URL**: `/admin/login`
- **Email**: `admin@nrjbe.in`
- **Password**: `admin123`

---

## 📄 License & Intellectual Property

Copyright © 2026 Abhishek. All rights reserved.

This repository and its contents are provided for portfolio and
evaluation purposes only. No permission is granted to copy, modify,
distribute, sublicense, or commercially use this project or substantial
portions of its source code without prior written permission from the
copyright holder.

Third-party libraries, frameworks, assets, and dependencies remain
subject to their respective licenses.
