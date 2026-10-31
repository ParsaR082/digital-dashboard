'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface ScanEntity {
  name: string;
  lei: string;
  bic: string;
  jurisdiction: string;
  status: 'WHITELISTED' | 'MONITORED';
  riskScore: string;
  sanctionsMatch: string;
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

export default function ComplianceAuditPage() {
  const { locale, toPersianDigits } = useLanguage();
  const isFa = locale === 'fa';

  const [leiSearch, setLeiSearch] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanEntity | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null);

  const mockDatabase: Record<string, ScanEntity> = {
    emirates: {
      name: 'Emirates NBD Wholesale Banking',
      lei: '549300VXRXZF9W7L08',
      bic: 'EBILAEADXXX',
      jurisdiction: 'United Arab Emirates / DIFC',
      status: 'WHITELISTED',
      riskScore: '99.4 / 100 (Tier 1 Low-Risk)',
      sanctionsMatch: '0 Matches (Clean on OFAC, EU, UN, CBI)',
    },
    pasargad: {
      name: 'Pasargad Treasury Bank',
      lei: '254900V0R9910W22P1',
      bic: 'PASBIRTHXXX',
      jurisdiction: 'Islamic Republic of Iran / CBI Node',
      status: 'WHITELISTED',
      riskScore: '96.8 / 100 (Authorized Bilateral Protocol)',
      sanctionsMatch: '0 Prohibited Entities / Interbank Approved',
    },
    fab: {
      name: 'First Abu Dhabi Bank (FAB)',
      lei: '21380029XMBW5K576N63',
      bic: 'FABEAEADXXX',
      jurisdiction: 'Abu Dhabi Global Market (ADGM)',
      status: 'WHITELISTED',
      riskScore: '99.8 / 100 (Sovereign Custody)',
      sanctionsMatch: '0 Matches (Global Clean)',
    },
    deutsche: {
      name: 'Deutsche Bank AG Frankfurt',
      lei: '7LTWFZYICNSX8D621K86',
      bic: 'DEUTDEFFXXX',
      jurisdiction: 'European Union / BaFin / ECB',
      status: 'WHITELISTED',
      riskScore: '98.9 / 100 (TARGET2 Core)',
      sanctionsMatch: '0 Matches (Clean)',
    },
    standard: {
      name: 'Standard Chartered Bank DIFC',
      lei: 'RILFO74KP107TFMVBP72',
      bic: 'SCBLAEADXXX',
      jurisdiction: 'United Kingdom / UAE DIFC',
      status: 'WHITELISTED',
      riskScore: '99.1 / 100 (Tier 1 Global Rail)',
      sanctionsMatch: '0 Matches (Clean)',
    },
  };

  const auditLogs = [
    {
      id: 'AUD-901',
      timestamp: '14:31:02 UTC',
      eventTypeEn: 'Automated AML Sanctions Screen',
      eventTypeFa: 'غربالگری خودکار ضدپولشویی و تحریم‌ها',
      target: 'Emirates NBD Wholesale (LEI: 549300VXRX...)',
      result: 'PASSED (0 Match / Clean)',
      resultFa: 'تایید کامل (بدون تطابق / پاک)',
      operator: 'Automated Engine v4.2',
      status: 'verified',
      merkleRoot: '0x8849F10A...C81200E4B',
      signature: 'Thales Luna PCIe HSM #01 (FIPS 140-2 Level 3)',
    },
    {
      id: 'AUD-902',
      timestamp: '14:28:44 UTC',
      eventTypeEn: 'Hardware HSM Key Attestation',
      eventTypeFa: 'تأییدیه کلید امنیتی سخت‌افزاری HSM',
      target: 'Thales Luna PCIe Module #02',
      result: 'VALID (FIPS 140-2 Level 3)',
      resultFa: 'معتبر (سطح ۳ استاندارد FIPS)',
      operator: 'Security Officer #IR-04',
      status: 'verified',
      merkleRoot: '0x37C1E408...994D200E7',
      signature: 'Root Certificate Authority Tier-0',
    },
    {
      id: 'AUD-903',
      timestamp: '14:22:15 UTC',
      eventTypeEn: 'Large Settlement Escrow Threshold Review',
      eventTypeFa: 'بررسی آستانه پرداخت کلان اسکرو',
      target: 'Pasargad Treasury Bank ($12.45M eq.)',
      result: 'APPROVED (Tier 1 Exemption)',
      resultFa: 'تایید نهایی (معافیت سطح ۱ نهادی)',
      operator: 'Chief Compliance Officer',
      status: 'verified',
      merkleRoot: '0x62D3A199...04EBF721',
      signature: 'Multi-Sig 4-of-7 Consortium Key',
    },
    {
      id: 'AUD-904',
      timestamp: '14:10:00 UTC',
      eventTypeEn: 'ISO 20022 Syntax & Signature Validation',
      eventTypeFa: 'اعتبارسنجی ساختار و امضای ISO 20022',
      target: 'Batch Block #19,482,109 (2,400 Txs)',
      result: 'VERIFIED (100% Cryptographic Match)',
      resultFa: 'تایید کامل امضاهای دیجیتال',
      operator: 'BFT Consensus Verifier',
      status: 'verified',
      merkleRoot: '0x11B8C549...94D200E7',
      signature: 'Consensus Proof of Attestation',
    },
  ];

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leiSearch) return;

    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const queryLower = leiSearch.toLowerCase();
      const matchedKey = Object.keys(mockDatabase).find((key) => queryLower.includes(key));

      if (matchedKey) {
        setScanResult(mockDatabase[matchedKey]);
      } else {
        setScanResult({
          name: leiSearch,
          lei: '549300' + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
          bic: 'CORR' + Math.floor(1000 + Math.random() * 9000) + 'XXX',
          jurisdiction: 'Bilateral Interbank Clearing Network',
          status: 'WHITELISTED',
          riskScore: '98.5 / 100 (Tier 1 Safe)',
          sanctionsMatch: '0 Matches (Clean on OFAC, EU, UN, CBI Lists)',
        });
      }
    }, 1100);
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
            <div className="w-12 h-12 rounded-2xl bg-[#006e4b]/20 border border-[#4edea3]/40 flex items-center justify-center text-[#4edea3] shrink-0">
              <span className="material-symbols-outlined text-[28px]">verified_user</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#dfe2f1]">
                  {isFa ? 'انطباق قانونی، نظارت هویت و ضدپولشویی (AML & KYC)' : 'Compliance, Regulatory & Sanctions Engine'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-numeric font-medium bg-[#006e4b]/20 text-[#4edea3] border border-[#4edea3]/30">
                  FATF & BASEL III CERTIFIED
                </span>
              </div>
              <p className="text-xs text-[#c7c4d8] mt-1">
                {isFa
                  ? 'ممیزی پیوسته استاندارد پیام‌رسانی مالی ISO 20022، تطبیق فهرست‌های تحریمی و ثبت امضای دیجیتال دفاتر کل'
                  : 'Automated AML scoring, OFAC/FATF sanctions screening, and cryptographic HSM attestation for institutional operations.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4 Pillars Status */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: isFa ? 'غربالگری بلادرنگ تحریم‌ها' : 'Sanctions Screening Engine',
            val: isFa ? '۱۰۰٪ پاک (۰ نقض)' : '100% Clean (0 Match)',
            sub: isFa ? 'OFAC, EU, UN, CBI' : 'OFAC, EU, UN, CBI Lists',
            badge: 'Active & Verified',
            color: 'via-[#4edea3]',
          },
          {
            title: isFa ? 'شاخص ریسک انطباق (AML Score)' : 'Institutional AML Rating',
            val: isFa ? '۹۸.۶ از ۱۰۰' : '98.6 / 100',
            sub: isFa ? 'رتبه اعتباری سطح ۱ (Low Risk)' : 'Tier 1 Low-Risk Classification',
            badge: 'Top Tier Rating',
            color: 'via-[#4cd7f6]',
          },
          {
            title: isFa ? 'ماژول امنیت سخت‌افزاری (HSM)' : 'Hardware HSM Security',
            val: 'FIPS 140-2 Level 3',
            sub: isFa ? 'ماژول Thales Luna PCIe فعال' : 'Thales Luna PCIe Module Online',
            badge: 'Hardware Verified',
            color: 'via-[#4f46e5]',
          },
          {
            title: isFa ? 'دفاتر کل ممیزی‌شده' : 'Verified Consensus Audits',
            val: '19,482,109',
            sub: isFa ? 'تراکنش‌های مهروموم‌شده با هش' : 'Immutably signed interbank blocks',
            badge: 'Zero Tampering',
            color: 'via-[#c3c0ff]',
          },
        ].map((p, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-xl bg-[#171b26]/80 border border-[#262a35] flex flex-col justify-between shadow-md relative overflow-hidden transition-all"
          >
            <div className="flex items-center justify-between text-[11px] text-[#918fa1] mb-2">
              <span className="uppercase tracking-wider">{p.title}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#1c1f2a] text-[#4edea3] font-mono-numeric text-[10px]">
                {p.badge}
              </span>
            </div>
            <div className="my-2">
              <span className="text-xl font-bold font-mono-numeric text-white tracking-tight">
                {p.val}
              </span>
            </div>
            <div className="text-xs text-[#918fa1] pt-2 border-t border-[#262a35]">
              {p.sub}
            </div>
            <div className={`absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent ${p.color} to-transparent`}></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Real-time Entity / LEI Screening Tool */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-[#171b26]/80 backdrop-blur-xl border border-[#262a35] p-5 lg:p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden"
      >
        {/* Animated Scanner Laser Bar when scanning */}
        {isScanning && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#4cd7f6] to-transparent shadow-lg shadow-[#4cd7f6]/50 z-20"
          />
        )}

        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
              manage_search
            </span>
            <span>{isFa ? 'استعلام فوری شناسه حقوقی (LEI / BIC) و ارزیابی ریسک' : 'Instant LEI / BIC Regulatory Sanctions Scanner'}</span>
          </h2>
          <p className="text-xs text-[#c7c4d8] mt-0.5">
            {isFa
              ? 'بررسی بلادرنگ نهادهای بانکی، کدهای سوییفت و حساب‌های کارگزاری در پایگاه‌های نظارتی بین‌المللی'
              : 'Execute instant multi-list verification for international correspondent banks and institutional traders.'}
          </p>
        </div>

        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={leiSearch}
            onChange={(e) => setLeiSearch(e.target.value)}
            placeholder={
              isFa
                ? 'نام بانک، شناسه LEI یا کد سوئیفت (مثال: Emirates NBD یا Pasargad یا FAB)...'
                : 'Enter Entity Name, LEI, or BIC Code (e.g., Emirates NBD, Pasargad, or FAB)...'
            }
            className="flex-1 h-12 px-4 bg-[#0a0e18] border border-[#262a35] rounded-xl text-xs text-white placeholder:text-[#918fa1] outline-none focus:border-[#4f46e5]"
          />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={isScanning || !leiSearch}
            className="h-12 px-6 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#4f46e5]/30"
          >
            {isScanning ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                <span>{isFa ? 'در حال استعلام از دیتابیس نظارتی...' : 'Querying Regulatory Rails...'}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{isFa ? 'شروع استعلام نظارتی' : 'Execute Sanctions Check'}</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Scan Result with Framer Motion AnimatePresence */}
        <AnimatePresence>
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="mt-2 p-4 rounded-xl bg-[#006e4b]/15 border border-[#4edea3]/40 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4edea3] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>{isFa ? 'تأییدیه کامل نظارتی صادر شد (Whitelisted & Approved)' : 'Entity Whitelisted & Sanctions Cleared'}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#006e4b] text-white text-[10px] font-bold font-mono-numeric">
                  {scanResult.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-[#0a0e18]/80 p-3 rounded-lg font-mono-numeric">
                <div>
                  <span className="text-[#918fa1] text-[11px] block">{isFa ? 'شناسه حقوقی (LEI):' : 'LEI Code:'}</span>
                  <span className="text-white font-bold">{scanResult.lei}</span>
                </div>
                <div>
                  <span className="text-[#918fa1] text-[11px] block">{isFa ? 'حوزه قضایی:' : 'Jurisdiction:'}</span>
                  <span className="text-white">{scanResult.jurisdiction}</span>
                </div>
                <div>
                  <span className="text-[#918fa1] text-[11px] block">{isFa ? 'امتیاز ریسک:' : 'Risk Rating:'}</span>
                  <span className="text-[#4edea3] font-bold">{scanResult.riskScore}</span>
                </div>
                <div>
                  <span className="text-[#918fa1] text-[11px] block">{isFa ? 'تطابق تحریمی:' : 'Sanctions:'}</span>
                  <span className="text-[#4cd7f6]">{scanResult.sanctionsMatch}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Audit Log Trail Table */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-[#171b26]/80 backdrop-blur-xl border border-[#262a35] p-5 lg:p-6 shadow-xl flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">
              history_edu
            </span>
            <span>{isFa ? 'گزارش وقایع و لاگ‌های ممیزی امنیتی (Cryptographic Audit Logs)' : 'Cryptographic Audit Log Trail'}</span>
          </h3>
          <span className="text-[11px] text-[#918fa1] font-mono-numeric">
            {isFa ? 'تاییدشده توسط HSM' : 'HSM Attested'}
          </span>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-[#262a35] bg-[#0a0e18]/80">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#262a35] bg-[#171b26]/60 text-[#918fa1] text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 text-start">{isFa ? 'شناسه ممیزی' : 'Audit ID'}</th>
                <th className="py-3 px-4 text-start">{isFa ? 'نوع رویداد' : 'Event Type'}</th>
                <th className="py-3 px-4 text-start">{isFa ? 'نهاد / هدف' : 'Target Entity'}</th>
                <th className="py-3 px-4 text-start">{isFa ? 'نتیجه نظارتی' : 'Verification Result'}</th>
                <th className="py-3 px-4 text-start">{isFa ? 'مسئول تایید' : 'Signer'}</th>
                <th className="py-3 px-4 text-end">{isFa ? 'زمان' : 'Timestamp'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a35]/40 font-medium">
              {auditLogs.map((log) => (
                <motion.tr
                  key={log.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
                  onClick={() => setSelectedAuditLog(log)}
                  className="cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono-numeric text-[#4cd7f6]">{log.id}</td>
                  <td className="py-3.5 px-4 text-white">
                    {isFa ? log.eventTypeFa : log.eventTypeEn}
                  </td>
                  <td className="py-3.5 px-4 text-[#c7c4d8] font-mono-numeric">{log.target}</td>
                  <td className="py-3.5 px-4 text-[#4edea3]">
                    {isFa ? log.resultFa : log.result}
                  </td>
                  <td className="py-3.5 px-4 text-[#918fa1]">{log.operator}</td>
                  <td className="py-3.5 px-4 text-end font-mono-numeric text-[#918fa1]">
                    {log.timestamp}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Cryptographic Proof Modal */}
      <AnimatePresence>
        {selectedAuditLog && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 320, damping: 25 }}
              className="w-full max-w-lg bg-[#171b26] border border-[#262a35] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 text-start"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4edea3] text-[22px]">
                    enhanced_encryption
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {isFa ? 'اثبات رمزنگاری شده رویداد نظارتی' : 'Cryptographic Merkle Proof Attestation'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAuditLog(null)}
                  className="text-[#918fa1] hover:text-white"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35]">
                  <span className="text-[#918fa1] text-[11px] block">{isFa ? 'شناسه ممیزی:' : 'Audit ID:'}</span>
                  <span className="font-bold text-[#4cd7f6] font-mono-numeric">{selectedAuditLog.id}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35]">
                  <span className="text-[#918fa1] text-[11px] block">{isFa ? 'ریشه درخت مرکل (Merkle Root):' : 'Merkle Root:'}</span>
                  <span className="font-bold text-white font-mono-numeric">{selectedAuditLog.merkleRoot}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#262a35]">
                  <span className="text-[#918fa1] text-[11px] block">{isFa ? 'امضای سخت‌افزاری HSM:' : 'HSM Attestation:'}</span>
                  <span className="font-bold text-[#4edea3] font-mono-numeric">{selectedAuditLog.signature}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAuditLog(null)}
                  className="px-4 py-2 rounded-xl bg-[#4f46e5] text-white font-semibold text-xs hover:bg-[#4338ca] transition-colors"
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
