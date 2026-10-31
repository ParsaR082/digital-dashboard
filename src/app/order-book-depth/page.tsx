'use client';

import React, { useState, useEffect } from 'react';
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

export default function OrderBookDepthPage() {
  const { locale, toPersianDigits } = useLanguage();
  const isFa = locale === 'fa';

  const [activePair, setActivePair] = useState('USD/AED');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [priceInput, setPriceInput] = useState('3.6725');
  const [amountInput, setAmountInput] = useState('250000');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  // Live fluctuating order book data
  const [asks, setAsks] = useState([
    { id: 1, price: 3.6730, size: 450000, total: 1980000, depth: 85 },
    { id: 2, price: 3.6728, size: 380000, total: 1530000, depth: 72 },
    { id: 3, price: 3.6727, size: 620000, total: 1150000, depth: 55 },
    { id: 4, price: 3.6726, size: 310000, total: 530000, depth: 32 },
    { id: 5, price: 3.6725, size: 220000, total: 220000, depth: 15 },
  ]);

  const [bids, setBids] = useState([
    { id: 1, price: 3.6724, size: 340000, total: 340000, depth: 20 },
    { id: 2, price: 3.6723, size: 510000, total: 850000, depth: 42 },
    { id: 3, price: 3.6721, size: 480000, total: 1330000, depth: 60 },
    { id: 4, price: 3.6720, size: 720000, total: 2050000, depth: 78 },
    { id: 5, price: 3.6718, size: 890000, total: 2940000, depth: 95 },
  ]);

  // Simulate subtle live order book micro-ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setAsks((prev) =>
        prev.map((item, idx) =>
          idx === 4
            ? {
                ...item,
                size: Math.max(150000, item.size + Math.floor((Math.random() - 0.5) * 20000)),
              }
            : item
        )
      );
      setBids((prev) =>
        prev.map((item, idx) =>
          idx === 0
            ? {
                ...item,
                size: Math.max(200000, item.size + Math.floor((Math.random() - 0.5) * 25000)),
              }
            : item
        )
      );
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setOrderFeedback(null);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderFeedback(
        isFa
          ? `سفارش نهادی با شناسه #ORD-${Math.floor(100000 + Math.random() * 900000)} در دفتر کل ثبت شد`
          : `Institutional Order #ORD-${Math.floor(100000 + Math.random() * 900000)} matched on BFT Mesh`
      );
      setTimeout(() => setOrderFeedback(null), 4000);
    }, 1000);
  };

  const handleQuickPercent = (pct: number) => {
    const totalAvail = 1000000;
    setAmountInput(Math.round((totalAvail * pct) / 100).toString());
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
            <div className="w-12 h-12 rounded-2xl bg-[#c3c0ff]/20 border border-[#c3c0ff]/40 flex items-center justify-center text-[#c3c0ff] shrink-0">
              <span className="material-symbols-outlined text-[28px]">candlestick_chart</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#dfe2f1]">
                  {isFa ? 'عمق بازار و تله‌متری دفتر سفارشات' : 'Order Book Depth & Market Telemetry'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-numeric font-medium bg-[#006e4b]/20 text-[#4edea3] border border-[#4edea3]/30">
                  L2 REALTIME
                </span>
              </div>
              <p className="text-xs text-[#c7c4d8] mt-1">
                {isFa
                  ? 'جریان زنده دفتر سفارشات سطح ۲، اسپرد بین‌بانکی و ثبت سفارشات الگوریتمی در شبکه مش فین‌ماتریکس'
                  : 'Level-2 order book ladder, continuous liquidity curves, and institutional low-latency order placement.'}
              </p>
            </div>
          </div>

          {/* Pair Selector */}
          <div className="flex items-center gap-2 bg-[#0a0e18] p-1.5 rounded-xl border border-[#262a35]">
            {['USD/AED', 'USD/IRR', 'EUR/USD', 'AED/IRR'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setActivePair(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-numeric font-semibold transition-all ${
                  activePair === p
                    ? 'bg-[#4f46e5] text-white shadow-md shadow-[#4f46e5]/40'
                    : 'text-[#918fa1] hover:text-[#dfe2f1]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Market Stats Bar */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-xl bg-[#171b26]/90 border border-[#262a35] text-xs">
        <div>
          <span className="text-[#918fa1] text-[11px]">{isFa ? 'آخرین قیمت:' : 'Last Price:'}</span>
          <p className="text-base font-bold font-mono-numeric text-[#4edea3] mt-0.5">3.6725</p>
        </div>
        <div>
          <span className="text-[#918fa1] text-[11px]">{isFa ? 'تغییر ۲۴ ساعته:' : '24h Change:'}</span>
          <p className="text-base font-bold font-mono-numeric text-[#4edea3] mt-0.5">+0.01%</p>
        </div>
        <div>
          <span className="text-[#918fa1] text-[11px]">{isFa ? 'سقف / کف روزانه:' : '24h High / Low:'}</span>
          <p className="text-sm font-bold font-mono-numeric text-white mt-0.5">3.6732 / 3.6720</p>
        </div>
        <div>
          <span className="text-[#918fa1] text-[11px]">{isFa ? 'اسپرد (فاصله خرید/فروش):' : 'Spread:'}</span>
          <p className="text-base font-bold font-mono-numeric text-[#4cd7f6] mt-0.5">0.0001 (0.002%)</p>
        </div>
        <div className="col-span-2 md:col-span-1">
          <span className="text-[#918fa1] text-[11px]">{isFa ? 'حجم کل بازار:' : '24h Vol (USD):'}</span>
          <p className="text-base font-bold font-mono-numeric text-[#dfe2f1] mt-0.5">$64,250,000</p>
        </div>
      </motion.div>

      {/* Main Order Book Grid: Book Ladder (8 cols) + Order Form (4 cols) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Order Book Ladder (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#171b26]/80 backdrop-blur-xl border border-[#262a35] p-5 lg:p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                format_list_bulleted
              </span>
              <span>{isFa ? 'دفتر سفارشات زنده (Order Book Ladder)' : 'Live Order Book Ladder'}</span>
            </h3>
            <span className="text-[11px] text-[#4edea3] font-mono-numeric flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping" />
              {isFa ? 'جریان زنده سطح ۲' : 'L2 Stream Active'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Asks (Sells) Table */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px] text-[#ffb4ab] font-bold px-2 pb-1 border-b border-[#262a35]">
                <span>{isFa ? 'سفارشات فروش (Asks)' : 'Asks (Sell Orders)'}</span>
                <span>{isFa ? 'حجم تجمیعی' : 'Cumulative'}</span>
              </div>
              <div className="flex flex-col gap-1">
                {asks.map((a) => (
                  <motion.button
                    key={a.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={() => {
                      setPriceInput(a.price.toString());
                      setOrderSide('buy');
                    }}
                    className="relative px-3 py-2 rounded-lg bg-[#0a0e18]/80 hover:bg-[#1c1f2a] transition-colors flex items-center justify-between text-xs font-mono-numeric overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-y-0 end-0 bg-[#ffb4ab]/15 rounded-e-lg pointer-events-none"
                      animate={{ width: `${a.depth}%` }}
                      transition={{ duration: 0.4 }}
                    />
                    <span className="text-[#ffb4ab] font-bold z-10">{a.price.toFixed(4)}</span>
                    <span className="text-[#dfe2f1] z-10">{a.size.toLocaleString()}</span>
                    <span className="text-[#918fa1] text-[11px] z-10">{a.total.toLocaleString()}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Bids (Buys) Table */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px] text-[#4edea3] font-bold px-2 pb-1 border-b border-[#262a35]">
                <span>{isFa ? 'سفارشات خرید (Bids)' : 'Bids (Buy Orders)'}</span>
                <span>{isFa ? 'حجم تجمیعی' : 'Cumulative'}</span>
              </div>
              <div className="flex flex-col gap-1">
                {bids.map((b) => (
                  <motion.button
                    key={b.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={() => {
                      setPriceInput(b.price.toString());
                      setOrderSide('sell');
                    }}
                    className="relative px-3 py-2 rounded-lg bg-[#0a0e18]/80 hover:bg-[#1c1f2a] transition-colors flex items-center justify-between text-xs font-mono-numeric overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-y-0 start-0 bg-[#4edea3]/15 rounded-s-lg pointer-events-none"
                      animate={{ width: `${b.depth}%` }}
                      transition={{ duration: 0.4 }}
                    />
                    <span className="text-[#4edea3] font-bold z-10">{b.price.toFixed(4)}</span>
                    <span className="text-[#dfe2f1] z-10">{b.size.toLocaleString()}</span>
                    <span className="text-[#918fa1] text-[11px] z-10">{b.total.toLocaleString()}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Depth Chart Visualizer (SVG) */}
          <div className="mt-2 pt-3 border-t border-[#262a35] flex flex-col gap-2">
            <span className="text-[11px] text-[#918fa1] font-semibold">
              {isFa ? 'نمودار پیوسته عمق نقدینگی (Depth Curve)' : 'Cumulative Liquidity Depth Curve'}
            </span>
            <div className="w-full h-24 bg-[#0a0e18] rounded-xl border border-[#262a35] p-2 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 600 80" preserveAspectRatio="none">
                {/* Bids Green Area */}
                <polygon
                  points="0,80 0,60 100,55 180,45 250,30 295,15 295,80"
                  fill="rgba(78, 222, 163, 0.25)"
                />
                <polyline
                  points="0,60 100,55 180,45 250,30 295,15"
                  fill="none"
                  stroke="#4edea3"
                  strokeWidth="2"
                />

                {/* Asks Red Area */}
                <polygon
                  points="305,80 305,15 350,30 420,48 500,58 600,65 600,80"
                  fill="rgba(255, 180, 171, 0.25)"
                />
                <polyline
                  points="305,15 350,30 420,48 500,58 600,65"
                  fill="none"
                  stroke="#ffb4ab"
                  strokeWidth="2"
                />

                {/* Mid market spread dotted line */}
                <line x1="300" y1="0" x2="300" y2="80" stroke="#918fa1" strokeDasharray="3 3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Order Placement Terminal (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#171b26]/80 backdrop-blur-xl border border-[#262a35] p-5 lg:p-6 shadow-xl flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-white">
                {isFa ? 'ثبت سفارش در دفتر کل' : 'Submit Institutional Order'}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#1c1f2a] text-[10px] font-mono-numeric text-[#4cd7f6]">
                FOK / IOC
              </span>
            </div>

            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#0a0e18] p-1 rounded-xl border border-[#262a35] mb-4">
              <button
                type="button"
                onClick={() => setOrderSide('buy')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  orderSide === 'buy'
                    ? 'bg-[#006e4b] text-[#67f4b7] shadow-md'
                    : 'text-[#918fa1] hover:text-[#dfe2f1]'
                }`}
              >
                {isFa ? 'خرید (Buy)' : 'Buy / Bid'}
              </button>
              <button
                type="button"
                onClick={() => setOrderSide('sell')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  orderSide === 'sell'
                    ? 'bg-[#93000a] text-[#ffdad6] shadow-md'
                    : 'text-[#918fa1] hover:text-[#dfe2f1]'
                }`}
              >
                {isFa ? 'فروش (Sell)' : 'Sell / Ask'}
              </button>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] text-[#918fa1] block mb-1">
                  {isFa ? 'نرخ مظنه (Price):' : 'Limit Price:'}
                </label>
                <input
                  type="text"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-full h-10 px-3 bg-[#0a0e18] border border-[#262a35] rounded-xl text-xs font-mono-numeric text-white outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] text-[#918fa1]">
                    {isFa ? 'حجم سفارش (Volume USD):' : 'Order Volume (USD):'}
                  </label>
                  {/* Percentage shortcuts */}
                  <div className="flex gap-1">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleQuickPercent(pct)}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono-numeric bg-[#1c1f2a] hover:bg-[#262a35] text-[#4cd7f6]"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full h-10 px-3 bg-[#0a0e18] border border-[#262a35] rounded-xl text-xs font-mono-numeric text-white outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35] text-xs flex flex-col gap-1.5 text-[#918fa1]">
                <div className="flex justify-between">
                  <span>{isFa ? 'ارزش کل سفارش:' : 'Total Value:'}</span>
                  <span className="font-mono-numeric text-white font-bold">
                    {(
                      (parseFloat(amountInput) || 0) * (parseFloat(priceInput) || 0)
                    ).toLocaleString()}{' '}
                    AED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{isFa ? 'کارمزد پروتکل:' : 'Taker Surcharge:'}</span>
                  <span className="font-mono-numeric text-[#4edea3]">0.00%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <AnimatePresence>
              {orderFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="p-3 mb-3 rounded-xl bg-[#006e4b]/20 border border-[#4edea3]/40 text-xs text-[#4edea3] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>{orderFeedback}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={isSubmitting}
              onClick={handlePlaceOrder}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                orderSide === 'buy'
                  ? 'bg-[#006e4b] hover:bg-[#00895c] text-white shadow-[#006e4b]/30'
                  : 'bg-[#93000a] hover:bg-[#b00020] text-white shadow-[#93000a]/30'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  <span>{isFa ? 'در حال تایید در اجماع...' : 'Matching in Mesh...'}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                  <span>
                    {isFa
                      ? orderSide === 'buy'
                        ? 'تأیید سفارش خرید نهادی'
                        : 'تأیید سفارش فروش نهادی'
                      : `Commit Institutional ${orderSide.toUpperCase()} Order`}
                  </span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
