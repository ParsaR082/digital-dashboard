export type Locale = 'en' | 'fa';
export type Direction = 'ltr' | 'rtl';

export interface KpiMetric {
  id: string;
  titleKey: string;
  valueEn: string;
  valueFa: string;
  delta: string;
  deltaType: 'positive' | 'neutral' | 'negative';
  subTextKey: string;
  tagEn: string;
  tagFa: string;
  accentColor: string;
}

export interface Transaction {
  id: string;
  hash: string;
  counterpartyEn: string;
  counterpartyFa: string;
  subLocationEn: string;
  subLocationFa: string;
  logoText: string;
  logoColor: string;
  amount: number;
  currency: 'USD' | 'IRR' | 'EUR' | 'AED';
  corridor: string;
  status: 'settled' | 'clearing';
  timestamp: string;
}

export interface ReserveItem {
  id: string;
  nameEn: string;
  nameFa: string;
  custodyEn: string;
  custodyFa: string;
  percent: number;
  volumeEn: string;
  volumeFa: string;
  color: string;
}

export interface SwapState {
  fromAmount: string;
  fromCurrency: 'USD' | 'AED' | 'EUR' | 'IRR';
  toAmount: string;
  toCurrency: 'AED' | 'USD' | 'IRR' | 'EUR';
  rate: number;
  isExecuting: boolean;
  isSuccess: boolean;
}
