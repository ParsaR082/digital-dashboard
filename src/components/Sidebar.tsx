'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function Sidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    {
      id: 'analytics',
      href: '/',
      label: t.navAnalytics,
      icon: 'query_stats',
      isActive: pathname === '/' || pathname === '/analytics',
    },
    {
      id: 'ledger',
      href: '/cross-border-settlements',
      label: t.navLedger,
      icon: 'receipt_long',
      isActive: pathname.startsWith('/cross-border-settlements') || pathname.startsWith('/ledger'),
    },
    {
      id: 'fx',
      href: '/treasury-fx-matrices',
      label: t.navFx,
      icon: 'currency_exchange',
      isActive: pathname.startsWith('/treasury-fx-matrices') || pathname.startsWith('/fx'),
    },
    {
      id: 'order-book',
      href: '/order-book-depth',
      label: t.navOrderBook,
      icon: 'candlestick_chart',
      isActive: pathname.startsWith('/order-book-depth') || pathname.startsWith('/order-book'),
    },
    {
      id: 'compliance',
      href: '/compliance-audit',
      label: t.navCompliance,
      icon: 'verified_user',
      isActive: pathname.startsWith('/compliance-audit') || pathname.startsWith('/compliance'),
    },
  ];

  return (
    <aside className="fixed top-0 start-0 h-full w-72 bg-[#0a0e18]/95 backdrop-blur-2xl border-e border-[#262a35]/60 z-50 flex flex-col justify-between py-6 px-4 shadow-2xl transition-all duration-300">
      {/* Top Branding & Nav */}
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#03b5d3] flex items-center justify-center text-white shadow-lg shadow-[#4f46e5]/30 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">hub</span>
          </div>
          <div className="flex flex-col text-start">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#dfe2f1] tracking-tight">{t.brandName}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-numeric font-medium text-[#4edea3] bg-[#006e4b]/30 border border-[#4edea3]/20">
                PROD v4.2
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#4cd7f6] tracking-wider uppercase">
              {t.brandTag}
            </span>
          </div>
        </Link>

        {/* Node Location Tag */}
        <div className="px-3 py-2 rounded-lg bg-[#171b26] border border-[#262a35] flex items-center justify-between text-xs text-[#c7c4d8]">
          <span className="truncate">{t.nodeZone}</span>
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 text-start ${
                  item.isActive
                    ? 'bg-[#4f46e5] text-white shadow-lg shadow-[#4f46e5]/30'
                    : 'text-[#c7c4d8] hover:bg-[#1c1f2a] hover:text-[#dfe2f1]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    item.isActive ? 'text-white' : 'text-[#918fa1]'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Health & Node Protocol Details */}
      <div className="flex flex-col gap-3">
        {/* Protocol Live Latency Card */}
        <div className="bg-[#171b26]/90 border border-[#262a35] p-3.5 rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] text-[#c7c4d8]">
            <span className="uppercase tracking-wider">{t.protocolStatus}</span>
            <span className="font-mono-numeric text-[#4cd7f6] text-[11px]">NODE-01</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#4edea3] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
              {t.operational}
            </span>
            <span className="font-mono-numeric text-xs font-bold text-[#dfe2f1] bg-[#0a0e18] px-2 py-0.5 rounded border border-[#313540]">
              {t.nodeLatency}
            </span>
          </div>
        </div>

        {/* Hardware HSM Status */}
        <div className="px-2 py-1 flex items-center gap-2 text-[11px] text-[#918fa1]">
          <span className="material-symbols-outlined text-[16px] text-[#4edea3]">gpp_good</span>
          <span className="truncate">{t.nodeHardware}</span>
        </div>
      </div>
    </aside>
  );
}
