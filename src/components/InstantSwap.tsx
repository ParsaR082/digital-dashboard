'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedNumber from '@/components/animations/AnimatedNumber';

export default function InstantSwap() {
  const { t, locale, toPersianDigits } = useLanguage();
  const isFa = locale === 'fa';

  const [fromCurrency, setFromCurrency] = useState<'USD' | 'AED'>('USD');
  const [toCurrency, setToCurrency] = useState<'AED' | 'USD'>('AED');
  const [amount, setAmount] = useState<string>('1500000');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [flipDegree, setFlipDegree] = useState(0);

  // Exchange rate: 1 USD = 3.673 AED
  const rate = 3.673;

  const numAmount = parseFloat(amount.replace(/,/g, '')) || 0;
  const calculatedOutput =
    fromCurrency === 'USD'
      ? Math.round(numAmount * rate)
      : Math.round(numAmount / rate);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFlipDegree((prev) => prev + 180);
  };

  const handleExecute = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setIsSuccess(false);

    setTimeout(() => {
      setIsExecuting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3500);
    }, 1200);
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-[#171b26]/80 backdrop-blur-xl border border-[#262a35] p-5 lg:p-6 shadow-xl h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#4edea3] text-[22px]">
              flash_on
            </span>
            <div className="flex flex-col text-start">
              <h3 className="text-base font-bold text-[#dfe2f1]">{t.terminalTitle}</h3>
              <span className="text-[11px] text-[#918fa1]">{t.terminalSub}</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono-numeric font-medium bg-[#006e4b]/20 text-[#4edea3] border border-[#4edea3]/30">
            {t.apiActive}
          </span>
        </div>

        <p className="text-xs text-[#c7c4d8] mb-4 text-start leading-relaxed">
          {t.terminalDesc}
        </p>

        {/* Swap Form Container */}
        <div className="flex flex-col gap-2 relative">
          {/* Source Field */}
          <div className="bg-[#0a0e18] border border-[#262a35] p-3 rounded-xl flex flex-col gap-1.5 text-start">
            <div className="flex items-center justify-between text-[#918fa1] text-[11px]">
              <span>{t.labelSendAmount}</span>
              <span className="font-mono-numeric">
                {isFa
                  ? fromCurrency === 'USD'
                    ? `${toPersianDigits('24,850,000')} دلار`
                    : `${toPersianDigits('92,000,000')} درهم`
                  : fromCurrency === 'USD'
                  ? 'Avail: $24,850,000'
                  : 'Avail: 92,000,000 AED'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-[#dfe2f1] text-lg font-bold font-mono-numeric outline-none text-start"
              />
              <span className="px-3 py-1 bg-[#1c1f2a] border border-[#313540] rounded-lg text-xs font-bold text-[#dfe2f1] shrink-0">
                {fromCurrency}
              </span>
            </div>
          </div>

          {/* Reverse Currency Button with animated 3D rotation */}
          <div className="flex justify-center -my-3 z-10">
            <motion.button
              type="button"
              animate={{ rotate: flipDegree }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSwapCurrencies}
              aria-label="Reverse Currencies"
              className="w-9 h-9 rounded-full bg-[#4f46e5] text-white flex items-center justify-center shadow-lg shadow-[#4f46e5]/40 border-2 border-[#171b26]"
            >
              <span className="material-symbols-outlined text-[18px]">swap_vert</span>
            </motion.button>
          </div>

          {/* Destination Field with Animated Slot Number */}
          <div className="bg-[#0a0e18] border border-[#262a35] p-3 rounded-xl flex flex-col gap-1.5 text-start">
            <div className="flex items-center justify-between text-[#918fa1] text-[11px]">
              <span>{t.labelReceiveAmount}</span>
              <span className="font-mono-numeric">
                {isFa
                  ? toCurrency === 'AED'
                    ? `${toPersianDigits('92,000,000')} درهم`
                    : `${toPersianDigits('24,850,000')} دلار`
                  : toCurrency === 'AED'
                  ? 'Avail: 92,000,000 AED'
                  : 'Avail: $24,850,000'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-[#4edea3] text-lg font-bold font-mono-numeric">
                <AnimatedNumber value={calculatedOutput} />
              </div>
              <span className="px-3 py-1 bg-[#1c1f2a] border border-[#313540] rounded-lg text-xs font-bold text-[#4edea3] shrink-0">
                {toCurrency}
              </span>
            </div>
          </div>
        </div>

        {/* Fee & Rate Summary Card */}
        <div className="mt-4 flex flex-col gap-2 p-3 rounded-xl bg-[#0a0e18]/60 border border-[#262a35] text-xs">
          <div className="flex justify-between items-center text-[#918fa1]">
            <span>{t.feeRoutingRate}</span>
            <span className="font-mono-numeric text-[#dfe2f1] font-semibold">
              {isFa
                ? `۱ USD = ${toPersianDigits('3.6730')} AED`
                : '1 USD = 3.6730 AED'}
            </span>
          </div>
          <div className="flex justify-between items-center text-[#918fa1]">
            <span>{t.feeProtocol}</span>
            <span className="font-mono-numeric text-[#4edea3] font-medium">
              {t.feeProtocolSubsidized}
            </span>
          </div>
          <div className="flex justify-between items-center text-[#918fa1]">
            <span>{t.feeSettlementMode}</span>
            <span className="font-mono-numeric text-[#4cd7f6] font-medium">
              {t.feeInstantState}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-5">
        <motion.button
          type="button"
          disabled={isExecuting}
          onClick={handleExecute}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs lg:text-sm flex items-center justify-center gap-2 shadow-xl transition-all duration-200 ${
            isSuccess
              ? 'bg-[#006e4b] text-[#67f4b7] border border-[#4edea3]'
              : isExecuting
              ? 'bg-[#313540] text-[#c7c4d8] cursor-wait'
              : 'bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-[#4f46e5]/30'
          }`}
        >
          {isExecuting ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">
                refresh
              </span>
              <span>{t.executingOrder}</span>
            </>
          ) : isSuccess ? (
            <>
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{t.orderSuccess}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">
                account_balance_wallet
              </span>
              <span>{t.btnExecuteOrder}</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
