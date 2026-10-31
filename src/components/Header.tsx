'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const { t, locale, setLocale } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="fixed top-0 start-0 end-0 h-16 bg-[#0f131d]/90 backdrop-blur-2xl border-b border-[#262a35]/80 z-40 flex items-center justify-between px-4 sm:px-6 shadow-md transition-all duration-300">
      {/* Brand Logo & Search */}
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        {/* Brand Link */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#03b5d3] flex items-center justify-center text-white shadow-lg shadow-[#4f46e5]/30 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">hub</span>
          </div>
          <div className="hidden sm:flex flex-col text-start">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#dfe2f1] tracking-tight">{t.brandName}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-numeric font-medium text-[#4edea3] bg-[#006e4b]/30 border border-[#4edea3]/20">
                v4.2-PROD
              </span>
            </div>
            <span className="text-[10px] font-medium text-[#4cd7f6] tracking-wider uppercase">
              {t.brandTag}
            </span>
          </div>
        </Link>

        {/* Global Search */}
        <div className="relative w-full max-w-md hidden md:block">
          <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-[#918fa1] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full h-10 ps-10 pe-4 bg-[#171b26]/90 border border-[#262a35] text-[#dfe2f1] placeholder:text-[#918fa1]/70 rounded-xl text-xs font-medium focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-all text-start"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-[#918fa1] hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Protocol Chip */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#171b26] border border-[#262a35]">
          <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
          <span className="text-[11px] font-medium text-[#c7c4d8] whitespace-nowrap">
            {t.activeProtocol}
          </span>
        </div>
      </div>

      {/* Action Controls & User Profile */}
      <div className="flex items-center gap-3">
        {/* Language Switcher Segmented Control */}
        <div className="flex items-center p-1 rounded-xl bg-[#171b26] border border-[#262a35]">
          <button
            type="button"
            onClick={() => setLocale('en')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              locale === 'en'
                ? 'bg-[#4f46e5] text-white shadow-md shadow-[#4f46e5]/30'
                : 'text-[#c7c4d8] hover:text-white'
            }`}
          >
            <span>EN</span>
          </button>
          <button
            type="button"
            onClick={() => setLocale('fa')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              locale === 'fa'
                ? 'bg-[#4f46e5] text-white shadow-md shadow-[#4f46e5]/30'
                : 'text-[#c7c4d8] hover:text-white'
            }`}
          >
            <span>فارسی</span>
          </button>
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            type="button"
            aria-label={t.notifications}
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl bg-[#171b26] border border-[#262a35] flex items-center justify-center text-[#c7c4d8] hover:text-white hover:border-[#4f46e5]/50 transition-colors relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-[#4cd7f6] ring-2 ring-[#0f131d]"></span>
          </button>

          {showNotifications && (
            <div className="absolute end-0 top-12 w-80 bg-[#171b26] border border-[#262a35] rounded-2xl shadow-2xl p-4 z-50 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
                <span className="text-xs font-bold text-white">{t.notifications}</span>
                <span className="text-[10px] text-[#4cd7f6] bg-[#03b5d3]/20 px-2 py-0.5 rounded-full font-mono-numeric">
                  3 NEW
                </span>
              </div>
              <div className="flex flex-col gap-2.5 text-xs text-start">
                <div className="p-2.5 rounded-xl bg-[#1c1f2a] flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3] mt-1.5 shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#dfe2f1]">
                      {locale === 'fa' ? 'تسویه ۴،۵۰۰،۰۰۰،۰۰۰،۰۰۰ ریال انجام شد' : 'Shetab Settlement Completed'}
                    </span>
                    <span className="text-[11px] text-[#918fa1]">0x37C1...8A01 · 2m ago</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1c1f2a] flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#4cd7f6] mt-1.5 shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#dfe2f1]">
                      {locale === 'fa' ? 'به‌روزرسانی نرخ تبدیل دالان USD/AED' : 'Corridor Rate Adjusted'}
                    </span>
                    <span className="text-[11px] text-[#918fa1]">ADGM Node · 8m ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Role */}
        <div className="flex items-center gap-3 ps-2 border-s border-[#262a35]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4f46e5] to-[#c3c0ff] p-[2px] flex items-center justify-center shadow-md">
            <div className="w-full h-full rounded-[10px] bg-[#0f131d] flex items-center justify-center text-[#c3c0ff] font-bold text-xs">
              CTO
            </div>
          </div>
          <div className="hidden md:flex flex-col text-start">
            <span className="text-xs font-bold text-[#dfe2f1]">Alexander S.</span>
            <span className="text-[10px] text-[#918fa1]">{t.userProfile}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
