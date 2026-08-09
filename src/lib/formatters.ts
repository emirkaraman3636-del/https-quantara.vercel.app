import { SemanticType } from './dynamic-types';

export function formatValue(value: unknown, semanticType: SemanticType | string, columnName: string = ''): string {
  if (value === null || value === undefined) return '-';
  if (typeof value !== 'number') return String(value);

  // Helper to detect currency type from column name if not explicitly provided
  const getCurrencyType = (col: string): 'TRY' | 'USD' | 'EUR' | 'GBP' | null => {
    const norm = col.toUpperCase();
    if (norm.includes('TL') || norm.includes('TRY') || norm.includes('₺')) return 'TRY';
    if (norm.includes('USD') || norm.includes('$')) return 'USD';
    if (norm.includes('EUR') || norm.includes('€')) return 'EUR';
    if (norm.includes('GBP') || norm.includes('£')) return 'GBP';
    return null;
  };

  if (semanticType === 'currency') {
    const currency = getCurrencyType(columnName);
    
    // If currency is detected, use Intl.NumberFormat
    if (currency) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
      }).format(value);
    }
    // If currency is unknown, just format as a clean number without inventing TRY
    return new Intl.NumberFormat('tr-TR', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(value);
  }

  if (semanticType === 'percentage') {
    // If the value is a fraction (e.g. 0.18), we might want to multiply by 100,
    // but typically dataset percentages might already be 18. Let's just format it with %.
    // We'll format the number natively and prepend % for Turkish style (%18,4)
    const formattedNum = new Intl.NumberFormat('tr-TR', {
      maximumFractionDigits: 2
    }).format(value);
    return `%${formattedNum}`;
  }

  if (semanticType === 'quantity') {
    return new Intl.NumberFormat('tr-TR', {
      maximumFractionDigits: 0
    }).format(value);
  }

  if (semanticType === 'duration') {
    const formattedNum = new Intl.NumberFormat('tr-TR', {
      maximumFractionDigits: 1
    }).format(value);
    
    // Simple heuristic: if value > 24, might be hours/days, but let's just append "birim" if we don't know, 
    // actually, plan said "12,5 gün". Let's assume it's days if the column name implies days, or just format number.
    const colLower = columnName.toLowerCase();
    if (colLower.includes('gün') || colLower.includes('day')) {
      return `${formattedNum} gün`;
    }
    if (colLower.includes('ay') || colLower.includes('month')) {
      return `${formattedNum} ay`;
    }
    if (colLower.includes('saat') || colLower.includes('hour')) {
      return `${formattedNum} saat`;
    }
    return `${formattedNum} süre`;
  }

  // Default number formatting
  return new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits: 2
  }).format(value);
}
