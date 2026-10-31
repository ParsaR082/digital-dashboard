'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { ReserveItem } from '@/types/dashboard';

export default function ReserveMatrix() {
  const { t, locale, toPersianDigits } = useLanguage();
  const isFa = locale === 'fa';
  const [activeVault, setActiveVault] = useState<string | null>(null);

  const reserves: ReserveItem[] = [
    {
      id: 'usd',
      nameEn: 'United States Dollar (USD)',
      nameFa: 'دلار آمریکا (USD)',
      custodyEn: 'Fedwire Primary Custody',
      custodyFa: 'فد‌وایر نیویورک',
      percent: 48,
      volumeEn: '$1.19B',
      volumeFa: `${toPersianDigits('1.19')} میلیارد دلار`,
      color: 'bg-[#c3c0ff]',
    },
    {
      id: 'aed',
      nameEn: 'UAE Dirham (AED)',
      nameFa: 'درهم امارات (AED)',
      custodyEn: 'Abu Dhabi Global Market (ADGM)',
      custodyFa: 'مرکز مالی بین‌المللی ابوظبی (ADGM)',
      percent: 26,
      volumeEn: '$644M',
      volumeFa: `${toPersianDigits('644')} میلیون دلار`,
      color: 'bg-[#4cd7f6]',
    },
    {
      id: 'eur',
      nameEn: 'Euro Currency (EUR)',
      nameFa: 'یورو اتحادیه اروپا (EUR)',
      custodyEn: 'Eurosystem Clearing Node',
      custodyFa: 'گره تسویه یوروسیستم فرانکفورت',
      percent: 16,
      volumeEn: '$396M',
      volumeFa: `${toPersianDigits('396')} میلیون دلار`,
      color: 'bg-[#4edea3]',
    },
    {
      id: 'irr',
      nameEn: 'Iranian Rial (IRR)',
      nameFa: 'ریال ایران (IRR)',
      custodyEn: 'CBI Interbank Protocol',
      custodyFa: 'پروتکل تسویه بین‌بانکی بانک مرکزی',
      percent: 10,
      volumeEn: '$248M eq.',
      volumeFa: `${toPersianDigits('248')} میلیون دلار معادل`,
      color: 'bg-[#4f46e5]',
    },
  ];

  return (
    <div className="rounded-2xl bg-[#171b26]/80 backdrop-blur-xl border border-[#262a35] p-5 lg:p-6 shadow-xl flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">
              pie_chart
            </span>
            <h3 className="text-base font-bold text-[#dfe2f1]">{t.riskHeaderTitle}</h3>
          </div>
          <span className="font-mono-numeric text-xs font-bold text-[#4cd7f6] bg-[#03b5d3]/20 border border-[#4cd7f6]/30 px-2.5 py-0.5 rounded-full">
            {t.riskCap}
          </span>
        </div>

        <p className="text-xs text-[#c7c4d8] mb-5 text-start leading-relaxed">
          {t.riskSub}
        </p>

        {/* Segmented Visual Stacked Bar with Animated Widths */}
        <div className="w-full h-3.5 rounded-full bg-[#0a0e18] flex overflow-hidden mb-5 border border-[#262a35] shadow-inner p-0.5 gap-0.5">
          {reserves.map((res) => (
            <motion.div
              key={res.id}
              initial={{ width: 0 }}
              animate={{ width: `${res.percent}%` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full ${res.color} rounded-sm cursor-pointer hover:brightness-125 transition-all`}
              onMouseEnter={() => setActiveVault(res.id)}
              onMouseLeave={() => setActiveVault(null)}
              title={`${res.nameEn}: ${res.percent}%`}
            />
          ))}
        </div>

        {/* Currency Breakdown List with Framer Motion hover elevation */}
        <div className="flex flex-col gap-2.5">
          {reserves.map((res) => {
            const isHighlighted = activeVault === res.id;
            return (
              <motion.div
                key={res.id}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={() => setActiveVault(res.id)}
                onMouseLeave={() => setActiveVault(null)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-start ${
                  isHighlighted
                    ? 'bg-[#1c1f2a] border-[#4f46e5] shadow-md shadow-[#4f46e5]/20'
                    : 'bg-[#0a0e18]/60 border-[#262a35]/60 hover:border-[#313540]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${res.color}`}></span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#dfe2f1]">
                      {isFa ? res.nameFa : res.nameEn}
                    </span>
                    <span className="text-[11px] text-[#918fa1]">
                      {isFa ? res.custodyFa : res.custodyEn}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col text-end font-mono-numeric">
                  <span className="text-xs font-bold text-[#dfe2f1]">
                    {isFa ? `٪${toPersianDigits(res.percent.toString())}` : `${res.percent}.0%`}
                  </span>
                  <span className="text-[11px] text-[#918fa1]">
                    {isFa ? res.volumeFa : res.volumeEn}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Capital Adequacy Ratio (CAR Tier 1) Card */}
      <div className="mt-5 p-3.5 rounded-xl bg-[#0a0e18] border border-[#262a35] flex items-center justify-between text-xs">
        <span className="text-[#918fa1]">{t.stressTest}</span>
        <span className="font-mono-numeric font-bold text-[#4edea3]">
          {t.carTier1}
        </span>
      </div>
    </div>
  );
}
