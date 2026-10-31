'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Transaction } from '@/types/dashboard';

interface ExtendedTransaction extends Transaction {
  senderBic: string;
  receiverBic: string;
  isoMsgType: string;
  fee: string;
  railRoute: string;
}

export default function TransactionLedger() {
  const { t, locale, formatCurrency, toPersianDigits } = useLanguage();
  const isFa = locale === 'fa';

  const [filterQuery, setFilterQuery] = useState('');
  const [activeCurrencyFilter, setActiveCurrencyFilter] = useState<string>('ALL');
  const [displayedCount, setDisplayedCount] = useState<number>(7);
  const [selectedTx, setSelectedTx] = useState<ExtendedTransaction | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'details' | 'xml' | 'json'>('details');
  const [copied, setCopied] = useState(false);

  const rawTransactions: ExtendedTransaction[] = [
    {
      id: 'tx-1',
      hash: '0x89F4...b10A',
      counterpartyEn: 'Emirates NBD Wholesale',
      counterpartyFa: 'بانک ملی امارات (شعبه کلان)',
      subLocationEn: 'DIFC Gateway Corridor',
      subLocationFa: 'مرکز مالی بین‌المللی دبی (DIFC)',
      logoText: 'EN',
      logoColor: 'text-[#c3c0ff] bg-[#4f46e5]/20',
      amount: 12450000,
      currency: 'USD',
      corridor: 'USD ⇄ AED',
      status: 'settled',
      timestamp: '14:28:12 UTC',
      senderBic: 'EBILAEADXXX',
      receiverBic: 'FRNYUS33XXX',
      isoMsgType: 'pacs.009.001.08',
      fee: '$12.50 (Subsidized)',
      railRoute: 'SWIFT gpi ⇄ Fedwire Primary',
    },
    {
      id: 'tx-2',
      hash: '0x37C1...8A01',
      counterpartyEn: 'Pasargad Treasury Bank',
      counterpartyFa: 'بانک پاسارگاد (خزانه‌داری ارزی)',
      subLocationEn: 'Tehran Gateway Bridge',
      subLocationFa: 'شعبه میرداماد - تهران',
      logoText: 'PB',
      logoColor: 'text-[#4cd7f6] bg-[#03b5d3]/20',
      amount: 4500000000000,
      currency: 'IRR',
      corridor: 'IRR ⇄ EUR',
      status: 'clearing',
      timestamp: '14:26:45 UTC',
      senderBic: 'PASBIRTHXXX',
      receiverBic: 'CBAEAEADXXX',
      isoMsgType: 'pacs.008.001.09',
      fee: '450,000 IRR',
      railRoute: 'Shetab Interbank ⇄ ADGM Escrow',
    },
    {
      id: 'tx-3',
      hash: '0x74A0...42EF',
      counterpartyEn: 'Deutsche Bank AG Frankfurt',
      counterpartyFa: 'دویچه بانک فرانکفورت (TARGET2)',
      subLocationEn: 'TARGET2 Core Settlement',
      subLocationFa: 'میز خزانه‌داری فرانکفورت',
      logoText: 'DB',
      logoColor: 'text-[#4edea3] bg-[#006e4b]/20',
      amount: 8200000,
      currency: 'EUR',
      corridor: 'EUR ⇄ USD',
      status: 'settled',
      timestamp: '14:24:30 UTC',
      senderBic: 'DEUTDEFFXXX',
      receiverBic: 'CHASGB2LXXX',
      isoMsgType: 'pacs.009.001.08',
      fee: '€18.00',
      railRoute: 'TARGET2 ⇄ CHAPS London Bridge',
    },
    {
      id: 'tx-4',
      hash: '0x11B8...994D',
      counterpartyEn: 'Central Bank of Oman Custody',
      counterpartyFa: 'بانک مرکزی عمان (مسقط)',
      subLocationEn: 'Muscat Bilateral Escrow',
      subLocationFa: 'درگاه تسویه دوجانبه مسقط',
      logoText: 'CB',
      logoColor: 'text-[#c7c4d8] bg-[#313540]/60',
      amount: 18400000,
      currency: 'AED',
      corridor: 'AED ⇄ IRR',
      status: 'settled',
      timestamp: '14:21:05 UTC',
      senderBic: 'CBOMOMRXXXX',
      receiverBic: 'BKMTIRTHXXX',
      isoMsgType: 'pacs.008.001.09',
      fee: '25 AED',
      railRoute: 'Muscat Bilateral Gulf Rail',
    },
    {
      id: 'tx-5',
      hash: '0x62D3...F721',
      counterpartyEn: 'Standard Chartered DIFC',
      counterpartyFa: 'استاندارد چارترد شعبه DIFC',
      subLocationEn: 'GCC Real-time Clearing',
      subLocationFa: 'شبکه تسویه آنی خلیج فارس',
      logoText: 'SC',
      logoColor: 'text-[#c3c0ff] bg-[#4f46e5]/30',
      amount: 25000000,
      currency: 'USD',
      corridor: 'USD ⇄ AED',
      status: 'settled',
      timestamp: '14:18:22 UTC',
      senderBic: 'SCBLAEADXXX',
      receiverBic: 'EBILAEADXXX',
      isoMsgType: 'pacs.009.001.08',
      fee: '$22.00',
      railRoute: 'ADGM BFT Consortium Mesh',
    },
    {
      id: 'tx-6',
      hash: '0x44F0...BA12',
      counterpartyEn: 'Bank of China (Hong Kong)',
      counterpartyFa: 'بانک مرکزی چین (شعبه هنگ‌کنگ)',
      subLocationEn: 'CIPS Cross-Corridor Rail',
      subLocationFa: 'کریدور ارزی CIPS شانگهای',
      logoText: 'BC',
      logoColor: 'text-[#ffb4ab] bg-[#93000a]/20',
      amount: 98000000,
      currency: 'AED',
      corridor: 'AED ⇄ CNY',
      status: 'clearing',
      timestamp: '14:14:18 UTC',
      senderBic: 'BKCHHKHHXXX',
      receiverBic: 'FABEAEADXXX',
      isoMsgType: 'pacs.008.001.09',
      fee: '120 AED',
      railRoute: 'CIPS ⇄ ADGM Bilateral Gateway',
    },
    {
      id: 'tx-7',
      hash: '0x992B...CC34',
      counterpartyEn: 'First Abu Dhabi Bank (FAB)',
      counterpartyFa: 'بانک اول ابوظبی (FAB)',
      subLocationEn: 'ADGM Wholesale Node',
      subLocationFa: 'گره خزانه‌داری ابوظبی',
      logoText: 'FA',
      logoColor: 'text-[#4cd7f6] bg-[#03b5d3]/30',
      amount: 34500000,
      currency: 'AED',
      corridor: 'AED ⇄ USD',
      status: 'settled',
      timestamp: '14:12:00 UTC',
      senderBic: 'FABEAEADXXX',
      receiverBic: 'CITIUS33XXX',
      isoMsgType: 'pacs.009.001.08',
      fee: '40 AED',
      railRoute: 'ADGM RTGS Direct Settlement',
    },
    {
      id: 'tx-8',
      hash: '0x55E1...88F9',
      counterpartyEn: 'Bank Mellat International',
      counterpartyFa: 'بانک ملت بین‌الملل (استانبول)',
      subLocationEn: 'Istanbul Regional Clearing',
      subLocationFa: 'میز ارزی استانبول',
      logoText: 'BM',
      logoColor: 'text-[#4edea3] bg-[#006e4b]/30',
      amount: 2800000000000,
      currency: 'IRR',
      corridor: 'IRR ⇄ AED',
      status: 'settled',
      timestamp: '14:09:42 UTC',
      senderBic: 'BKMTTRISXXX',
      receiverBic: 'PASBIRTHXXX',
      isoMsgType: 'pacs.008.001.09',
      fee: '300,000 IRR',
      railRoute: 'Bilateral Escrow Swap Mesh',
    },
    {
      id: 'tx-9',
      hash: '0x22C9...A450',
      counterpartyEn: 'Qatar National Bank (QNB)',
      counterpartyFa: 'بانک ملی قطر (QNB)',
      subLocationEn: 'Doha Liquidity Hub',
      subLocationFa: 'کانون نقدینگی دوحه',
      logoText: 'QN',
      logoColor: 'text-[#c3c0ff] bg-[#4f46e5]/20',
      amount: 15600000,
      currency: 'USD',
      corridor: 'USD ⇄ AED',
      status: 'settled',
      timestamp: '14:06:15 UTC',
      senderBic: 'QNBAQAQAXXX',
      receiverBic: 'EBILAEADXXX',
      isoMsgType: 'pacs.009.001.08',
      fee: '$15.00',
      railRoute: 'GCC Interbank Direct',
    },
    {
      id: 'tx-10',
      hash: '0x88A1...F002',
      counterpartyEn: 'BNP Paribas Paris',
      counterpartyFa: 'بی‌ان‌پی پاریبا پاریس',
      subLocationEn: 'Eurozone Corporate Escrow',
      subLocationFa: 'اسکرو شرکتی حوزه یورو',
      logoText: 'BP',
      logoColor: 'text-[#4edea3] bg-[#006e4b]/20',
      amount: 6700000,
      currency: 'EUR',
      corridor: 'EUR ⇄ USD',
      status: 'settled',
      timestamp: '14:03:00 UTC',
      senderBic: 'BNPAFRPPXXX',
      receiverBic: 'FRNYUS33XXX',
      isoMsgType: 'pacs.008.001.09',
      fee: '€14.50',
      railRoute: 'TARGET2 ⇄ Fedwire Transatlantic',
    },
    {
      id: 'tx-11',
      hash: '0x71F3...990A',
      counterpartyEn: 'Central Bank of the UAE',
      counterpartyFa: 'بانک مرکزی امارات متحده عربی',
      subLocationEn: 'Sovereign Reserves Custody',
      subLocationFa: 'خزانه ذخایر حاکمیتی',
      logoText: 'CB',
      logoColor: 'text-[#4cd7f6] bg-[#03b5d3]/40',
      amount: 50000000,
      currency: 'AED',
      corridor: 'AED ⇄ USD',
      status: 'settled',
      timestamp: '13:58:30 UTC',
      senderBic: 'CBAEAEADXXX',
      receiverBic: 'FRNYUS33XXX',
      isoMsgType: 'pacs.009.001.08',
      fee: '$0.00 (Sovereign)',
      railRoute: 'Central Bank Bilateral Vault',
    },
    {
      id: 'tx-12',
      hash: '0x49E8...77D1',
      counterpartyEn: 'Bank Tejarat Treasury',
      counterpartyFa: 'بانک تجارت (میز خزانه‌داری مرکزی)',
      subLocationEn: 'Tehran Core Exchange Desk',
      subLocationFa: 'میز ارزی تالار تبادل تهران',
      logoText: 'BT',
      logoColor: 'text-[#4cd7f6] bg-[#03b5d3]/20',
      amount: 1950000000000,
      currency: 'IRR',
      corridor: 'IRR ⇄ EUR',
      status: 'clearing',
      timestamp: '13:54:10 UTC',
      senderBic: 'BTEJIRTHXXX',
      receiverBic: 'DEUTDEFFXXX',
      isoMsgType: 'pacs.008.001.09',
      fee: '190,000 IRR',
      railRoute: 'Shetab ⇄ EU Interbank Settlement',
    },
  ];

  const filtered = rawTransactions.filter((tx) => {
    const matchesSearch =
      tx.hash.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tx.counterpartyEn.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tx.counterpartyFa.includes(filterQuery) ||
      tx.corridor.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tx.senderBic.toLowerCase().includes(filterQuery.toLowerCase());

    const matchesCurrency =
      activeCurrencyFilter === 'ALL' || tx.currency === activeCurrencyFilter;

    return matchesSearch && matchesCurrency;
  });

  const visibleTransactions = filtered.slice(0, displayedCount);

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Hash,Counterparty,SenderBIC,ReceiverBIC,Amount,Currency,Corridor,Status,Timestamp,ISOType']
        .concat(
          rawTransactions.map(
            (t) =>
              `${t.hash},${t.counterpartyEn},${t.senderBic},${t.receiverBic},${t.amount},${t.currency},${t.corridor},${t.status},${t.timestamp},${t.isoMsgType}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'finmatrix_interbank_ledger.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-[#171b26]/80 backdrop-blur-xl border border-[#262a35] p-5 lg:p-6 shadow-xl flex flex-col justify-between h-full relative">
      {/* Top Header: Title & Action Buttons */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-col text-start">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#4f46e5] text-[22px]">
                receipt_long
              </span>
              <h3 className="text-base lg:text-lg font-bold text-[#dfe2f1] tracking-tight">
                {t.tableHeaderTitle}
              </h3>
            </div>
            <p className="text-xs text-[#c7c4d8] mt-0.5">{t.tableHeaderSub}</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-xl bg-[#1c1f2a] border border-[#262a35] text-[#dfe2f1] hover:bg-[#262a35] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>{t.btnExportCsv}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setSelectedTx(rawTransactions[0])}
              className="px-3 py-1.5 rounded-xl bg-[#4f46e5]/20 border border-[#4f46e5]/40 text-[#c3c0ff] hover:bg-[#4f46e5]/30 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">policy</span>
              <span>{t.btnAuditView}</span>
            </motion.button>
          </div>
        </div>

        {/* Search & Currency Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
          {/* Currency Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['ALL', 'USD', 'AED', 'EUR', 'IRR'].map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setActiveCurrencyFilter(curr)}
                className={`px-3 py-1 rounded-lg text-xs font-mono-numeric font-medium transition-all ${
                  activeCurrencyFilter === curr
                    ? 'bg-[#4f46e5] text-white shadow-md shadow-[#4f46e5]/30'
                    : 'bg-[#0a0e18] text-[#918fa1] hover:text-[#dfe2f1] border border-[#262a35]'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          {/* Quick Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder={isFa ? 'جستجوی هش، نهاد یا ارز...' : 'Search hash, bank, or rail...'}
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full sm:w-56 px-3 py-1.5 ps-8 rounded-xl bg-[#0a0e18] border border-[#262a35] text-xs text-[#dfe2f1] outline-none focus:border-[#4cd7f6] transition-colors"
            />
            <span className="material-symbols-outlined absolute start-2.5 top-2 text-[15px] text-[#918fa1]">
              search
            </span>
          </div>
        </div>

        {/* Table Container with Animated Rows */}
        <div className="w-full overflow-x-auto rounded-xl border border-[#262a35]/60 bg-[#0a0e18]/60">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-[#262a35] text-[#918fa1] text-[11px] font-semibold uppercase tracking-wider bg-[#171b26]/60">
                <th className="py-3 px-4 text-start">{t.thHash}</th>
                <th className="py-3 px-4 text-start">{t.thParty}</th>
                <th className="py-3 px-4 text-start">{t.thAmount}</th>
                <th className="py-3 px-4 text-start">{t.thRoute}</th>
                <th className="py-3 px-4 text-end">{t.thStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a35]/40 text-xs font-medium text-start">
              <AnimatePresence mode="popLayout">
                {visibleTransactions.map((tx, idx) => (
                  <motion.tr
                    key={tx.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-white/[0.04] cursor-pointer transition-colors duration-150 group"
                  >
                    {/* Hash with Click Feedback */}
                    <td className="py-3.5 px-4 font-mono-numeric font-medium text-[#4cd7f6] group-hover:text-white transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span>{tx.hash}</span>
                        <span className="material-symbols-outlined text-[13px] opacity-0 group-hover:opacity-100 text-[#918fa1] transition-opacity">
                          open_in_new
                        </span>
                      </div>
                    </td>

                    {/* Counterparty Entity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${tx.logoColor}`}
                        >
                          {tx.logoText}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#dfe2f1] group-hover:text-[#4cd7f6] transition-colors">
                            {isFa ? tx.counterpartyFa : tx.counterpartyEn}
                          </span>
                          <span className="text-[11px] text-[#918fa1] flex items-center gap-1.5">
                            <span>{isFa ? tx.subLocationFa : tx.subLocationEn}</span>
                            <span className="text-[10px] px-1 rounded bg-[#1c1f2a] border border-[#262a35]">
                              {tx.senderBic}
                            </span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Principal Volume */}
                    <td className="py-3.5 px-4 font-mono-numeric font-bold text-[#dfe2f1]">
                      {formatCurrency(tx.amount, tx.currency)}
                    </td>

                    {/* Corridor Rail */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#1c1f2a] border border-[#262a35] text-[11px] font-mono-numeric text-[#c7c4d8]">
                        {tx.corridor}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-end">
                      {tx.status === 'settled' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#006e4b]/20 border border-[#4edea3]/30 text-[#4edea3] text-[11px] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                          <span>{t.statusSettled}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#03b5d3]/20 border border-[#4cd7f6]/30 text-[#4cd7f6] text-[11px] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                          <span>{t.statusClearing}</span>
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Load More Button */}
        {displayedCount < filtered.length && (
          <div className="flex justify-center mt-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setDisplayedCount((prev) => prev + 4)}
              className="px-4 py-1.5 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] text-xs font-semibold text-[#4cd7f6] transition-colors border border-[#262a35]"
            >
              {isFa ? 'بارگذاری تراکنش‌های بیشتر...' : 'Load More Transactions...'}
            </motion.button>
          </div>
        )}
      </div>

      {/* Real-time Ticker Footer */}
      <div className="mt-4 pt-3 border-t border-[#262a35] flex flex-wrap items-center justify-between text-[11px] text-[#918fa1] font-mono-numeric">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
          <span>{t.tickerBlockHeight}</span>
        </span>
        <span className="text-[#c7c4d8]">{t.tickerEpoch}</span>
      </div>

      {/* ISO 20022 Audit Modal Inspector with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 320, damping: 25 }}
              className="relative z-10 w-full max-w-2xl rounded-2xl bg-[#171b26] border border-[#262a35] shadow-2xl p-6 flex flex-col gap-4 text-start max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#262a35] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4f46e5]/20 border border-[#4f46e5]/30 flex items-center justify-center text-[#c3c0ff]">
                    <span className="material-symbols-outlined text-[24px]">verified</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#dfe2f1]">
                      {isFa ? 'بازرسی تراکنش بین‌بانکی ISO 20022' : 'ISO 20022 Settlement Inspector'}
                    </h3>
                    <p className="text-xs text-[#918fa1] font-mono-numeric">
                      Message ID: {selectedTx.isoMsgType} • Hash: {selectedTx.hash}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="w-8 h-8 rounded-lg bg-[#1c1f2a] text-[#918fa1] hover:text-white flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* View Tabs */}
              <div className="flex items-center gap-2 border-b border-[#262a35] pb-2">
                <button
                  type="button"
                  onClick={() => setActiveModalTab('details')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeModalTab === 'details'
                      ? 'bg-[#4f46e5] text-white'
                      : 'text-[#918fa1] hover:text-[#dfe2f1]'
                  }`}
                >
                  {isFa ? 'خلاصه تسویه' : 'Settlement Details'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('xml')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono-numeric transition-all ${
                    activeModalTab === 'xml'
                      ? 'bg-[#4f46e5] text-white'
                      : 'text-[#918fa1] hover:text-[#dfe2f1]'
                  }`}
                >
                  XML ({selectedTx.isoMsgType})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('json')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono-numeric transition-all ${
                    activeModalTab === 'json'
                      ? 'bg-[#4f46e5] text-white'
                      : 'text-[#918fa1] hover:text-[#dfe2f1]'
                  }`}
                >
                  JSON Payload
                </button>
              </div>

              {/* Tab Content: Details */}
              {activeModalTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35] flex flex-col gap-1">
                    <span className="text-[#918fa1] text-[11px]">{isFa ? 'نهاد مبدأ (Sender BIC):' : 'Instructing Entity (Sender BIC):'}</span>
                    <span className="font-bold text-white text-sm">{isFa ? selectedTx.counterpartyFa : selectedTx.counterpartyEn}</span>
                    <span className="font-mono-numeric text-[#4cd7f6]">{selectedTx.senderBic}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35] flex flex-col gap-1">
                    <span className="text-[#918fa1] text-[11px]">{isFa ? 'نهاد مقصد (Receiver BIC):' : 'Creditor Entity (Receiver BIC):'}</span>
                    <span className="font-bold text-white text-sm">{isFa ? 'مرکز تسویه فین‌ماتریکس' : 'FinMatrix Settlement Core'}</span>
                    <span className="font-mono-numeric text-[#4edea3]">{selectedTx.receiverBic}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35] flex flex-col gap-1">
                    <span className="text-[#918fa1] text-[11px]">{isFa ? 'مبلغ و ارز پایه:' : 'Gross Amount & Currency:'}</span>
                    <span className="font-bold text-[#dfe2f1] text-base font-mono-numeric">
                      {formatCurrency(selectedTx.amount, selectedTx.currency)}
                    </span>
                    <span className="text-[11px] text-[#918fa1]">{isFa ? `کارمزد: ${selectedTx.fee}` : `Network Fee: ${selectedTx.fee}`}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35] flex flex-col gap-1">
                    <span className="text-[#918fa1] text-[11px]">{isFa ? 'مسیر ریل تسویه:' : 'Settlement Rail:'}</span>
                    <span className="font-semibold text-white">{selectedTx.railRoute}</span>
                    <span className="font-mono-numeric text-[#4edea3] text-[11px]">
                      {isFa ? 'تأیید رمزنگاری شده BFT Consensus' : 'BFT Byzantine Fault-Tolerant Finality'}
                    </span>
                  </div>
                </div>
              )}

              {/* Tab Content: Raw XML */}
              {activeModalTab === 'xml' && (
                <div className="relative">
                  <pre className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] text-[11px] font-mono-numeric text-[#4cd7f6] overflow-x-auto max-h-60 leading-relaxed">
{`<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:${selectedTx.isoMsgType}">
  <FICdtTrf>
    <GrpHdr>
      <MsgId>${selectedTx.id}-ISO20022-EXEC</MsgId>
      <CreDtTm>${new Date().toISOString()}</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>CLRG</SttlmMtd>
        <ClrSys>
          <Prtry>FINMATRIX_BFT_MESH</Prtry>
        </ClrSys>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <EndToEndId>${selectedTx.hash}</EndToEndId>
        <TxId>${selectedTx.id}</TxId>
      </PmtId>
      <IntrBkSttlmAmt Ccy="${selectedTx.currency}">${selectedTx.amount}.00</IntrBkSttlmAmt>
      <DbtrAgt><FinInstnId><BICFI>${selectedTx.senderBic}</BICFI></FinInstnId></DbtrAgt>
      <CdtrAgt><FinInstnId><BICFI>${selectedTx.receiverBic}</BICFI></FinInstnId></CdtrAgt>
    </CdtTrfTxInf>
  </FICdtTrf>
</Document>`}
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(`pacs.009:${selectedTx.hash}`)}
                    className="absolute top-2.5 end-2.5 px-2.5 py-1 rounded bg-[#1c1f2a] border border-[#262a35] text-[10px] text-white font-mono-numeric hover:bg-[#262a35]"
                  >
                    {copied ? 'COPIED!' : 'COPY XML'}
                  </button>
                </div>
              )}

              {/* Tab Content: JSON */}
              {activeModalTab === 'json' && (
                <div className="relative">
                  <pre className="p-4 rounded-xl bg-[#0a0e18] border border-[#262a35] text-[11px] font-mono-numeric text-[#4edea3] overflow-x-auto max-h-60 leading-relaxed">
{JSON.stringify(
  {
    schema: selectedTx.isoMsgType,
    blockHash: selectedTx.hash,
    timestamp: selectedTx.timestamp,
    counterparty: selectedTx.counterpartyEn,
    senderBic: selectedTx.senderBic,
    receiverBic: selectedTx.receiverBic,
    grossAmount: selectedTx.amount,
    currency: selectedTx.currency,
    rail: selectedTx.railRoute,
    status: selectedTx.status,
    signatureFips140: '0x992B4F81...ThalesLunaPCIeVerified',
  },
  null,
  2
)}
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(JSON.stringify(selectedTx, null, 2))}
                    className="absolute top-2.5 end-2.5 px-2.5 py-1 rounded bg-[#1c1f2a] border border-[#262a35] text-[10px] text-white font-mono-numeric hover:bg-[#262a35]"
                  >
                    {copied ? 'COPIED!' : 'COPY JSON'}
                  </button>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-[#262a35] pt-3 text-xs">
                <span className="text-[#918fa1] flex items-center gap-1.5 font-mono-numeric">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                  <span>HSM Cryptographic Attestation: VALID</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="px-4 py-1.5 rounded-xl bg-[#4f46e5] text-white font-semibold hover:bg-[#4338ca] transition-colors"
                >
                  {isFa ? 'بستن پنجره' : 'Dismiss Inspector'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
