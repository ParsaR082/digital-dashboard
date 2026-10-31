'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface DockItemProps {
  mouseX: MotionValue<number>;
  title: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  badge?: string;
}

function DockIcon({ mouseX, title, icon, href, onClick, isActive, badge }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [44, 70, 44]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 160, damping: 14 });

  const iconSizeSync = useTransform(distance, [-150, 0, 150], [20, 32, 20]);
  const iconSize = useSpring(iconSizeSync, { mass: 0.1, stiffness: 160, damping: 14 });

  const content = (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-2xl flex items-center justify-center transition-colors duration-200 shadow-lg ${
        isActive
          ? 'bg-gradient-to-tr from-[#4f46e5] to-[#03b5d3] text-white shadow-[#4f46e5]/40 border-2 border-white/20'
          : 'bg-[#1c1f2a]/90 hover:bg-[#262a35] text-[#dfe2f1] border border-white/10'
      }`}
    >
      {/* Floating Tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: -45, scale: 1 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute whitespace-nowrap px-3 py-1 rounded-xl bg-[#0a0e18]/95 border border-[#262a35] text-xs font-semibold text-white shadow-2xl pointer-events-none z-50 flex items-center gap-1.5"
        >
          <span>{title}</span>
          {badge && (
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#4f46e5] text-white font-mono-numeric">
              {badge}
            </span>
          )}
        </motion.div>
      )}

      {/* Active Dot indicator below icon */}
      {isActive && (
        <span className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-[#4cd7f6] shadow-sm shadow-[#4cd7f6]"></span>
      )}

      <motion.span
        style={{ fontSize: iconSize }}
        className="material-symbols-outlined select-none"
      >
        {icon}
      </motion.span>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button type="button" onClick={onClick} className="outline-none focus:outline-none">
      {content}
    </button>
  );
}

export default function FloatingDock() {
  const { t, locale, setLocale } = useLanguage();
  const pathname = usePathname();
  const mouseX = useMotionValue(Infinity);

  const dockItems = [
    {
      id: 'analytics',
      title: t.navAnalytics,
      icon: 'query_stats',
      href: '/',
      isActive: pathname === '/' || pathname === '/analytics',
    },
    {
      id: 'ledger',
      title: t.navLedger,
      icon: 'receipt_long',
      href: '/cross-border-settlements',
      isActive: pathname.startsWith('/cross-border-settlements') || pathname.startsWith('/ledger'),
      badge: 'ISO',
    },
    {
      id: 'fx',
      title: t.navFx,
      icon: 'currency_exchange',
      href: '/treasury-fx-matrices',
      isActive: pathname.startsWith('/treasury-fx-matrices') || pathname.startsWith('/fx'),
      badge: '$2.48B',
    },
    {
      id: 'order-book',
      title: t.navOrderBook,
      icon: 'candlestick_chart',
      href: '/order-book-depth',
      isActive: pathname.startsWith('/order-book-depth') || pathname.startsWith('/order-book'),
      badge: 'L2',
    },
    {
      id: 'compliance',
      title: t.navCompliance,
      icon: 'verified_user',
      href: '/compliance-audit',
      isActive: pathname.startsWith('/compliance-audit') || pathname.startsWith('/compliance'),
      badge: 'HSM',
    },
  ];

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-6 inset-x-0 mx-auto w-max z-50 flex items-center gap-3 px-4 py-2.5 rounded-3xl bg-[#0a0e18]/85 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
    >
      {dockItems.map((item) => (
        <DockIcon
          key={item.id}
          mouseX={mouseX}
          title={item.title}
          icon={item.icon}
          href={item.href}
          isActive={item.isActive}
          badge={item.badge}
        />
      ))}

      {/* Vertical Divider in Dock */}
      <div className="w-px h-8 bg-[#313540] mx-1"></div>

      {/* Quick Language Toggle in Dock */}
      <DockIcon
        mouseX={mouseX}
        title={locale === 'en' ? 'Switch to فارسی (RTL)' : 'Switch to English (LTR)'}
        icon="translate"
        onClick={() => setLocale(locale === 'en' ? 'fa' : 'en')}
        badge={locale.toUpperCase()}
      />
    </div>
  );
}
