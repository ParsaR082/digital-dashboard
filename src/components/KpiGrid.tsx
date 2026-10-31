'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import SpotlightCard from '@/components/animations/SpotlightCard';
import AnimatedNumber from '@/components/animations/AnimatedNumber';

interface KpiDetail {
  id: string;
  title: string;
  numValue: number;
  prefix: string;
  suffix: string;
  delta: string;
  deltaIcon: string;
  sub: string;
  tag: string;
  glowColor: string;
  spotlightColor: string;
  badgeBg: string;
  descriptionEn: string;
  descriptionFa: string;
  extendedMetrics: { labelEn: string; labelFa: string; val: string }[];
}

export default function KpiGrid() {
  const { t, locale, toPersianDigits } = useLanguage();
  const isFa = locale === 'fa';

  const [selectedKpi, setSelectedKpi] = useState<KpiDetail | null>(null);

  const kpis: KpiDetail[] = [
    {
      id: 'kpi-settlement',
      title: t.kpi1Title,
      numValue: 148420000,
      prefix: '$',
      suffix: isFa ? 'دلار' : '',
      delta: '+18.4%',
      deltaIcon: 'arrow_upward',
      sub: t.kpi1Sub,
      tag: t.kpi1Tag,
      glowColor: 'via-[#4f46e5]',
      spotlightColor: 'rgba(79, 70, 229, 0.25)',
      badgeBg: 'bg-[#006e4b]/20 text-[#4edea3] border-[#4edea3]/30',
      descriptionEn:
        'Continuous cryptographic clearing volume aggregated across the DIFC, Frankfurt, Tehran, and Muscat interbank gateways.',
      descriptionFa:
        'حجم ناخالص تسویه‌شده به صورت رمزنگاری‌شده در دالان‌های بین‌بانکی دبی، فرانکفورت، تهران و مسقط.',
      extendedMetrics: [
        { labelEn: 'Peak 1h Velocity', labelFa: 'اوج سرعت ۱ ساعته', val: '$18.2M/hr' },
        { labelEn: 'Settlement Efficiency', labelFa: 'ضریب کارایی پایاپای', val: '99.992%' },
        { labelEn: 'Average Batch Size', labelFa: 'میانگین هر بسته', val: '$612,400' },
      ],
    },
    {
      id: 'kpi-latency',
      title: t.kpi2Title,
      numValue: 142,
      prefix: '',
      suffix: isFa ? 'میلی‌ثانیه' : 'ms',
      delta: isFa ? 'بهینه' : 'Optimal',
      deltaIcon: 'bolt',
      sub: t.kpi2Sub,
      tag: t.kpi2Tag,
      glowColor: 'via-[#4cd7f6]',
      spotlightColor: 'rgba(76, 215, 246, 0.22)',
      badgeBg: 'bg-[#006e4b]/20 text-[#4edea3] border-[#4edea3]/30',
      descriptionEn:
        'End-to-end atomic finality latency measured between SWIFT GPI and Shetab payment rails over secure VPN mesh.',
      descriptionFa:
        'زمان نهایی‌سازی اتمیک دوطرفه میان درگاه سوئیفت و شتاب بر بستر شبکه امن نقطه به نقطه.',
      extendedMetrics: [
        { labelEn: 'P50 Median Latency', labelFa: 'میانه تاخیر P50', val: '86 ms' },
        { labelEn: 'P99 Maximum Latency', labelFa: 'حداکثر تاخیر P99', val: '208 ms' },
        { labelEn: 'Packet Loss', labelFa: 'افت بسته شبکه', val: '0.000%' },
      ],
    },
    {
      id: 'kpi-hedge',
      title: t.kpi3Title,
      numValue: 94.2,
      prefix: '',
      suffix: '%',
      delta: isFa ? 'مازاد وثیقه' : 'Overcollateralized',
      deltaIcon: 'verified',
      sub: t.kpi3Sub,
      tag: t.kpi3Tag,
      glowColor: 'via-[#4edea3]',
      spotlightColor: 'rgba(78, 222, 163, 0.22)',
      badgeBg: 'bg-[#03b5d3]/20 text-[#4cd7f6] border-[#4cd7f6]/30',
      descriptionEn:
        'Algorithmic delta-neutral treasury hedging ratio maintained across multi-currency escrow liquidity pools.',
      descriptionFa:
        'نسبت پوشش ریسک ارزی خودکار جهت محافظت از نوسانات جفت‌ارزهای درهم، ریال، یورو و دلار.',
      extendedMetrics: [
        { labelEn: 'Capital Coverage', labelFa: 'ضریب پوشش سرمایه', val: '124.5%' },
        { labelEn: 'Liquidation Threshold', labelFa: 'آستانه نقدشوندگی', val: '75.0%' },
        { labelEn: 'Daily Rebalance Frequency', labelFa: 'دفعات بازتوازن روزانه', val: '48 Times' },
      ],
    },
    {
      id: 'kpi-nodes',
      title: t.kpi4Title,
      numValue: 1280,
      prefix: '',
      suffix: isFa ? 'گره' : 'Nodes',
      delta: isFa ? 'همگام‌سازی' : 'Syncing',
      deltaIcon: 'hub',
      sub: t.kpi4Sub,
      tag: t.kpi4Tag,
      glowColor: 'via-[#c3c0ff]',
      spotlightColor: 'rgba(195, 192, 255, 0.22)',
      badgeBg: 'bg-[#4f46e5]/20 text-[#c3c0ff] border-[#4f46e5]/30',
      descriptionEn:
        'Decentralized BFT consensus validator nodes synchronizing ledger state across participating financial institutions.',
      descriptionFa:
        'گره‌های فعال اعتبارسنجی الگوریتم اجماع BFT جهت هماهنگ‌سازی و امضای غیرقابل‌انکار دفترکل.',
      extendedMetrics: [
        { labelEn: 'Active Epoch Height', labelFa: 'ارتفاع بلاک جاری', val: '#19,482,109' },
        { labelEn: 'Byzantine Fault Tolerance', labelFa: 'تحمل خطای بیزانس', val: '33.3% Max' },
        { labelEn: 'Staked Collateral', labelFa: 'وثیقه سهام‌گذاری‌شده', val: '$640M' },
      ],
    },
  ];

  return (
    <>
      {/* 4 Cards Grid with 3D Tilt and Spotlight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <SpotlightCard
            key={kpi.id}
            layoutId={kpi.id}
            onClick={() => setSelectedKpi(kpi)}
            spotlightColor={kpi.spotlightColor}
            className="cursor-pointer group hover:border-[#4f46e5]/60 transition-all p-5 flex flex-col justify-between"
          >
            {/* Top row: Label & Delta Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-semibold text-[#c7c4d8] uppercase tracking-wider truncate">
                {kpi.title}
              </span>
              <span
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-mono-numeric font-medium shrink-0 ${kpi.badgeBg}`}
              >
                <span className="material-symbols-outlined text-[14px]">{kpi.deltaIcon}</span>
                <span>{kpi.delta}</span>
              </span>
            </div>

            {/* Middle row: Big animated number slot */}
            <div className="my-2 text-start">
              <span className="text-2xl lg:text-3xl font-extrabold text-[#dfe2f1] font-mono-numeric tracking-tight flex items-baseline">
                <AnimatedNumber
                  value={kpi.numValue}
                  prefix={kpi.prefix}
                  suffix={kpi.suffix}
                  className="font-bold text-white tracking-tight"
                />
              </span>
            </div>

            {/* Bottom row: Subtext & SLA/Tag */}
            <div className="mt-3 pt-3 border-t border-[#262a35]/60 flex items-center justify-between text-xs text-[#918fa1]">
              <span className="truncate">{kpi.sub}</span>
              <span className="font-mono-numeric font-medium text-[#4cd7f6] flex items-center gap-1 shrink-0 group-hover:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform">
                <span>{kpi.tag}</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>

            {/* Sub-pixel ambient glow line at bottom */}
            <div
              className={`absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent ${kpi.glowColor} to-transparent opacity-60 group-hover:opacity-100 transition-opacity`}
            ></div>
          </SpotlightCard>
        ))}
      </div>

      {/* Shared Layout Transition Modal (layoutId) */}
      <AnimatePresence>
        {selectedKpi && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedKpi(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Morphing Expanded Card */}
            <motion.div
              layoutId={selectedKpi.id}
              className="relative w-full max-w-xl bg-[#171b26] border border-[#262a35] rounded-3xl p-6 lg:p-8 shadow-2xl z-10 flex flex-col gap-5 text-start overflow-hidden"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-mono-numeric font-medium ${selectedKpi.badgeBg}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{selectedKpi.deltaIcon}</span>
                    <span>{selectedKpi.delta}</span>
                  </span>
                  <span className="text-xs font-semibold text-[#918fa1] uppercase tracking-wider">
                    {selectedKpi.title}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedKpi(null)}
                  className="w-8 h-8 rounded-full bg-[#0a0e18] border border-[#262a35] text-[#918fa1] hover:text-white flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Main Expanded Number */}
              <div>
                <div className="text-3xl lg:text-4xl font-extrabold text-white font-mono-numeric">
                  <AnimatedNumber
                    value={selectedKpi.numValue}
                    prefix={selectedKpi.prefix}
                    suffix={selectedKpi.suffix}
                  />
                </div>
                <p className="text-xs text-[#c7c4d8] mt-2 leading-relaxed">
                  {isFa ? selectedKpi.descriptionFa : selectedKpi.descriptionEn}
                </p>
              </div>

              {/* Deep Telemetry Breakdown Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#0a0e18] border border-[#262a35]">
                {selectedKpi.extendedMetrics.map((em, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[11px] text-[#918fa1]">
                      {isFa ? em.labelFa : em.labelEn}
                    </span>
                    <span className="text-base font-bold font-mono-numeric text-[#4cd7f6] mt-0.5">
                      {em.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedKpi(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold text-xs transition-colors shadow-lg shadow-[#4f46e5]/30"
                >
                  {isFa ? 'بستن پنجره جزئیات' : 'Close Breakdown'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
