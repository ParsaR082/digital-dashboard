'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import FloatingDock from '@/components/animations/FloatingDock';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f131d] text-[#dfe2f1] flex flex-col relative selection:bg-[#4f46e5] selection:text-white">
      {/* Top Header across the page */}
      <Header />

      {/* Main Container - full width, beautifully centered, with ample bottom padding for the macOS Floating Dock */}
      <main className="pt-20 pb-32 flex-1 px-4 sm:px-6 lg:px-8 max-w-[1680px] w-full mx-auto flex flex-col gap-6">
        {children}
      </main>

      {/* macOS Floating Dock Navigation with magnification physics */}
      <FloatingDock />
    </div>
  );
}
