'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedNumber from '@/components/animations/AnimatedNumber';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.02,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function TreasuryFxPage() {
  const { t, locale, toPersianDigits, formatCurrency } = useLanguage();
  const isFa = locale === 'fa';

  const [hedgeAmount, setHedgeAmount] = useState('10000000');
  const [selectedCorridor, setSelectedCorridor] = useState('USD/AED');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [hedgeConfirmed, setHedgeConfirmed] = useState(false);

  const corridors = [
    {
      pair: 'USD / AED',
      rate: '3.6725',
      rateFa: toPersianDigits('3.6725'),
      delta: '0.00%',
      deltaType: 'neutral',
      tag: 'ADGM Pegged Corridor',
      tagFa: 'کریدور تثبیت‌شده دبی/ابوظبی',
      vol24h: '$64.2M',
      vol24hFa: `${toPersianDigits('64.2')} میلیون دلار`,
      liquidity: 'High ($420M)',
      liquidityFa: 'بالا (۴۲۰M$)',
      sparkline: 'M0,15 L20,15 L40,14 L60,15 L80,15 L100,15',
      color: '#4cd7f6',
    },
    {
      pair: 'USD / IRR',
      rate: '612,400',
      rateFa: `${toPersianDigits('612,400')} ریال`,
      delta: '+0.42%',
      deltaType: 'positive',
      tag: 'Tehran Interbank Desk',
      tagFa: 'میز ارزی بین‌بانکی تهران',
      vol24h: '$38.4M eq.',
      vol24hFa: `${toPersianDigits('38.4')} میلیون دلار`,
      liquidity: 'Deep (2.1T IRR)',
      liquidityFa: 'عمیق (۲.۱ همت)',
      sparkline: 'M0,25 L20,20 L40,22 L60,12 L80,8 L100,4',
      color: '#4edea3',
    },
    {
      pair: 'EUR / USD',
      rate: '1.0845',
      rateFa: toPersianDigits('1.0845'),
      delta: '+0.18%',
      deltaType: 'positive',
      tag: 'TARGET2 Frankfurt',
      tagFa: 'گره تسویه یوروسیستم فرانکفورت',
      vol24h: '€28.6M',
      vol24hFa: `${toPersianDigits('28.6')} میلیون یورو`,
      liquidity: 'Very High ($310M)',
      liquidityFa: 'بسیار بالا (۳۱۰M$)',
      sparkline: 'M0,18 L20,14 L40,19 L60,10 L80,12 L100,6',
      color: '#c3c0ff',
    },
    {
      pair: 'AED / IRR',
      rate: '166,750',
      rateFa: `${toPersianDigits('166,750')} ریال`,
      delta: '+0.35%',
      deltaType: 'positive',
      tag: 'Gulf Bilateral Rail',
      tagFa: 'پل دوجانبه خلیج فارس',
      vol24h: '85M AED',
      vol24hFa: `${toPersianDigits('85')} میلیون درهم`,
      liquidity: 'Optimal (140M AED)',
      liquidityFa: 'بهینه (۱۴۰M درهم)',
      sparkline: 'M0,22 L20,18 L40,15 L60,14 L80,9 L100,5',
      color: '#4cd7f6',
    },
    {
      pair: 'EUR / IRR',
      rate: '663,900',
      rateFa: `${toPersianDigits('663,900')} ریال`,
      delta: '+0.61%',
      deltaType: 'positive',
      tag: 'EU Direct Settlement',
      tagFa: 'تسویه مستقیم تجاری اروپا',
      vol24h: '€12.5M',
      vol24hFa: `${toPersianDigits('12.5')} میلیون یورو`,
      liquidity: 'Moderate (€45M)',
      liquidityFa: 'متوسط (۴۵M یورو)',
      sparkline: 'M0,26 L20,24 L40,18 L60,16 L80,10 L100,3',
      color: '#4edea3',
    },
    {
      pair: 'GBP / USD',
      rate: '1.2980',
      rateFa: toPersianDigits('1.2980'),
      delta: '-0.08%',
      deltaType: 'negative',
      tag: 'London Offshore Desk',
      tagFa: 'میز آفشور لندن',
      vol24h: '£8.2M',
      vol24hFa: `${toPersianDigits('8.2')} میلیون پوند`,
      liquidity: 'High ($180M)',
      liquidityFa: 'بالا (۱۸۰M$)',
      sparkline: 'M0,8 L20,10 L40,16 L60,14 L80,20 L100,24',
      color: '#ffb4ab',
    },
  ];

  const parsedHedge = parseFloat(hedgeAmount.replace(/,/g, '')) || 0;
  const collateralRequired = Math.round(parsedHedge * 1.15);
  const estimatedFee = Math.round(parsedHedge * 0.0001);

  const handleSimulateHedge = () => {
    setIsSimulating(true);
    setSimulationStep(1);
    setHedgeConfirmed(false);

    setTimeout(() => {
      setSimulationStep(2);
      setTimeout(() => {
        setSimulationStep(3);
        setTimeout(() => {
          setIsSimulating(false);
          setHedgeConfirmed(true);
          setTimeout(() => setHedgeConfirmed(false), 3500);
        }, 600);
      }, 700);
    }, 700);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 text-start"
    >
      {/* Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#171b26]/90 via-[#1c1f2a]/80 to-[#171b26]/90 backdrop-blur-xl border border-[#262a35] p-6 shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#03b5d3]/20 border border-[#4cd7f6]/40 flex items-center justify-center text-[#4cd7f6] shrink-0">
              <span className="material-symbols-outlined text-[28px]">currency_exchange</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#dfe2f1]">
                  {isFa ? 'ماتریس نقدینگی و مبادلات ارزی خزانه‌داری' : 'Treasury FX & Liquidity Matrices'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-numeric font-medium bg-[#03b5d3]/20 text-[#4cd7f6] border border-[#4cd7f6]/30">
                  {isFa ? 'نقدینگی فعال: ۲.۴۸B$' : 'Total Liquidity: $2.48B'}
                </span>
              </div>
              <p className="text-xs text-[#c7c4d8] mt-1">
                {isFa
                  ? 'پایش نرخ‌های مبادله لحظه‌ای دالان‌های منطقه‌ای، پوشش ریسک نوسانات ارزی و مدیریت وثایق چندگانه خزانه‌داری'
                  : 'Real-time multi-corridor currency pricing, automatic hedging rebalancing, and cross-border liquidity depth telemetry.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4 Top FX Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: isFa ? 'کل ذخایر چندارزی خزانه‌داری' : 'Total Multi-Asset Vault Reserves',
            val: isFa ? `${toPersianDigits('2.48')} میلیارد دلار` : '$2.48B',
            sub: isFa ? 'بازتوزیع‌شده در ۴ کانون' : 'Distributed across 4 custody vaults',
            badge: 'Tier 1 Basel III',
            color: 'via-[#4f46e5]',
          },
          {
            title: isFa ? 'حجم مبادلات ارزی ۲۴ ساعته' : '24h Cross-Corridor Volume',
            val: isFa ? `${toPersianDigits('148.4')} میلیون دلار` : '$148.4M',
            sub: isFa ? '۱۸.۴٪+ رشد نسبت به دوره قبل' : '+18.4% vs previous epoch',
            badge: '+18.4% Delta',
            color: 'via-[#4cd7f6]',
          },
          {
            title: isFa ? 'نسبت پوشش نقدینگی (LCR)' : 'Liquidity Coverage Ratio (LCR)',
            val: isFa ? `٪${toPersianDigits('214')}` : '214%',
            sub: isFa ? 'حداقل الزام قانونی: ۱۰۰٪' : 'Regulatory minimum: 100%',
            badge: 'Optimal Solvency',
            color: 'via-[#4edea3]',
          },
          {
            title: isFa ? 'میانگین لغزش نرخ ارز (Slippage)' : 'Weighted FX Slippage',
            val: isFa ? `٪${toPersianDigits('0.0012')}` : '0.0012%',
            sub: isFa ? 'حفاظت تضمینی بدون لغزش' : 'Guaranteed atomic execution',
            badge: 'Sub-Pip Accuracy',
            color: 'via-[#c3c0ff]',
          },
        ].map((m, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-xl bg-[#171b26]/80 border border-[#262a35] flex flex-col justify-between shadow-md relative overflow-hidden transition-all"
          >
            <div className="flex items-center justify-between text-[11px] text-[#918fa1] mb-2">
              <span className="uppercase tracking-wider">{m.title}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#1c1f2a] text-[#4edea3] font-mono-numeric text-[10px]">
                {m.badge}
              </span>
            </div>
            <div className="my-2">
              <span className="text-2xl font-bold font-mono-numeric text-white tracking-tight">
                {m.val}
              </span>
            </div>
            <div className="text-xs text-[#918fa1] pt-2 border-t border-[#262a35]">
              {m.sub}
            </div>
            <div className={`absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent ${m.color} to-transparent`}></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Currency Corridors Grid with Mini Sparklines */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-[#171b26]/80 backdrop-blur-xl border border-[#262a35] p-5 lg:p-6 shadow-xl flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              {isFa ? 'دالان‌های فعال تبادل و نرخ‌های برابری لحظه‌ای' : 'Active Currency Corridors & Real-Time Rates'}
            </h2>
            <p className="text-xs text-[#c7c4d8]">
              {isFa ? 'نرخ‌های بین‌بانکی متصل به استخرهای نقدینگی محلی و بین‌المللی' : 'Institutional rates streaming directly from regional interbank liquidity pools'}
            </p>
          </div>
          <span className="text-xs font-mono-numeric text-[#4edea3] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            {isFa ? 'به‌روزرسانی ۳۰۰ میلی‌ثانیه قبل' : 'Pushed 300ms ago'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {corridors.map((c, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-4 rounded-xl bg-[#0a0e18]/80 border border-[#262a35] hover:border-[#4f46e5]/50 transition-all flex flex-col justify-between gap-3 shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-mono-numeric">
                  {c.pair}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-mono-numeric font-semibold ${
                    c.deltaType === 'positive'
                      ? 'bg-[#006e4b]/20 text-[#4edea3] border border-[#4edea3]/30'
                      : c.deltaType === 'negative'
                      ? 'bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/30'
                      : 'bg-[#1c1f2a] text-[#c7c4d8]'
                  }`}
                >
                  {c.delta}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold font-mono-numeric text-[#4cd7f6]">
                    {isFa ? c.rateFa : c.rate}
                  </span>
                  <p className="text-[11px] text-[#918fa1] mt-0.5">
                    {isFa ? c.tagFa : c.tag}
                  </p>
                </div>

                {/* Mini SVG Sparkline */}
                <div className="w-24 h-8">
                  <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" fill="none">
                    <path
                      d={c.sparkline}
                      stroke={c.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#262a35] text-[#918fa1]">
                <span>{isFa ? `حجم: ${c.vol24hFa}` : `24h: ${c.vol24h}`}</span>
                <span className="text-[#dfe2f1] font-mono-numeric">
                  {isFa ? c.liquidityFa : c.liquidity}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Hedging & Liquidity Rebalancing Simulator */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-[#171b26]/80 backdrop-blur-xl border border-[#262a35] p-5 lg:p-6 shadow-xl flex flex-col lg:flex-row gap-6 items-stretch"
      >
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[22px]">
                shield
              </span>
              <h3 className="text-base font-bold text-white">
                {isFa ? 'ماژول پوشش ریسک خودکار خزانه‌داری (Auto-Hedging)' : 'Automated Treasury Hedging & Rebalance Engine'}
              </h3>
            </div>
            <p className="text-xs text-[#c7c4d8] leading-relaxed">
              {isFa
                ? 'پوشش هوشمند نوسانات ارزی برای محافظت از سرمایه در برابر تغییرات ناگهانی برابری ارزها. این پروتکل به صورت خودکار پوزیشن‌های متقابل را در استخرهای وثیقه ایجاد می‌کند.'
                : 'Deploy cryptographic algorithmic hedge positions to immunize cross-border treasury balances against sudden FX volatility and margin shifts.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35]">
              <span className="text-[11px] text-[#918fa1]">{isFa ? 'نسبت پوشش فعلی' : 'Current Hedge Ratio'}</span>
              <p className="text-lg font-bold text-[#4edea3] font-mono-numeric mt-1">
                {isFa ? `٪${toPersianDigits('94.2')}` : '94.2%'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35]">
              <span className="text-[11px] text-[#918fa1]">{isFa ? 'ارزش در معرض ریسک (VaR)' : 'Value at Risk (99% VaR)'}</span>
              <p className="text-lg font-bold text-[#4cd7f6] font-mono-numeric mt-1">
                {isFa ? `٪${toPersianDigits('0.12')}` : '0.12%'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35]">
              <span className="text-[11px] text-[#918fa1]">{isFa ? 'سودآوری سالانه استخر (APY)' : 'Vault Staking APY'}</span>
              <p className="text-lg font-bold text-[#c3c0ff] font-mono-numeric mt-1">
                {isFa ? `٪${toPersianDigits('5.45')}` : '5.45%'}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 bg-[#0a0e18] border border-[#262a35] p-5 rounded-xl flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-white">
              {isFa ? 'تنظیم سفارش پوشش ریسک فوری' : 'Quick Hedge Execution'}
            </span>

            <div>
              <label className="text-[11px] text-[#918fa1] block mb-1">
                {isFa ? 'دالان ارزی هدف:' : 'Target Currency Pair:'}
              </label>
              <select
                value={selectedCorridor}
                onChange={(e) => setSelectedCorridor(e.target.value)}
                className="w-full h-10 px-3 bg-[#171b26] border border-[#262a35] rounded-lg text-xs text-white outline-none"
              >
                <option value="USD/AED">USD / AED (Pegged 3.6725)</option>
                <option value="USD/IRR">USD / IRR (612,400 Rial)</option>
                <option value="EUR/USD">EUR / USD (1.0845)</option>
                <option value="AED/IRR">AED / IRR (166,750 Rial)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[#918fa1] block mb-1">
                {isFa ? 'حجم تخصیص جهت پوشش ریسک:' : 'Hedge Position Volume:'}
              </label>
              <input
                type="text"
                value={hedgeAmount}
                onChange={(e) => setHedgeAmount(e.target.value)}
                className="w-full h-10 px-3 bg-[#171b26] border border-[#262a35] rounded-lg text-xs font-mono-numeric text-white outline-none"
              />
            </div>

            {/* Dynamic Calculations */}
            <div className="p-2.5 rounded-lg bg-[#171b26]/60 border border-[#262a35] text-[11px] font-mono-numeric flex flex-col gap-1">
              <div className="flex justify-between text-[#918fa1]">
                <span>{isFa ? 'وثیقه الزامی (۱۱۵٪):' : 'Collateral Req (115%):'}</span>
                <span className="text-white font-bold">${collateralRequired.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#918fa1]">
                <span>{isFa ? 'کارمزد تخمینی شبکه:' : 'Est. Protocol Fee:'}</span>
                <span className="text-[#4edea3]">${estimatedFee.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Execution Progress Stages */}
          {isSimulating && (
            <div className="flex flex-col gap-1.5 py-1">
              <div className="flex justify-between text-[10px] text-[#4cd7f6] font-mono-numeric">
                <span>
                  {simulationStep === 1
                    ? 'STAGE 1: ROUTING VIA BFT MESH'
                    : simulationStep === 2
                    ? 'STAGE 2: LOCKING ESCROW VAULT'
                    : 'STAGE 3: VERIFYING HSM PROOF'}
                </span>
                <span>{simulationStep * 33}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#171b26] overflow-hidden">
                <motion.div
                  className="h-full bg-[#4f46e5]"
                  animate={{ width: `${simulationStep * 33}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={isSimulating}
            onClick={handleSimulateHedge}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              hedgeConfirmed
                ? 'bg-[#006e4b] text-[#67f4b7]'
                : isSimulating
                ? 'bg-[#313540] text-[#c7c4d8]'
                : 'bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-lg shadow-[#4f46e5]/30'
            }`}
          >
            {isSimulating ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                <span>{isFa ? 'در حال ثبت در قرارداد هوشمند...' : 'Deploying Smart Hedge Contract...'}</span>
              </>
            ) : hedgeConfirmed ? (
              <>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{isFa ? 'پوشش ریسک با موفقیت فعال شد!' : 'Hedge Position Activated!'}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">security</span>
                <span>{isFa ? 'تأیید و اجرای پوشش ارزی' : 'Execute Treasury Hedge'}</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
