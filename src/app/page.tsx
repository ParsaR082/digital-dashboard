'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SkeletonLoader from '@/components/animations/SkeletonLoader';

// Dynamic Lazy Loading for all major dashboard modules with graceful skeletons
const ControlHub = dynamic(() => import('@/components/ControlHub'), {
  loading: () => <SkeletonLoader height="h-28" />,
});

const KpiGrid = dynamic(() => import('@/components/KpiGrid'), {
  loading: () => <SkeletonLoader height="h-44" />,
});

const LiquidityChart = dynamic(() => import('@/components/LiquidityChart'), {
  loading: () => <SkeletonLoader height="h-[440px]" />,
});

const InstantSwap = dynamic(() => import('@/components/InstantSwap'), {
  loading: () => <SkeletonLoader height="h-[440px]" />,
});

const TransactionLedger = dynamic(() => import('@/components/TransactionLedger'), {
  loading: () => <SkeletonLoader height="h-[500px]" />,
});

const ReserveMatrix = dynamic(() => import('@/components/ReserveMatrix'), {
  loading: () => <SkeletonLoader height="h-[500px]" />,
});

const ArchitectureSpec = dynamic(() => import('@/components/ArchitectureSpec'), {
  loading: () => <SkeletonLoader height="h-96" />,
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function AnalyticsConsolePage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 w-full"
    >
      {/* 1. Interactive Dual-Locale Control Hub */}
      <motion.div variants={itemVariants}>
        <ControlHub />
      </motion.div>

      {/* 2. Bento KPI Matrix (4 Key Metric Nodes) */}
      <motion.div variants={itemVariants}>
        <KpiGrid />
      </motion.div>

      {/* 3. Primary Interactive Grid: Liquidity Visualizer + Instant Swap */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <LiquidityChart />
        </div>
        <div className="lg:col-span-4">
          <InstantSwap />
        </div>
      </motion.div>

      {/* 4. Secondary Bento Grid: Transaction Ledger + Reserve Allocation */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <TransactionLedger />
        </div>
        <div className="lg:col-span-4">
          <ReserveMatrix />
        </div>
      </motion.div>

      {/* 5. Production Next.js Architecture Specification Drawer */}
      <motion.div variants={itemVariants}>
        <ArchitectureSpec />
      </motion.div>
    </motion.div>
  );
}
