'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface LedgerItem {
  id: string;
  hash: string;
  timestamp: string;
  senderEn: string;
  senderFa: string;
  senderBic: string;
  receiverEn: string;
  receiverFa: string;
  receiverBic: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'AED' | 'IRR';
  rail: string;
  status: 'settled' | 'clearing' | 'audited';
  isoMsgType: string;
}

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

export default function CrossBorderSettlementsPage() {
  const { t, locale, toPersianDigits, formatCurrency } = useLanguage();
  const isFa = locale === 'fa';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'settled' | 'clearing'>('all');
  const [selectedTx, setSelectedTx] = useState<LedgerItem | null>(null);
  const [copied, setCopied] = useState(false);

  const [transactions, setTransactions] = useState<LedgerItem[]>([
    {
      id: 'tx-101',
      hash: '0x89F47A92b10A4D92',
      timestamp: '14:28:12 UTC',
      senderEn: 'Emirates NBD Wholesale',
      senderFa: 'بانک ملی امارات (شعبه کلان)',
      senderBic: 'EBILAEADXXX',
      receiverEn: 'Federal Reserve Bank NY',
      receiverFa: 'فدرال رزرو نیویورک',
      receiverBic: 'FRNYUS33XXX',
      amount: 12450000,
      currency: 'USD',
      rail: 'SWIFT ⇄ Fedwire',
      status: 'settled',
      isoMsgType: 'pacs.009.001.08',
    },
    {
      id: 'tx-102',
      hash: '0x37C1E408A019B881',
      timestamp: '14:26:45 UTC',
      senderEn: 'Pasargad Treasury Bank',
      senderFa: 'خزانه‌داری بانک پاسارگاد',
      senderBic: 'PASBIRTHXXX',
      receiverEn: 'Central Bank of UAE (Abu Dhabi)',
      receiverFa: 'بانک مرکزی امارات (ابوظبی)',
      receiverBic: 'CBAEAEADXXX',
      amount: 4500000000000,
      currency: 'IRR',
      rail: 'Shetab ⇄ ADGM Gateway',
      status: 'clearing',
      isoMsgType: 'pacs.008.001.09',
    },
    {
      id: 'tx-103',
      hash: '0x74A0D9142EF6C302',
      timestamp: '14:24:30 UTC',
      senderEn: 'Deutsche Bank AG Frankfurt',
      senderFa: 'دویچه بانک فرانکفورت',
      senderBic: 'DEUTDEFFXXX',
      receiverEn: 'JPMorgan Chase London',
      receiverFa: 'جی‌پی مورگان چیس لندن',
      receiverBic: 'CHASGB2LXXX',
      amount: 8200000,
      currency: 'EUR',
      rail: 'TARGET2 ⇄ CHAPS',
      status: 'settled',
      isoMsgType: 'pacs.009.001.08',
    },
    {
      id: 'tx-104',
      hash: '0x11B8C54994D200E7',
      timestamp: '14:21:05 UTC',
      senderEn: 'Central Bank of Oman',
      senderFa: 'بانک مرکزی عمان (مسقط)',
      senderBic: 'CBOMOMRXXXX',
      receiverEn: 'Bank Mellat International',
      receiverFa: 'بانک ملت بین‌الملل',
      receiverBic: 'BKMTIRTHXXX',
      amount: 18400000,
      currency: 'AED',
      rail: 'Muscat Bilateral Rail',
      status: 'settled',
      isoMsgType: 'pacs.008.001.09',
    },
    {
      id: 'tx-105',
      hash: '0x62D3A19904EBF721',
      timestamp: '14:18:22 UTC',
      senderEn: 'Standard Chartered DIFC',
      senderFa: 'استاندارد چارترد مرکز مالی دبی',
      senderBic: 'SCBLAEADXXX',
      receiverEn: 'Qatar National Bank Doha',
      receiverFa: 'بانک ملی قطر (دوحه)',
      receiverBic: 'QNBAQAQAXXX',
      amount: 25000000,
      currency: 'USD',
      rail: 'GCC Real-time Clearing',
      status: 'settled',
      isoMsgType: 'pacs.009.001.08',
    },
    {
      id: 'tx-106',
      hash: '0x44F008E21980BA12',
      timestamp: '14:15:10 UTC',
      senderEn: 'Bank of China (Hong Kong)',
      senderFa: 'بانک مرکزی چین (شعبه هنگ‌کنگ)',
      senderBic: 'BKCHHKHHXXX',
      receiverEn: 'Tehran Interbank FX Desk',
      receiverFa: 'میز ارزی بین‌بانکی تهران',
      receiverBic: 'IRCENTRALXXX',
      amount: 98000000,
      currency: 'AED',
      rail: 'CIPS ⇄ Shetab Corridor',
      status: 'clearing',
      isoMsgType: 'pacs.008.001.09',
    },
    {
      id: 'tx-107',
      hash: '0x99A1C508119FE401',
      timestamp: '14:11:30 UTC',
      senderEn: 'First Abu Dhabi Bank (FAB)',
      senderFa: 'بانک اول ابوظبی (FAB)',
      senderBic: 'FABEAEADXXX',
      receiverEn: 'Bank Tejarat Treasury',
      receiverFa: 'خزانه‌داری بانک تجارت',
      receiverBic: 'BTEJIRTHXXX',
      amount: 32000000,
      currency: 'AED',
      rail: 'ADGM ⇄ Shetab Bilateral',
      status: 'settled',
      isoMsgType: 'pacs.009.001.08',
    },
    {
      id: 'tx-108',
      hash: '0x3344BA90C120489F',
      timestamp: '14:08:15 UTC',
      senderEn: 'BNP Paribas Paris',
      senderFa: 'بی‌ان‌پی پاریبا پاریس',
      senderBic: 'BNPAFRPPXXX',
      receiverEn: 'Pasargad Treasury Bank',
      receiverFa: 'بانک پاسارگاد تهران',
      receiverBic: 'PASBIRTHXXX',
      amount: 5400000,
      currency: 'EUR',
      rail: 'TARGET2 ⇄ Escrow Mesh',
      status: 'settled',
      isoMsgType: 'pacs.008.001.09',
    },
  ]);

  const handleSimulatePing = () => {
    const randomHex = Math.floor(Math.random() * 0xffffffffffff).toString(16).toUpperCase();
    const newTx: LedgerItem = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      hash: `0x${randomHex.padStart(16, '0')}`,
      timestamp: `${new Date().toISOString().slice(11, 19)} UTC`,
      senderEn: 'First Abu Dhabi Bank (ADGM Node)',
      senderFa: 'بانک اول ابوظبی (گره ADGM)',
      senderBic: 'FABEAEADXXX',
      receiverEn: 'Pasargad Treasury Bank',
      receiverFa: 'خزانه‌داری بانک پاسارگاد',
      receiverBic: 'PASBIRTHXXX',
      amount: Math.floor(5000000 + Math.random() * 20000000),
      currency: 'AED',
      rail: 'ADGM ⇄ Shetab Bilateral',
      status: 'settled',
      isoMsgType: 'pacs.009.001.08',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.hash.toLowerCase().includes(search.toLowerCase()) ||
      tx.senderEn.toLowerCase().includes(search.toLowerCase()) ||
      tx.senderFa.includes(search) ||
      tx.receiverEn.toLowerCase().includes(search.toLowerCase()) ||
      tx.receiverFa.includes(search) ||
      tx.rail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : tx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 text-start"
    >
      {/* Top Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#171b26]/90 via-[#1c1f2a]/80 to-[#171b26]/90 backdrop-blur-xl border border-[#262a35] p-6 shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4f46e5]/20 border border-[#4f46e5]/40 flex items-center justify-center text-[#c3c0ff] shrink-0">
              <span className="material-symbols-outlined text-[28px]">receipt_long</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#dfe2f1]">
                  {isFa ? 'دفترکل تسویه و تبادلات فرامرزی' : 'Cross-Border Interbank Settlement Ledger'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-numeric font-medium bg-[#006e4b]/20 text-[#4edea3] border border-[#4edea3]/30">
                  ISO 20022 LIVE
                </span>
              </div>
              <p className="text-xs text-[#c7c4d8] mt-1">
                {isFa
                  ? 'ثبت و پایش بلادرنگ تراکنش‌های تسویه بین‌بانکی میان درگاه‌های سوئیفت، شتاب، تارگت۲ و بازارهای مالی منطقه'
                  : 'Real-time cryptographic audit trail of bilateral clearing between SWIFT, Shetab, TARGET2, and ADGM rails.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSimulatePing}
              className="px-3.5 py-2 rounded-xl bg-[#4f46e5] text-white text-xs font-semibold shadow-lg shadow-[#4f46e5]/30 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px] animate-pulse">add_circle</span>
              <span>{isFa ? 'ثبت تراکنش زنده نمونه' : 'Simulate Live Settlement'}</span>
            </motion.button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#918fa1] font-mono-numeric">
                {isFa ? 'سرعت همگام‌سازی:' : 'Sync Latency:'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#0a0e18] border border-[#262a35] text-xs font-mono-numeric font-bold text-[#4edea3]">
                {isFa ? `${toPersianDigits('42')} میلی‌ثانیه` : '42 ms'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rail Performance Cards with Framer Motion hover elevation */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            nameEn: 'SWIFT ↔ Fedwire',
            nameFa: 'کریدور سوئیفت به فد‌وایر',
            status: 'Operational',
            statusFa: 'عملیاتی',
            vol: '$148.4M',
            volFa: `${toPersianDigits('148.4')} میلیون دلار`,
            tps: '2,400 TPS',
            color: 'border-[#4f46e5]/40',
          },
          {
            nameEn: 'Shetab ⇄ ADGM Bridge',
            nameFa: 'پل ارتباطی شتاب به ابوظبی',
            status: 'Operational',
            statusFa: 'عملیاتی',
            vol: '92M AED',
            volFa: `${toPersianDigits('92')} میلیون درهم`,
            tps: '1,850 TPS',
            color: 'border-[#4cd7f6]/40',
          },
          {
            nameEn: 'TARGET2 Euro Core',
            nameFa: 'شبکه تسویه تارگت۲ یورو',
            status: 'Operational',
            statusFa: 'عملیاتی',
            vol: '€48.2M',
            volFa: `${toPersianDigits('48.2')} میلیون یورو`,
            tps: '3,100 TPS',
            color: 'border-[#4edea3]/40',
          },
          {
            nameEn: 'CIPS ⇄ Shetab Mesh',
            nameFa: 'دالان یوآن و ریال CIPS',
            status: 'Active Clearing',
            statusFa: 'پایاپای فعال',
            vol: '$34.0M eq.',
            volFa: `${toPersianDigits('34.0')} میلیون دلار`,
            tps: '980 TPS',
            color: 'border-[#c3c0ff]/40',
          },
        ].map((rail, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`p-4 rounded-xl bg-[#171b26]/80 border ${rail.color} flex flex-col justify-between shadow-md transition-all`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#dfe2f1]">
                {isFa ? rail.nameFa : rail.nameEn}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            </div>
            <div className="my-1">
              <span className="text-xl font-bold font-mono-numeric text-white">
                {isFa ? rail.volFa : rail.vol}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#918fa1] mt-2 pt-2 border-t border-[#262a35]">
              <span>{isFa ? rail.statusFa : rail.status}</span>
              <span className="font-mono-numeric">{rail.tps}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Explorer Table Container */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-[#171b26]/80 backdrop-blur-xl border border-[#262a35] p-5 lg:p-6 shadow-xl flex flex-col gap-4"
      >
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-[#918fa1] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isFa
                  ? 'جستجو بر اساس هش، بانک فرستنده یا گیرنده...'
                  : 'Search by hash, sender or receiver entity...'
              }
              className="w-full h-10 ps-10 pe-4 bg-[#0a0e18] border border-[#262a35] rounded-xl text-xs text-[#dfe2f1] placeholder:text-[#918fa1] focus:outline-none focus:border-[#4f46e5]"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Status Filters */}
            <div className="flex items-center bg-[#0a0e18] p-1 rounded-xl border border-[#262a35]">
              {(['all', 'settled', 'clearing'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === s
                      ? 'bg-[#4f46e5] text-white shadow-md'
                      : 'text-[#918fa1] hover:text-[#dfe2f1]'
                  }`}
                >
                  {s === 'all'
                    ? isFa
                      ? 'همه'
                      : 'All'
                    : s === 'settled'
                    ? isFa
                      ? 'تسویه‌شده'
                      : 'Settled'
                    : isFa
                    ? 'درحال پایاپای'
                    : 'Clearing'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-[#262a35] bg-[#0a0e18]/80">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#262a35] bg-[#171b26]/60 text-[#918fa1] text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 text-start">{t.thHash}</th>
                <th className="py-3.5 px-4 text-start">{isFa ? 'فرستنده (مبدا)' : 'Sender Entity'}</th>
                <th className="py-3.5 px-4 text-start">{isFa ? 'گیرنده (مقصد)' : 'Receiver Entity'}</th>
                <th className="py-3.5 px-4 text-start">{t.thAmount}</th>
                <th className="py-3.5 px-4 text-start">{t.thRoute}</th>
                <th className="py-3.5 px-4 text-center">{isFa ? 'پیام ISO' : 'ISO Type'}</th>
                <th className="py-3.5 px-4 text-center">{t.thStatus}</th>
                <th className="py-3.5 px-4 text-end">{isFa ? 'جزئیات' : 'Inspect'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a35]/40 font-medium">
              <AnimatePresence mode="popLayout">
                {filtered.map((tx, idx) => (
                  <motion.tr
                    key={tx.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: idx * 0.02 }}
                    className="hover:bg-white/[0.04] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono-numeric text-[#4cd7f6]">{tx.hash}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-[#dfe2f1] font-semibold">
                          {isFa ? tx.senderFa : tx.senderEn}
                        </span>
                        <span className="text-[10px] text-[#918fa1] font-mono-numeric">
                          BIC: {tx.senderBic}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-[#dfe2f1] font-semibold">
                          {isFa ? tx.receiverFa : tx.receiverEn}
                        </span>
                        <span className="text-[10px] text-[#918fa1] font-mono-numeric">
                          BIC: {tx.receiverBic}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono-numeric font-bold text-white">
                      {formatCurrency(tx.amount, tx.currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#1c1f2a] border border-[#262a35] text-[11px] font-mono-numeric text-[#c7c4d8]">
                        {tx.rail}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono-numeric text-[11px] text-[#c3c0ff]">
                        {tx.isoMsgType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {tx.status === 'settled' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#006e4b]/20 border border-[#4edea3]/30 text-[#4edea3] text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                          <span>{t.statusSettled}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#03b5d3]/20 border border-[#4cd7f6]/30 text-[#4cd7f6] text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                          <span>{t.statusClearing}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-end">
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setSelectedTx(tx)}
                        className="px-2.5 py-1 rounded-lg bg-[#1c1f2a] hover:bg-[#4f46e5] text-[#dfe2f1] hover:text-white transition-colors text-[11px] font-semibold"
                      >
                        {isFa ? 'بررسی پیام' : 'Inspect'}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ISO 20022 Message Inspector Modal with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', stiffness: 320, damping: 25 }}
              className="w-full max-w-2xl bg-[#171b26] border border-[#262a35] rounded-2xl shadow-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">
                    terminal
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {isFa
                      ? `محتوای پیام بانکی ISO 20022 (${selectedTx.isoMsgType})`
                      : `ISO 20022 Interbank Message (${selectedTx.isoMsgType})`}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="text-[#918fa1] hover:text-white"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-[#0a0e18] p-3 rounded-xl border border-[#262a35]">
                <div>
                  <span className="text-[#918fa1]">{isFa ? 'شناسه یکتا:' : 'Message ID:'}</span>
                  <p className="font-mono-numeric font-bold text-[#4cd7f6]">{selectedTx.hash}</p>
                </div>
                <div>
                  <span className="text-[#918fa1]">{isFa ? 'زمان ایجاد:' : 'Timestamp:'}</span>
                  <p className="font-mono-numeric text-[#dfe2f1]">{selectedTx.timestamp}</p>
                </div>
                <div>
                  <span className="text-[#918fa1]">{isFa ? 'بانک مبدا (BIC):' : 'Debtor Agent:'}</span>
                  <p className="font-mono-numeric text-white">{selectedTx.senderBic}</p>
                </div>
                <div>
                  <span className="text-[#918fa1]">{isFa ? 'بانک مقصد (BIC):' : 'Creditor Agent:'}</span>
                  <p className="font-mono-numeric text-white">{selectedTx.receiverBic}</p>
                </div>
              </div>

              <div className="bg-[#0a0e18] border border-[#262a35] rounded-xl p-3 font-mono-numeric text-xs text-[#c3c0ff] overflow-x-auto max-h-60" dir="ltr">
                <pre>
{`<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:${selectedTx.isoMsgType}">
  <FICdtTrf>
    <GrpHdr>
      <MsgId>${selectedTx.hash}</MsgId>
      <CreDtTm>2026-10-28T${selectedTx.timestamp.replace(' UTC', 'Z')}</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>CLRG</SttlmMtd>
        <ClrSys><Cd>${selectedTx.rail.split(' ')[0]}</Cd></ClrSys>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <IntrBkSttlmAmt Ccy="${selectedTx.currency}">${selectedTx.amount}</IntrBkSttlmAmt>
      <DbtrAgt><FinInstnId><BICFI>${selectedTx.senderBic}</BICFI></FinInstnId></DbtrAgt>
      <CdtrAgt><FinInstnId><BICFI>${selectedTx.receiverBic}</BICFI></FinInstnId></CdtrAgt>
    </CdtTrfTxInf>
  </FICdtTrf>
</Document>`}
                </pre>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedTx.hash);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1c1f2a] hover:bg-[#262a35] text-xs font-semibold text-[#dfe2f1] transition-colors"
                >
                  {copied ? (isFa ? 'کپی شد!' : 'Copied!') : (isFa ? 'کپی شناسه هش' : 'Copy Hash')}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="px-4 py-2 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-xs font-semibold text-white transition-colors"
                >
                  {isFa ? 'بستن' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
