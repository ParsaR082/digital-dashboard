'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { locale } = useLanguage();
  const isFa = locale === 'fa';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 gap-6">
      <div className="w-20 h-20 rounded-3xl bg-[#4f46e5]/10 border border-[#4f46e5]/30 flex items-center justify-center text-[#c3c0ff] shadow-xl">
        <span className="material-symbols-outlined text-[44px]">search_off</span>
      </div>

      <div className="flex flex-col gap-2 max-w-md">
        <span className="text-4xl font-extrabold font-mono-numeric text-white">404</span>
        <h2 className="text-lg font-bold text-[#dfe2f1]">
          {isFa ? 'صفحه مورد نظر یافت نشد' : 'Institutional Route Not Found'}
        </h2>
        <p className="text-xs text-[#918fa1] leading-relaxed">
          {isFa
            ? 'مسیر درخواستی در سامانه تسویه بین‌بانکی فین‌ماتریکس وجود ندارد یا به بخش دیگری منتقل شده است.'
            : 'The requested path does not exist on the FinMatrix interbank protocol cluster or has been archived.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">query_stats</span>
          <span>{isFa ? 'بازگشت به کنسول تحلیلی' : 'Back to Analytics Console'}</span>
        </Link>
        <Link
          href="/cross-border-settlements"
          className="px-4 py-2.5 rounded-xl bg-[#171b26] hover:bg-[#262a35] text-[#dfe2f1] text-xs font-semibold transition-all border border-[#262a35]"
        >
          {isFa ? 'دفترکل فرامرزی' : 'Cross-Border Ledger'}
        </Link>
      </div>
    </div>
  );
}
