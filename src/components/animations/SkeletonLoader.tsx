'use client';

import React from 'react';

export default function SkeletonLoader({
  height = 'h-64',
  className = '',
}: {
  height?: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full ${height} rounded-2xl bg-[#171b26]/60 border border-[#262a35] p-6 relative overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Shimmer sweep animation */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"></div>

      <div className="flex items-center justify-between">
        <div className="w-40 h-5 rounded-lg bg-[#262a35]/80 animate-pulse"></div>
        <div className="w-20 h-5 rounded-lg bg-[#262a35]/60 animate-pulse"></div>
      </div>

      <div className="flex flex-col gap-3 my-4">
        <div className="w-3/4 h-8 rounded-xl bg-[#262a35]/80 animate-pulse"></div>
        <div className="w-1/2 h-4 rounded-lg bg-[#262a35]/50 animate-pulse"></div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#262a35]/60">
        <div className="w-28 h-4 rounded-md bg-[#262a35]/60 animate-pulse"></div>
        <div className="w-20 h-4 rounded-md bg-[#262a35]/60 animate-pulse"></div>
      </div>
    </div>
  );
}
