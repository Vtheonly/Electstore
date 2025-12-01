// /lib/currency.ts

import { CURRENCY } from './constants';

/**
 * Formats a number as DZD currency
 * @param amount - The amount to format
 * @returns Formatted string like "12,500 DZD"
 */
export function formatCurrency(amount: number): string {
  // Format with thousands separator and no decimals
  const formatted = new Intl.NumberFormat('fr-DZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return `${formatted} ${CURRENCY.CODE}`;
}

/**
 * Parses a currency string to a number
 * @param currencyString - String like "12,500 DZD" or "12500"
 * @returns The numeric value
 */
export function parseCurrency(currencyString: string): number {
  // Remove currency code and whitespace, then parse
  const numericString = currencyString
    .replace(CURRENCY.CODE, '')
    .replace(/\s/g, '')
    .replace(/,/g, '');
  
  return parseFloat(numericString) || 0;
}

/**
 * Calculates discount percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Formatted discount string like "-10%"
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): string {
  const percentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  return `-${percentage}%`;
}
