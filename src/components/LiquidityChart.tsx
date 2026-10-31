'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedNumber from '@/components/animations/AnimatedNumber';

type TimeRange = '1H' | '24H' | '7D' | '30D';
type CorridorPair = 'USD/AED' | 'USD/IRR' | 'EUR/USD';
type MetricMode = 'depth' | 'volume' | 'spread';

interface TickPoint {
  x: number;
  y1: number;
  y2: number;
  timeEn: string;
  timeFa: string;
  rateEn: string;
  rateFa: string;
  volEn: string;
  volFa: string;
  depthEn: string;
  depthFa: string;
  spreadEn: string;
  spreadFa: string;
}

interface ChartRangeData {
  range: TimeRange;
  maxCeilingEn: string;
  maxCeilingFa: string;
  liveRateEn: string;
  liveRateFa: string;
  subTitleEn: string;
  subTitleFa: string;
  primaryPath: string;
  primaryArea: string;
  secondaryPath: string;
  secondaryArea: string;
  timeLabelsEn: string[];
  timeLabelsFa: string[];
  statAVal: number;
  statBVal: number;
  statCVal: number;
  statASuffixEn: string;
  statASuffixFa: string;
  statBSuffixEn: string;
  statBSuffixFa: string;
  statCSuffixEn: string;
  statCSuffixFa: string;
  ticks: TickPoint[];
}

export default function LiquidityChart() {
  const { t, locale, toPersianDigits } = useLanguage();
  const isFa = locale === 'fa';

  const [activeRange, setActiveRange] = useState<TimeRange>('24H');
  const [activeCorridor, setActiveCorridor] = useState<CorridorPair>('USD/AED');
  const [metricMode, setMetricMode] = useState<MetricMode>('depth');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [pulseCount, setPulseCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Live telemetry pulse simulator
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setPulseCount((prev) => (prev + 1) % 100);
    }, 3200);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // 4 Completely distinct mock datasets with unique path geometries, ticks, and telemetry
  const chartDatasets: Record<TimeRange, ChartRangeData> = {
    '1H': {
      range: '1H',
      maxCeilingEn: activeCorridor === 'USD/IRR' ? 'Ceiling Cap: 1.8T IRR' : 'Ceiling Cap: $18.5M',
      maxCeilingFa: activeCorridor === 'USD/IRR' ? `سقف نقدینگی: ۱.۸ همت` : `سقف نقدینگی: ${toPersianDigits('18.5')}M$`,
      liveRateEn:
        activeCorridor === 'USD/AED'
          ? '1 USD = 3.6732 AED (Micro-ticks)'
          : activeCorridor === 'USD/IRR'
          ? '1 USD = 612,650 IRR (Interbank Micro)'
          : '1 EUR = 1.0848 USD (Micro-ticks)',
      liveRateFa:
        activeCorridor === 'USD/AED'
          ? `نرخ لحظه‌ای: ۱ دلار = ${toPersianDigits('3.6732')} درهم`
          : activeCorridor === 'USD/IRR'
          ? `نرخ لحظه‌ای: ۱ دلار = ${toPersianDigits('612,650')} ریال`
          : `نرخ لحظه‌ای: ۱ یورو = ${toPersianDigits('1.0848')} دلار`,
      subTitleEn: '60-minute ultra-high-frequency algorithmic settlement micro-ticks',
      subTitleFa: 'تله‌متری ۶۰ دقیقه‌ای فرکانس بالا با ریزنوسانات تسویه الگوریتمی',
      // High frequency zigzag micro-waves
      primaryPath:
        'M0,95 Q35,45 70,80 T145,35 T220,70 T295,25 T370,75 T445,20 T520,60 T595,30 T650,55 T700,38',
      primaryArea:
        'M0,95 Q35,45 70,80 T145,35 T220,70 T295,25 T370,75 T445,20 T520,60 T595,30 T650,55 T700,38 L700,160 L0,160 Z',
      secondaryPath:
        'M0,115 Q45,90 90,110 T180,85 T270,100 T360,65 T450,90 T540,55 T630,75 T700,60',
      secondaryArea:
        'M0,115 Q45,90 90,110 T180,85 T270,100 T360,65 T450,90 T540,55 T630,75 T700,60 L700,160 L0,160 Z',
      timeLabelsEn: ['14:00', '14:15', '14:30', '14:45', '15:00 LIVE'],
      timeLabelsFa: ['۱۴:۰۰', '۱۴:۱۵', '۱۴:۳۰', '۱۴:۴۵', '۱۵:۰۰ برخط'],
      statAVal: 612650,
      statASuffixEn: 'IRR',
      statASuffixFa: 'ریال',
      statBVal: 4200000,
      statBSuffixEn: 'AED Vol',
      statBSuffixFa: 'درهم حجم',
      statCVal: 99.998,
      statCSuffixEn: '% SLA',
      statCSuffixFa: '٪ کارایی',
      ticks: [
        { x: 30, y1: 75, y2: 105, timeEn: '14:03 UTC', timeFa: '۱۴:۰۳', rateEn: '3.6730', rateFa: toPersianDigits('3.6730'), volEn: '$1.4M', volFa: `${toPersianDigits('1.4')}M$`, depthEn: '$8.2M', depthFa: `${toPersianDigits('8.2')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 110, y1: 55, y2: 95, timeEn: '14:10 UTC', timeFa: '۱۴:۱۰', rateEn: '3.6731', rateFa: toPersianDigits('3.6731'), volEn: '$2.8M', volFa: `${toPersianDigits('2.8')}M$`, depthEn: '$9.4M', depthFa: `${toPersianDigits('9.4')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 190, y1: 45, y2: 85, timeEn: '14:18 UTC', timeFa: '۱۴:۱۸', rateEn: '3.6733', rateFa: toPersianDigits('3.6733'), volEn: '$4.6M', volFa: `${toPersianDigits('4.6')}M$`, depthEn: '$11.2M', depthFa: `${toPersianDigits('11.2')}M$`, spreadEn: '0.002%', spreadFa: '٪۰.۰۰۲' },
        { x: 270, y1: 65, y2: 95, timeEn: '14:25 UTC', timeFa: '۱۴:۲۵', rateEn: '3.6730', rateFa: toPersianDigits('3.6730'), volEn: '$6.9M', volFa: `${toPersianDigits('6.9')}M$`, depthEn: '$13.0M', depthFa: `${toPersianDigits('13.0')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 350, y1: 30, y2: 70, timeEn: '14:32 UTC', timeFa: '۱۴:۳۲', rateEn: '3.6734', rateFa: toPersianDigits('3.6734'), volEn: '$9.8M', volFa: `${toPersianDigits('9.8')}M$`, depthEn: '$15.1M', depthFa: `${toPersianDigits('15.1')}M$`, spreadEn: '0.002%', spreadFa: '٪۰.۰۰۲' },
        { x: 430, y1: 50, y2: 85, timeEn: '14:39 UTC', timeFa: '۱۴:۳۹', rateEn: '3.6732', rateFa: toPersianDigits('3.6732'), volEn: '$12.4M', volFa: `${toPersianDigits('12.4')}M$`, depthEn: '$16.4M', depthFa: `${toPersianDigits('16.4')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 510, y1: 25, y2: 60, timeEn: '14:46 UTC', timeFa: '۱۴:۴۶', rateEn: '3.6735', rateFa: toPersianDigits('3.6735'), volEn: '$15.2M', volFa: `${toPersianDigits('15.2')}M$`, depthEn: '$17.8M', depthFa: `${toPersianDigits('17.8')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 590, y1: 45, y2: 75, timeEn: '14:53 UTC', timeFa: '۱۴:۵۳', rateEn: '3.6733', rateFa: toPersianDigits('3.6733'), volEn: '$17.1M', volFa: `${toPersianDigits('17.1')}M$`, depthEn: '$18.2M', depthFa: `${toPersianDigits('18.2')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 675, y1: 38, y2: 62, timeEn: '15:00 UTC (NOW)', timeFa: '۱۵:۰۰ (برخط)', rateEn: '3.6732', rateFa: toPersianDigits('3.6732'), volEn: '$18.5M', volFa: `${toPersianDigits('18.5')}M$`, depthEn: '$18.5M', depthFa: `${toPersianDigits('18.5')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
      ],
    },
    '24H': {
      range: '24H',
      maxCeilingEn: activeCorridor === 'USD/IRR' ? 'Ceiling Cap: 24.5T IRR' : 'Ceiling Cap: $240M',
      maxCeilingFa: activeCorridor === 'USD/IRR' ? `سقف نقدینگی: ۲۴.۵ همت` : `سقف نقدینگی: ${toPersianDigits('240')}M$`,
      liveRateEn:
        activeCorridor === 'USD/AED'
          ? '1 USD = 3.6725 AED (Intraday Equilibrium)'
          : activeCorridor === 'USD/IRR'
          ? '1 USD = 612,400 IRR (Diurnal Wave)'
          : '1 EUR = 1.0845 USD (TARGET2 Session)',
      liveRateFa:
        activeCorridor === 'USD/AED'
          ? `نرخ تعادلی: ۱ دلار = ${toPersianDigits('3.6725')} درهم`
          : activeCorridor === 'USD/IRR'
          ? `نرخ تعادلی: ۱ دلار = ${toPersianDigits('612,400')} ریال`
          : `نرخ تعادلی: ۱ یورو = ${toPersianDigits('1.0845')} دلار`,
      subTitleEn: '24-hour diurnal interbank liquidity wave peaking during GCC-European market crossover',
      subTitleFa: 'موج ۲۴ ساعته روزانه نقدینگی بین‌بانکی با اوج‌گیری همپوشانی بازار خلیج فارس و اروپا',
      // Smooth harmonic diurnal curve
      primaryPath:
        'M0,110 C80,60 170,120 260,40 C350,20 440,80 530,30 C610,15 670,55 700,20',
      primaryArea:
        'M0,110 C80,60 170,120 260,40 C350,20 440,80 530,30 C610,15 670,55 700,20 L700,160 L0,160 Z',
      secondaryPath:
        'M0,130 C90,120 180,85 270,95 C360,105 450,55 540,75 C620,95 670,45 700,50',
      secondaryArea:
        'M0,130 C90,120 180,85 270,95 C360,105 450,55 540,75 C620,95 670,45 700,50 L700,160 L0,160 Z',
      timeLabelsEn: ['00:00 UTC', '06:00', '12:00', '18:00', 'LIVE (NOW)'],
      timeLabelsFa: ['۰۰:۰۰ UTC', '۰۶:۰۰', '۱۲:۰۰', '۱۸:۰۰', 'برخط و زنده'],
      statAVal: 612400,
      statASuffixEn: 'IRR',
      statASuffixFa: 'ریال',
      statBVal: 38400000,
      statBSuffixEn: 'AED Vol',
      statBSuffixFa: 'درهم حجم',
      statCVal: 99.994,
      statCSuffixEn: '% SLA',
      statCSuffixFa: '٪ کارایی',
      ticks: [
        { x: 35, y1: 95, y2: 125, timeEn: '01:00 UTC', timeFa: '۰۱:۰۰', rateEn: '3.6722', rateFa: toPersianDigits('3.6722'), volEn: '$28M', volFa: `${toPersianDigits('28')}M$`, depthEn: '$65M', depthFa: `${toPersianDigits('65')}M$`, spreadEn: '0.002%', spreadFa: '٪۰.۰۰۲' },
        { x: 120, y1: 75, y2: 105, timeEn: '04:00 UTC', timeFa: '۰۴:۰۰', rateEn: '3.6723', rateFa: toPersianDigits('3.6723'), volEn: '$55M', volFa: `${toPersianDigits('55')}M$`, depthEn: '$98M', depthFa: `${toPersianDigits('98')}M$`, spreadEn: '0.002%', spreadFa: '٪۰.۰۰۲' },
        { x: 200, y1: 65, y2: 90, timeEn: '07:00 UTC', timeFa: '۰۷:۰۰', rateEn: '3.6724', rateFa: toPersianDigits('3.6724'), volEn: '$88M', volFa: `${toPersianDigits('88')}M$`, depthEn: '$135M', depthFa: `${toPersianDigits('135')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 280, y1: 35, y2: 95, timeEn: '10:00 UTC', timeFa: '۱۰:۰۰', rateEn: '3.6726', rateFa: toPersianDigits('3.6726'), volEn: '$122M', volFa: `${toPersianDigits('122')}M$`, depthEn: '$170M', depthFa: `${toPersianDigits('170')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 360, y1: 22, y2: 85, timeEn: '13:00 UTC', timeFa: '۱۳:۰۰', rateEn: '3.6727', rateFa: toPersianDigits('3.6727'), volEn: '$165M', volFa: `${toPersianDigits('165')}M$`, depthEn: '$210M', depthFa: `${toPersianDigits('210')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 440, y1: 75, y2: 60, timeEn: '16:00 UTC', timeFa: '۱۶:۰۰', rateEn: '3.6724', rateFa: toPersianDigits('3.6724'), volEn: '$198M', volFa: `${toPersianDigits('198')}M$`, depthEn: '$225M', depthFa: `${toPersianDigits('225')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 530, y1: 30, y2: 75, timeEn: '19:00 UTC', timeFa: '۱۹:۰۰', rateEn: '3.6725', rateFa: toPersianDigits('3.6725'), volEn: '$218M', volFa: `${toPersianDigits('218')}M$`, depthEn: '$235M', depthFa: `${toPersianDigits('235')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 610, y1: 18, y2: 88, timeEn: '22:00 UTC', timeFa: '۲۲:۰۰', rateEn: '3.6725', rateFa: toPersianDigits('3.6725'), volEn: '$232M', volFa: `${toPersianDigits('232')}M$`, depthEn: '$238M', depthFa: `${toPersianDigits('238')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 685, y1: 22, y2: 52, timeEn: 'LIVE (NOW)', timeFa: 'برخط (اکنون)', rateEn: '3.6725', rateFa: toPersianDigits('3.6725'), volEn: '$240M', volFa: `${toPersianDigits('240')}M$`, depthEn: '$240M', depthFa: `${toPersianDigits('240')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
      ],
    },
    '7D': {
      range: '7D',
      maxCeilingEn: activeCorridor === 'USD/IRR' ? 'Ceiling Cap: 114T IRR' : 'Ceiling Cap: $1.12B',
      maxCeilingFa: activeCorridor === 'USD/IRR' ? `سقف نقدینگی: ۱۱۴ همت` : `سقف نقدینگی: ${toPersianDigits('1.12')}B$`,
      liveRateEn:
        activeCorridor === 'USD/AED'
          ? '1 USD = 3.6718 AED (7-Day Multi-Bank Rail)'
          : activeCorridor === 'USD/IRR'
          ? '1 USD = 611,800 IRR (Weekly High-Volume)'
          : '1 EUR = 1.0838 USD (Weekly Cross-Border)',
      liveRateFa:
        activeCorridor === 'USD/AED'
          ? `میانگین هفتگی: ۱ دلار = ${toPersianDigits('3.6718')} درهم`
          : activeCorridor === 'USD/IRR'
          ? `میانگین هفتگی: ۱ دلار = ${toPersianDigits('611,800')} ریال`
          : `میانگین هفتگی: ۱ یورو = ${toPersianDigits('1.0838')} دلار`,
      subTitleEn: 'Multi-day interbank settlement cycles showing weekend escrow lock & Tuesday-Thursday peak',
      subTitleFa: 'چرخه‌های تسویه هفتگی با ثبت توقف اسکرو آخر هفته و اوج جابجایی سه‌شنبه تا پنج‌شنبه',
      // Multi-day rolling steps with weekend volume drops
      primaryPath:
        'M0,120 C90,110 130,45 210,50 C290,55 350,115 430,90 C510,65 570,30 700,15',
      primaryArea:
        'M0,120 C90,110 130,45 210,50 C290,55 350,115 430,90 C510,65 570,30 700,15 L700,160 L0,160 Z',
      secondaryPath:
        'M0,140 C100,135 140,90 220,80 C300,70 360,125 440,110 C520,95 580,55 700,40',
      secondaryArea:
        'M0,140 C100,135 140,90 220,80 C300,70 360,125 440,110 C520,95 580,55 700,40 L700,160 L0,160 Z',
      timeLabelsEn: ['Saturday', 'Monday', 'Wednesday', 'Friday', 'Today'],
      timeLabelsFa: ['شنبه', 'دوشنبه', 'چهارشنبه', 'جمعه', 'امروز'],
      statAVal: 611800,
      statASuffixEn: 'IRR',
      statASuffixFa: 'ریال',
      statBVal: 142000000,
      statBSuffixEn: 'AED Vol',
      statBSuffixFa: 'درهم حجم',
      statCVal: 99.985,
      statCSuffixEn: '% SLA',
      statCSuffixFa: '٪ کارایی',
      ticks: [
        { x: 45, y1: 115, y2: 138, timeEn: 'Saturday (GCC Open)', timeFa: 'شنبه (شروع هفته خلیج)', rateEn: '3.6715', rateFa: toPersianDigits('3.6715'), volEn: '$180M', volFa: `${toPersianDigits('180')}M$`, depthEn: '$320M', depthFa: `${toPersianDigits('320')}M$`, spreadEn: '0.003%', spreadFa: '٪۰.۰۰۳' },
        { x: 140, y1: 65, y2: 105, timeEn: 'Sunday (Regional Desk)', timeFa: 'یکشنبه (میز منطقه‌ای)', rateEn: '3.6716', rateFa: toPersianDigits('3.6716'), volEn: '$340M', volFa: `${toPersianDigits('340')}M$`, depthEn: '$510M', depthFa: `${toPersianDigits('510')}M$`, spreadEn: '0.002%', spreadFa: '٪۰.۰۰۲' },
        { x: 240, y1: 52, y2: 78, timeEn: 'Monday (Global Open)', timeFa: 'دوشنبه (بازار جهانی)', rateEn: '3.6718', rateFa: toPersianDigits('3.6718'), volEn: '$520M', volFa: `${toPersianDigits('520')}M$`, depthEn: '$680M', depthFa: `${toPersianDigits('680')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 340, y1: 75, y2: 105, timeEn: 'Tuesday (Peak Clearing)', timeFa: 'سه‌شنبه (اوج پایاپای)', rateEn: '3.6720', rateFa: toPersianDigits('3.6720'), volEn: '$710M', volFa: `${toPersianDigits('710')}M$`, depthEn: '$840M', depthFa: `${toPersianDigits('840')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 440, y1: 90, y2: 110, timeEn: 'Wednesday (Treasury Hedging)', timeFa: 'چهارشنبه (پوشش ریسک)', rateEn: '3.6717', rateFa: toPersianDigits('3.6717'), volEn: '$880M', volFa: `${toPersianDigits('880')}M$`, depthEn: '$950M', depthFa: `${toPersianDigits('950')}M$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 540, y1: 58, y2: 85, timeEn: 'Thursday (Settlement Cutoff)', timeFa: 'پنج‌شنبه (بستن حساب‌ها)', rateEn: '3.6719', rateFa: toPersianDigits('3.6719'), volEn: '$1.02B', volFa: `${toPersianDigits('1.02')}B$`, depthEn: '$1.08B', depthFa: `${toPersianDigits('1.08')}B$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 675, y1: 18, y2: 42, timeEn: 'Friday (Weekly Finality)', timeFa: 'جمعه (تسویه نهایی)', rateEn: '3.6718', rateFa: toPersianDigits('3.6718'), volEn: '$1.12B', volFa: `${toPersianDigits('1.12')}B$`, depthEn: '$1.12B', depthFa: `${toPersianDigits('1.12')}B$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
      ],
    },
    '30D': {
      range: '30D',
      maxCeilingEn: activeCorridor === 'USD/IRR' ? 'Ceiling Cap: 492T IRR' : 'Ceiling Cap: $4.85B',
      maxCeilingFa: activeCorridor === 'USD/IRR' ? `سقف نقدینگی: ۴۹۲ همت` : `سقف نقدینگی: ${toPersianDigits('4.85')}B$`,
      liveRateEn:
        activeCorridor === 'USD/AED'
          ? '1 USD = 3.6732 AED (Monthly Tier-1 Epoch)'
          : activeCorridor === 'USD/IRR'
          ? '1 USD = 608,900 IRR (Monthly Macro Trend)'
          : '1 EUR = 1.0860 USD (Monthly TARGET2 Flow)',
      liveRateFa:
        activeCorridor === 'USD/AED'
          ? `جریان ماهانه: ۱ دلار = ${toPersianDigits('3.6732')} درهم`
          : activeCorridor === 'USD/IRR'
          ? `جریان ماهانه: ۱ دلار = ${toPersianDigits('608,900')} ریال`
          : `جریان ماهانه: ۱ یورو = ${toPersianDigits('1.0860')} دلار`,
      subTitleEn: '30-day macro institutional accumulation trend showcasing sovereign corridor scale',
      subTitleFa: 'روند انباشت نقدینگی کلان نهادی در دوره ۳۰ روزه با مقیاس حاکمیتی',
      // Monthly progressive trend with steep institutional settlement spike
      primaryPath:
        'M0,140 C110,132 170,105 270,95 C370,85 440,50 530,38 C610,28 650,15 700,10',
      primaryArea:
        'M0,140 C110,132 170,105 270,95 C370,85 440,50 530,38 C610,28 650,15 700,10 L700,160 L0,160 Z',
      secondaryPath:
        'M0,152 C115,145 190,125 290,120 C390,112 470,80 550,62 C620,52 660,32 700,28',
      secondaryArea:
        'M0,152 C115,145 190,125 290,120 C390,112 470,80 550,62 C620,52 660,32 700,28 L700,160 L0,160 Z',
      timeLabelsEn: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current Epoch'],
      timeLabelsFa: ['هفته ۱', 'هفته ۲', 'هفته ۳', 'هفته ۴', 'دوره جاری'],
      statAVal: 608900,
      statASuffixEn: 'IRR',
      statASuffixFa: 'ریال',
      statBVal: 580000000,
      statBSuffixEn: 'AED Vol',
      statBSuffixFa: 'درهم حجم',
      statCVal: 99.970,
      statCSuffixEn: '% SLA',
      statCSuffixFa: '٪ کارایی',
      ticks: [
        { x: 40, y1: 138, y2: 150, timeEn: 'Day 1-4 (Epoch Start)', timeFa: 'روز ۱-۴ (آغاز دوره)', rateEn: '3.6710', rateFa: toPersianDigits('3.6710'), volEn: '$680M', volFa: `${toPersianDigits('680')}M$`, depthEn: '$1.4B', depthFa: `${toPersianDigits('1.4')}B$`, spreadEn: '0.002%', spreadFa: '٪۰.۰۰۲' },
        { x: 130, y1: 122, y2: 140, timeEn: 'Day 5-9 (Treasury Inflow)', timeFa: 'روز ۵-۹ (ورودی خزانه)', rateEn: '3.6712', rateFa: toPersianDigits('3.6712'), volEn: '$1.35B', volFa: `${toPersianDigits('1.35')}B$`, depthEn: '$2.1B', depthFa: `${toPersianDigits('2.1')}B$`, spreadEn: '0.002%', spreadFa: '٪۰.۰۰۲' },
        { x: 220, y1: 104, y2: 126, timeEn: 'Day 10-14 (ADGM Expansion)', timeFa: 'روز ۱۰-۱۴ (گسترش ADGM)', rateEn: '3.6716', rateFa: toPersianDigits('3.6716'), volEn: '$2.10B', volFa: `${toPersianDigits('2.10')}B$`, depthEn: '$2.8B', depthFa: `${toPersianDigits('2.8')}B$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 320, y1: 88, y2: 115, timeEn: 'Day 15-19 (Mid-Month Clearing)', timeFa: 'روز ۱۵-۱۹ (پایاپای میانه ماه)', rateEn: '3.6720', rateFa: toPersianDigits('3.6720'), volEn: '$2.95B', volFa: `${toPersianDigits('2.95')}B$`, depthEn: '$3.5B', depthFa: `${toPersianDigits('3.5')}B$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 420, y1: 62, y2: 95, timeEn: 'Day 20-24 (TARGET2 Bridge)', timeFa: 'روز ۲۰-۲۴ (پل تارگت۲)', rateEn: '3.6724', rateFa: toPersianDigits('3.6724'), volEn: '$3.70B', volFa: `${toPersianDigits('3.70')}B$`, depthEn: '$4.1B', depthFa: `${toPersianDigits('4.1')}B$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 520, y1: 40, y2: 65, timeEn: 'Day 25-28 (Bilateral Escrow)', timeFa: 'روز ۲۵-۲۸ (اسکرو دوجانبه)', rateEn: '3.6728', rateFa: toPersianDigits('3.6728'), volEn: '$4.30B', volFa: `${toPersianDigits('4.30')}B$`, depthEn: '$4.6B', depthFa: `${toPersianDigits('4.6')}B$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
        { x: 675, y1: 12, y2: 30, timeEn: 'Day 30 (Epoch Finality)', timeFa: 'روز ۳۰ (نهایی‌سازی دوره)', rateEn: '3.6732', rateFa: toPersianDigits('3.6732'), volEn: '$4.85B', volFa: `${toPersianDigits('4.85')}B$`, depthEn: '$4.85B', depthFa: `${toPersianDigits('4.85')}B$`, spreadEn: '0.001%', spreadFa: '٪۰.۰۰۱' },
      ],
    },
  };

  const currentData = chartDatasets[activeRange];
  const timeLabels = isFa ? currentData.timeLabelsFa : currentData.timeLabelsEn;
  const currentTick = hoveredIndex !== null ? currentData.ticks[hoveredIndex] : null;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clientX / rect.width));
    const idx = Math.min(
      currentData.ticks.length - 1,
      Math.floor(ratio * currentData.ticks.length)
    );
    setHoveredIndex(idx);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col rounded-2xl bg-[#171b26]/80 backdrop-blur-xl border border-[#262a35] p-5 lg:p-6 shadow-xl justify-between h-full relative"
    >
      {/* Top Header: Title, Corridor Selector, and Timeframe Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        {/* Title & Live Status */}
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">
              show_chart
            </span>
            <h2 className="text-base lg:text-lg font-bold text-[#dfe2f1] tracking-tight">
              {t.chartTitle}
            </h2>
            {/* Live Streaming Indicator Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsLiveStreaming((prev) => !prev)}
              title={isLiveStreaming ? 'Click to Pause Telemetry' : 'Click to Resume Telemetry'}
              className={`ms-2 px-2 py-0.5 rounded-full text-[10px] font-mono-numeric font-bold flex items-center gap-1 border transition-all ${
                isLiveStreaming
                  ? 'bg-[#006e4b]/20 text-[#4edea3] border-[#4edea3]/40'
                  : 'bg-[#313540]/60 text-[#918fa1] border-[#464555]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLiveStreaming ? 'bg-[#4edea3] animate-ping' : 'bg-[#918fa1]'
                }`}
              />
              <span>{isLiveStreaming ? 'FEED ACTIVE' : 'PAUSED'}</span>
            </motion.button>
          </div>
          <p className="text-xs text-[#c7c4d8] mt-0.5">
            {isFa ? currentData.subTitleFa : currentData.subTitleEn}
          </p>
        </div>

        {/* Action Controls: Corridor Switcher + Time Tabs */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Corridor Pair Dropdown / Pills */}
          <div className="flex items-center gap-1 bg-[#0a0e18] p-1 rounded-xl border border-[#262a35]">
            {(['USD/AED', 'USD/IRR', 'EUR/USD'] as CorridorPair[]).map((corridor) => (
              <button
                key={corridor}
                type="button"
                onClick={() => {
                  setActiveCorridor(corridor);
                  setHoveredIndex(null);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-numeric font-semibold transition-all ${
                  activeCorridor === corridor
                    ? 'bg-[#1c1f2a] text-[#4cd7f6] border border-[#4cd7f6]/40 shadow-sm'
                    : 'text-[#918fa1] hover:text-[#dfe2f1]'
                }`}
              >
                {corridor}
              </button>
            ))}
          </div>

          {/* Range Buttons with Active Spring Pill */}
          <div className="flex items-center gap-1 bg-[#0a0e18] p-1 rounded-xl border border-[#262a35]">
            {(['1H', '24H', '7D', '30D'] as TimeRange[]).map((range) => {
              const label =
                range === '1H'
                  ? t.time1h
                  : range === '24H'
                  ? t.time24h
                  : range === '7D'
                  ? t.time7d
                  : t.time30d;
              const isActive = activeRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    setActiveRange(range);
                    setHoveredIndex(null);
                  }}
                  className={`relative px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive ? 'text-white' : 'text-[#918fa1] hover:text-[#dfe2f1]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeRangePill"
                      className="absolute inset-0 bg-[#4f46e5] rounded-lg shadow-md shadow-[#4f46e5]/40"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-time Dynamic Vector Telemetry Canvas with Animated Morphing SVG Paths */}
      <div className="relative w-full h-64 rounded-xl bg-[#0a0e18]/90 border border-[#262a35] p-4 flex flex-col justify-between overflow-hidden">
        {/* Top Status Bar inside Chart */}
        <div className="flex items-center justify-between text-[11px] font-mono-numeric text-[#918fa1] z-10">
          <span className="text-white font-semibold flex items-center gap-2">
            <span>{isFa ? currentData.maxCeilingFa : currentData.maxCeilingEn}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1c1f2a] text-[#c3c0ff] border border-[#262a35]">
              {activeCorridor}
            </span>
          </span>
          <span className="text-[#4edea3] flex items-center gap-1.5 font-medium">
            <span
              key={pulseCount}
              className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"
            />
            {isFa ? currentData.liveRateFa : currentData.liveRateEn}
          </span>
        </div>

        {/* SVG Subtle Background Gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
          <div className="w-full h-px bg-[#464555]"></div>
          <div className="w-full h-px bg-[#464555]"></div>
          <div className="w-full h-px bg-[#464555]"></div>
          <div className="w-full h-px bg-[#464555]"></div>
        </div>

        {/* Morphing SVG Curves */}
        <svg
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
          className="w-full h-44 overflow-visible cursor-crosshair"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 700 160"
        >
          <defs>
            <filter id="neonGlowPrimary" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="neonGlowSecondary" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="dropShadowGlow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#4f46e5" floodOpacity="0.45" />
            </filter>

            <linearGradient id="neonPrimaryArea" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#c3c0ff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="neonSecondaryArea" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Secondary Flow Area: Counter-currency Reserve Band */}
          <motion.path
            d={currentData.secondaryArea}
            fill="url(#neonSecondaryArea)"
            initial={false}
            animate={{ d: currentData.secondaryArea }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d={currentData.secondaryPath}
            stroke="#4cd7f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#neonGlowSecondary)"
            initial={false}
            animate={{ d: currentData.secondaryPath }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Primary Flow Area: Primary Institutional Liquidity Curve */}
          <motion.path
            d={currentData.primaryArea}
            fill="url(#neonPrimaryArea)"
            filter="url(#dropShadowGlow)"
            initial={false}
            animate={{ d: currentData.primaryArea }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d={currentData.primaryPath}
            stroke="#c3c0ff"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#neonGlowPrimary)"
            initial={false}
            animate={{ d: currentData.primaryPath }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Interactive Crosshair & Target Intersection */}
          {currentTick && (
            <>
              <line
                x1={currentTick.x}
                y1="0"
                x2={currentTick.x}
                y2="160"
                stroke="#c3c0ff"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.8"
              />
              <circle
                cx={currentTick.x}
                cy={currentTick.y1}
                r="6.5"
                fill="#4f46e5"
                stroke="#ffffff"
                strokeWidth="2.5"
                filter="url(#neonGlowPrimary)"
              />
              <circle
                cx={currentTick.x}
                cy={currentTick.y2}
                r="5.5"
                fill="#4cd7f6"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </>
          )}
        </svg>

        {/* Floating Glassmorphism Tooltip on Hover */}
        <AnimatePresence>
          {currentTick && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute top-7 pointer-events-none z-30 px-4 py-2.5 rounded-xl bg-[#171b26]/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-xs flex flex-col gap-1.5 min-w-[210px]"
              style={{
                left: `${Math.min(Math.max(currentTick.x - 100, 10), 460)}px`,
              }}
            >
              <div className="flex items-center justify-between gap-4 text-[11px] text-[#918fa1] border-b border-[#262a35] pb-1.5">
                <span className="font-semibold text-white">
                  {isFa ? currentTick.timeFa : currentTick.timeEn}
                </span>
                <span className="text-[#4edea3] font-mono-numeric font-bold">
                  {isFa ? `${currentTick.rateFa}` : `${currentTick.rateEn}`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono-numeric">
                <span className="text-[#918fa1]">{isFa ? 'حجم مبادلات:' : 'Gross Vol:'}</span>
                <span className="text-white font-bold text-end">
                  {isFa ? currentTick.volFa : currentTick.volEn}
                </span>

                <span className="text-[#918fa1]">{isFa ? 'عمق استخر:' : 'Pool Depth:'}</span>
                <span className="text-[#4cd7f6] font-bold text-end">
                  {isFa ? currentTick.depthFa : currentTick.depthEn}
                </span>

                <span className="text-[#918fa1]">{isFa ? 'اسپرد شبکه:' : 'Spread:'}</span>
                <span className="text-[#4edea3] font-bold text-end">
                  {isFa ? currentTick.spreadFa : currentTick.spreadEn}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Time Domain Labels */}
        <div className="flex items-center justify-between text-[#918fa1] font-mono-numeric text-[11px] z-10 pt-1">
          {timeLabels.map((lbl, i) => (
            <span key={i} className="hover:text-white transition-colors">
              {lbl}
            </span>
          ))}
        </div>
      </div>

      {/* Dynamic Quick Metrics Ribbon below chart with animated Slot Numbers */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#262a35] text-start">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-3 rounded-xl bg-[#1c1f2a]/60 border border-[#262a35] flex flex-col justify-between"
        >
          <span className="text-[11px] text-[#918fa1] flex items-center justify-between">
            <span>{t.corridorA}</span>
            <span className="text-[10px] text-[#4edea3] font-mono-numeric font-bold">LIVE</span>
          </span>
          <div className="text-base lg:text-lg font-bold text-[#dfe2f1] font-mono-numeric mt-1 flex items-baseline gap-1">
            <AnimatedNumber value={currentData.statAVal} />
            <span className="text-xs text-[#918fa1]">
              {isFa ? currentData.statASuffixFa : currentData.statASuffixEn}
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-3 rounded-xl bg-[#1c1f2a]/60 border border-[#262a35] flex flex-col justify-between"
        >
          <span className="text-[11px] text-[#918fa1] flex items-center justify-between">
            <span>{t.corridorB}</span>
            <span className="text-[10px] text-[#4cd7f6] font-mono-numeric font-bold">24H HIGH</span>
          </span>
          <div className="text-base lg:text-lg font-bold text-[#4cd7f6] font-mono-numeric mt-1 flex items-baseline gap-1">
            <AnimatedNumber value={currentData.statBVal} />
            <span className="text-xs text-[#918fa1]">
              {isFa ? currentData.statBSuffixFa : currentData.statBSuffixEn}
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-3 rounded-xl bg-[#1c1f2a]/60 border border-[#262a35] flex flex-col justify-between"
        >
          <span className="text-[11px] text-[#918fa1] flex items-center justify-between">
            <span>{t.corridorC}</span>
            <span className="text-[10px] text-[#4edea3] font-mono-numeric font-bold">PASSED</span>
          </span>
          <div className="text-base lg:text-lg font-bold text-[#4edea3] font-mono-numeric mt-1 flex items-baseline gap-1">
            <span>{isFa ? `٪${toPersianDigits(currentData.statCVal.toString())}` : `${currentData.statCVal}%`}</span>
            <span className="text-xs text-[#918fa1]">
              {isFa ? currentData.statCSuffixFa : currentData.statCSuffixEn}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
