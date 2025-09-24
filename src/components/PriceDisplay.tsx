'use client';

import { useLanguage } from '@/context/LanguageContext';

interface PriceDisplayProps {
  turkishLira: number;
  className?: string;
  showPerMonth?: boolean;
}

export default function PriceDisplay({ turkishLira, className = '', showPerMonth = false }: PriceDisplayProps) {
  const { currentLanguage } = useLanguage();
  
  // TL to EUR conversion rate (approximate)
  const eurRate = 0.029; // 1 TL ≈ 0.029 EUR
  
  const formatPrice = (amount: number, currency: string) => {
    const formatted = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
    
    return `${currency}${formatted}${showPerMonth ? '/Monat' : ''}`;
  };
  
  if (currentLanguage === 'German') {
    const euroAmount = Math.round(turkishLira * eurRate);
    return (
      <span className={className}>
        {formatPrice(euroAmount, '€')}
      </span>
    );
  }
  
  // Turkish and English show TL
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(turkishLira);
  
  return (
    <span className={className}>
      ₺{formatted}{showPerMonth ? '/ay' : ''}
    </span>
  );
}

