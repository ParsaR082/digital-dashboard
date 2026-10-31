'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedNumberProps) {
  const { locale, toPersianDigits } = useLanguage();
  const isFa = locale === 'fa';

  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const formattedStr = isFa
    ? toPersianDigits(displayValue.toLocaleString())
    : displayValue.toLocaleString();

  const characters = formattedStr.split('');

  return (
    <span className={`inline-flex items-baseline font-mono-numeric ${className}`}>
      {prefix && <span className="me-1 opacity-80">{prefix}</span>}
      <span className="inline-flex overflow-hidden">
        {characters.map((char, index) => {
          if (char === ',' || char === '،' || char === '.') {
            return (
              <span key={`sep-${index}`} className="opacity-60">
                {char}
              </span>
            );
          }
          return (
            <span
              key={`col-${index}`}
              className="relative inline-block h-[1.15em] overflow-hidden"
              style={{ width: '0.62em' }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={`${index}-${char}`}
                  initial={{ y: '100%', opacity: 0, filter: 'blur(2px)' }}
                  animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: '-100%', opacity: 0, filter: 'blur(2px)' }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {char}
                </motion.span>
              </AnimatePresence>
            </span>
          );
        })}
      </span>
      {suffix && <span className="ms-1.5 opacity-80 text-[0.8em]">{suffix}</span>}
    </span>
  );
}
