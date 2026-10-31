'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function ArchitectureSpec() {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'layout' | 'context' | 'dictionaries' | 'audit'>('layout');
  const [copied, setCopied] = useState(false);

  const snippets = {
    layout: `import { Plus_Jakarta_Sans, Vazirmatn, JetBrains_Mono } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import '@/app/globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="\${jakarta.variable} \${vazirmatn.variable} \${jetbrainsMono.variable} dark">
      <body className="bg-[#0f131d] text-[#dfe2f1] antialiased transition-colors duration-300">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}`,
    context: `'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries, Locale, Dictionary } from '@/lib/i18n/dictionaries';

interface LanguageContextType {
  locale: Locale;
  direction: 'ltr' | 'rtl';
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  formatCurrency: (amount: number, currency: 'USD' | 'EUR' | 'AED' | 'IRR') => string;
  formatNumber: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('preferred-locale', newLocale);
    const dir = newLocale === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', newLocale);
  };

  useEffect(() => {
    const saved = (localStorage.getItem('preferred-locale') as Locale) || 'en';
    setLocale(saved);
  }, []);

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(val);
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        direction: locale === 'fa' ? 'rtl' : 'ltr',
        t: dictionaries[locale],
        setLocale,
        formatCurrency,
        formatNumber,
      }}>
      {children}
    </LanguageContext.Provider>
  );
}`,
    dictionaries: `export type Locale = 'en' | 'fa';

export const dictionaries = {
  en: {
    platformTitle: 'FinMatrix Bi-Directional Engine',
    grossSettlement: '24h Gross Settlement',
    latency: 'Bilateral Rail Latency',
    hedgeRatio: 'Treasury FX Hedging Ratio',
    activeNodes: 'Consensus Validator Nodes',
    instantSwap: 'Instant Corridor Swap',
    ledgerTitle: 'Verified Interbank Transaction Ledger',
    reserveTitle: 'Treasury FX Reserve Matrix',
    settled: 'Settled',
    clearing: 'Clearing',
    commitSettlement: 'Commit Institutional Settlement',
  },
  fa: {
    platformTitle: 'موتور تسویه چندسویه فین‌ماتریکس',
    grossSettlement: 'حجم ناخالص تسویه ۲۴ ساعته',
    latency: 'تاخیر تبادل دوطرفه شبکه',
    hedgeRatio: 'نسبت پوشش ریسک ارزی خزانه‌داری',
    activeNodes: 'گره‌های فعال اجماع بین‌بانکی',
    instantSwap: 'تبدیل آنی دالان نقدینگی',
    ledgerTitle: 'دفتر کل تاییدشده تراکنش‌های بین‌بانکی',
    reserveTitle: 'ماتریس ذخایر و دارایی‌های خزانه‌داری',
    settled: 'تسویه نهایی',
    clearing: 'در حال پایاپای',
    commitSettlement: 'ثبت تسویه حساب نهادی',
  },
} as const;

export type Dictionary = typeof dictionaries['en'];`,
    audit: `/* FinMatrix Architecture Standard: 100% CSS Logical Utilities */

// ❌ ANTI-PATTERN: PHYSICAL PROPERTIES
// Breaks alignment, causes inverted layouts and overlapping text when switching dir="rtl"
ml-4, mr-6, pl-8, pr-2, left-0, right-0, text-left, text-right, border-l, border-r

// ✅ FINMATRIX STANDARD: CSS LOGICAL PROPERTIES
// Automatically mirrors with ZERO extra CSS lines or media overrides when dir="rtl" triggers:
ms-4, me-6, ps-8, pe-2, start-0, end-0, text-start, text-end, border-s, border-e`,
  };

  const handleCopy = () => {
    const textToCopy = snippets[activeTab];
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="code-inspector-section"
      className="w-full rounded-2xl bg-[#171b26]/90 backdrop-blur-2xl border border-[#262a35] p-5 lg:p-6 shadow-2xl flex flex-col gap-5 text-start"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[24px]">
              integration_instructions
            </span>
            <h2 className="text-base lg:text-lg font-bold text-[#dfe2f1] tracking-tight">
              {t.archTitle}
            </h2>
          </div>
          <p className="text-xs text-[#c7c4d8] mt-1 max-w-3xl leading-relaxed">
            {t.archSub}
          </p>
        </div>

        {/* Logical Compliance Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#4f46e5]/20 border border-[#4f46e5]/40 text-[#c3c0ff] self-start sm:self-auto shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span className="text-xs font-semibold">{t.logicalBadge}</span>
        </div>
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="flex items-center gap-2 border-b border-[#262a35]/80 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('layout')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'layout'
              ? 'bg-[#4f46e5] text-white shadow-md shadow-[#4f46e5]/30'
              : 'text-[#918fa1] hover:text-[#dfe2f1] hover:bg-[#1c1f2a]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">folder_special</span>
          <span>{t.tabLayout}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('context')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'context'
              ? 'bg-[#4f46e5] text-white shadow-md shadow-[#4f46e5]/30'
              : 'text-[#918fa1] hover:text-[#dfe2f1] hover:bg-[#1c1f2a]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">code</span>
          <span>{t.tabContext}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dictionaries')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'dictionaries'
              ? 'bg-[#4f46e5] text-white shadow-md shadow-[#4f46e5]/30'
              : 'text-[#918fa1] hover:text-[#dfe2f1] hover:bg-[#1c1f2a]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">translate</span>
          <span>{t.tabDictionaries}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'audit'
              ? 'bg-[#4f46e5] text-white shadow-md shadow-[#4f46e5]/30'
              : 'text-[#918fa1] hover:text-[#dfe2f1] hover:bg-[#1c1f2a]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>{t.tabAudit}</span>
        </button>
      </div>

      {/* Code Display Box with Copy Action */}
      <div className="w-full bg-[#0a0e18] border border-[#262a35] p-4 rounded-xl overflow-hidden font-mono-numeric text-xs relative shadow-inner">
        <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-[#262a35] text-[11px] text-[#918fa1]">
          <span>TypeScript · Next.js 15 App Router Architecture</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#171b26] border border-[#262a35] text-[#dfe2f1] hover:text-white hover:border-[#4f46e5] transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? t.copiedCode : t.copyCode}</span>
          </button>
        </div>

        <pre className="text-xs leading-relaxed text-[#c3c0ff] whitespace-pre overflow-x-auto p-2" dir="ltr">
          <code>{snippets[activeTab]}</code>
        </pre>
      </div>
    </section>
  );
}
