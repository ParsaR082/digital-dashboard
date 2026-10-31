'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function ControlHub() {
  const { t, locale, setLocale } = useLanguage();

  const scrollToSpec = () => {
    const el = document.getElementById('code-inspector-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#171b26]/90 via-[#1c1f2a]/80 to-[#171b26]/90 backdrop-blur-xl border border-[#262a35] p-5 lg:p-6 shadow-xl">
      {/* Ambient background glow */}
      <div className="absolute -top-16 -start-16 w-64 h-64 bg-[#4f46e5]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -end-16 w-64 h-64 bg-[#03b5d3]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Left: Engine Details */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#4f46e5]/20 border border-[#4f46e5]/40 flex items-center justify-center text-[#c3c0ff] shrink-0 shadow-inner">
            <span className="material-symbols-outlined text-[28px]">sync_alt</span>
          </div>

          <div className="flex flex-col gap-1 text-start">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-lg lg:text-xl font-bold text-[#dfe2f1] tracking-tight">
                {t.platformTitle}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#006e4b]/20 border border-[#4edea3]/30 text-[#4edea3] text-[11px] font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span>{t.badgeZeroCssFriction}</span>
              </span>
            </div>
            <p className="text-xs text-[#c7c4d8] max-w-2xl leading-relaxed">
              {t.platformSubtitle}
            </p>
          </div>
        </div>

        {/* Right: Controller Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 bg-[#0a0e18]/80 p-1.5 rounded-xl border border-[#262a35] shadow-inner self-stretch sm:self-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => setLocale('en')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              locale === 'en'
                ? 'bg-[#4f46e5] text-white shadow-md shadow-[#4f46e5]/40'
                : 'text-[#c7c4d8] hover:text-white hover:bg-[#171b26]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">translate</span>
            <span>{t.btnSwitchEn}</span>
          </button>

          <button
            type="button"
            onClick={() => setLocale('fa')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              locale === 'fa'
                ? 'bg-[#4f46e5] text-white shadow-md shadow-[#4f46e5]/40'
                : 'text-[#c7c4d8] hover:text-white hover:bg-[#171b26]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">language</span>
            <span>{t.btnSwitchFa}</span>
          </button>

          <div className="hidden sm:block w-px h-6 bg-[#313540] mx-0.5"></div>

          <button
            type="button"
            onClick={scrollToSpec}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#4cd7f6] bg-[#171b26] border border-[#4cd7f6]/20 hover:bg-[#4cd7f6]/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            <span>{t.btnCodeSpec}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
