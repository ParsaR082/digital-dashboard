'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, Direction } from '@/types/dashboard';
import { dictionaries, Dictionary, getDictionary } from '@/lib/i18n/dictionaries';

interface LanguageContextType {
  locale: Locale;
  direction: Direction;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  formatNumber: (value: number) => string;
  formatCurrency: (value: number, currency: 'USD' | 'EUR' | 'AED' | 'IRR') => string;
  toPersianDigits: (value: number | string) => string;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [activeNav, setActiveNav] = useState<string>('analytics');
  const [mounted, setMounted] = useState(false);

  const direction: Direction = locale === 'fa' ? 'rtl' : 'ltr';
  const t = getDictionary(locale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('finmatrix-locale', newLocale);
      } catch (e) {
        // ignore localStorage errors
      }
      const dir = newLocale === 'fa' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', newLocale);
      if (newLocale === 'fa') {
        document.documentElement.classList.add('font-vazirmatn');
        document.documentElement.classList.remove('font-sans');
      } else {
        document.documentElement.classList.add('font-sans');
        document.documentElement.classList.remove('font-vazirmatn');
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('finmatrix-locale') as Locale;
      if (saved === 'en' || saved === 'fa') {
        setLocale(saved);
      } else {
        // default to en or browser preference
        setLocale('en');
      }
    } catch {
      setLocale('en');
    }
  }, []);

  const toPersianDigits = (num: number | string): string => {
    const str = String(num);
    const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/[0-9]/g, (w) => id[+w]);
  };

  const formatNumber = (value: number): string => {
    if (locale === 'fa') {
      return new Intl.NumberFormat('fa-IR').format(value);
    }
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatCurrency = (value: number, currency: 'USD' | 'EUR' | 'AED' | 'IRR'): string => {
    if (locale === 'fa') {
      const formatted = toPersianDigits(value.toLocaleString());
      switch (currency) {
        case 'USD':
          return `${formatted} دلار`;
        case 'EUR':
          return `${formatted} یورو`;
        case 'AED':
          return `${formatted} درهم`;
        case 'IRR':
          return `${formatted} ریال`;
      }
    }

    switch (currency) {
      case 'USD':
        return `$${value.toLocaleString()}`;
      case 'EUR':
        return `€${value.toLocaleString()}`;
      case 'AED':
        return `${value.toLocaleString()} AED`;
      case 'IRR':
        return `${value.toLocaleString()} IRR`;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        direction,
        t,
        setLocale,
        formatNumber,
        formatCurrency,
        toPersianDigits,
        activeNav,
        setActiveNav,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
