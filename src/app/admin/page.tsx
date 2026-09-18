import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';
import {
  FileText,
  Layers,
  Inbox,
  CreditCard,
  PlusCircle,
  Settings,
  Menu,
  Phone,
  DollarSign,
  Image,
  FileCode,
  Bell,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [
    totalArticles,
    totalVolumes,
    totalIssues,
    pendingSubmissions,
    totalOrders,
    recentOrders,
    recentSubmissions,
    settings,
  ] = await Promise.all([
    db.article.count(),
    db.volume.count(),
    db.issue.count(),
    db.submission.count({ where: { status: 'Submitted' } }),
    db.subscriptionOrder.count(),
    db.subscriptionOrder.findMany({
      take: 5,
      orderBy: { id: 'desc' },
    }),
    db.submission.findMany({
      take: 5,
      orderBy: { submittedAt: 'desc' },
    }),
    db.siteSetting.findFirst({ where: { id: 1 } }),
  ]);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-navy-950 via-primary-950 to-navy-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-navy-950 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Journal Content Manager
            </span>
            <span className="text-xs text-slate-300">
              ISSN: <strong>{settings?.issn || '2349-2015'}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Welcome, Journal Administrator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            This control panel is designed to let you easily update website texts, contact phone numbers, subscription prices, menu links, and published articles without needing any technical knowledge.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-white/20 transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>
      </div>

      {/* "What would you like to do today?" - Task Oriented Action Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-serif font-bold text-navy-900">
            What would you like to do today?
          </h2>
          <p className="text-xs text-slate-500">
            Click on any task below to make changes directly:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Contacts */}
          <Link
            href="/admin/settings"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                1. Change Contact Info
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Update phone numbers, WhatsApp helpline, editorial email, or dispatch address.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-primary-700 group-hover:underline mt-4 inline-flex items-center gap-1">
              <span>Edit Contacts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Action 2: Prices & Subscriptions */}
          <Link
            href="/admin/subscriptions"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                2. Change Prices &amp; Orders
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Set physical print copy price (₹450), annual subscription fee, or check customer orders.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-primary-700 group-hover:underline mt-4 inline-flex items-center gap-1">
              <span>Manage Pricing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Action 3: Issues & Covers */}
          <Link
            href="/admin/issues"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                3. Journal Issues &amp; Covers
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Create new volumes/issues, upload magazine covers, or change which issue is current.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-primary-700 group-hover:underline mt-4 inline-flex items-center gap-1">
              <span>Manage Issues</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Action 4: Publish Paper */}
          <Link
            href="/admin/articles?action=new"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                4. Add a Research Paper
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Publish a newly accepted paper with title, authors, abstract, PDF, and Zenodo DOI.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-primary-700 group-hover:underline mt-4 inline-flex items-center gap-1">
              <span>Add Paper</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Action 5: Website Menu */}
          <Link
            href="/admin/navigation"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Menu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                5. Website Menu Links
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Add, rename, or reorder buttons and dropdown menus at the top of the website.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-primary-700 group-hover:underline mt-4 inline-flex items-center gap-1">
              <span>Edit Menu</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Action 6: View Orders */}
          <Link
            href="/admin/subscriptions"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                6. Customer Orders ({totalOrders})
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Review visitor purchases (print copies, subscriptions), postal addresses, and dispatch status.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-primary-700 group-hover:underline mt-4 inline-flex items-center gap-1">
              <span>View Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Action 7: Website Text Pages */}
          <Link
            href="/admin/pages"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                7. Website Text &amp; Policies
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Edit text for About Us, Manuscript Guidelines, Peer Review Policy, and Publication Ethics.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-primary-700 group-hover:underline mt-4 inline-flex items-center gap-1">
              <span>Edit Pages</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Action 8: Top Announcement Ticker */}
          <Link
            href="/admin/announcements"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                8. Top Scrolling Banner
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Change the scrolling Call For Papers banner or special announcements on the site.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-primary-700 group-hover:underline mt-4 inline-flex items-center gap-1">
              <span>Edit Banner</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Two Column Section: Recent Customer Orders & Received Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Customer Orders */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-navy-900 text-base flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
                <span>Recent Customer Orders &amp; Subscriptions</span>
              </h3>
              <p className="text-xs text-slate-500">Placed via the online journal store</p>
            </div>
            <Link
              href="/admin/subscriptions"
              className="text-xs font-semibold text-primary-700 hover:underline inline-flex items-center gap-1"
            >
              <span>View All ({totalOrders})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentOrders.length > 0 ? (
              recentOrders.map((ord) => (
                <div key={ord.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary-800 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                        Order #{ord.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          ord.status === 'Paid' || ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'Dispatched'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                      {ord.subscriberName} {ord.organization ? `(${ord.organization})` : ''}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {ord.planTitle} • <strong>₹{ord.amount} INR</strong>
                    </p>
                  </div>

                  <Link
                    href={`/admin/subscriptions`}
                    className="text-xs font-semibold text-primary-700 hover:text-primary-900 bg-primary-50 px-2.5 py-1 rounded transition-colors flex-shrink-0"
                  >
                    Manage
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                No orders received yet.
              </div>
            )}
          </div>
        </div>

        {/* Right: Recent Manuscript Submissions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-navy-900 text-base flex items-center gap-2">
                <Inbox className="w-4 h-4 text-primary-700" />
                <span>Author Manuscript Submissions</span>
              </h3>
              <p className="text-xs text-slate-500">Submitted online by authors for review</p>
            </div>
            <Link
              href="/admin/submissions"
              className="text-xs font-semibold text-primary-700 hover:underline inline-flex items-center gap-1"
            >
              <span>View Queue ({pendingSubmissions} pending)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((sub) => (
                <div key={sub.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary-800">
                        {sub.trackingId}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          sub.status === 'Submitted'
                            ? 'bg-amber-100 text-amber-800'
                            : sub.status === 'Published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1">
                      {sub.paperTitle}
                    </h4>

                    <p className="text-[11px] text-slate-500">
                      Author: {sub.authorName} • {new Date(sub.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <Link
                    href={`/admin/submissions?id=${sub.id}`}
                    className="text-xs font-semibold text-primary-700 hover:text-primary-900 bg-primary-50 px-2.5 py-1 rounded transition-colors flex-shrink-0"
                  >
                    Review
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                No submissions in the queue.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
