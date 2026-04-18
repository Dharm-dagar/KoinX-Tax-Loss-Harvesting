/**
 * formatters.js — All number/currency/price formatting helpers
 */

/** Format a rupee/INR amount with locale commas */
export function formatINR(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Format USD amount */
export function formatUSD(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Smart number formatter — picks the right precision automatically
 * Handles very small numbers, large numbers, and everything in between
 */
export function smartFormat(value, opts = {}) {
  if (value === null || value === undefined || isNaN(value)) return opts.currency ? '$0' : '0';
  const abs = Math.abs(value);
  const prefix = opts.currency ? '$' : '';
  const locale = opts.currency ? 'en-US' : 'en-IN';
  const sign = value < 0 ? '-' : value > 0 && opts.showPlus ? '+' : '';

  if (abs === 0) return `${prefix}0`;

  // Very tiny scientific notation numbers
  if (abs < 0.000001) {
    return `${sign}${prefix}${abs.toExponential(4)}`;
  }
  // Tiny numbers
  if (abs < 0.01) {
    return `${sign}${prefix}${abs.toFixed(6)}`;
  }
  // Small decimals
  if (abs < 1) {
    return `${sign}${prefix}${abs.toFixed(4)}`;
  }
  // Normal with 2 decimal
  if (abs < 10000) {
    return `${sign}${prefix}${abs.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  // Large numbers
  return `${sign}${prefix}${abs.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format a gain/loss value with + or - prefix and colour class name */
export function formatGain(value) {
  if (!value && value !== 0) return { text: '$0.00', cls: 'neutral' };
  const abs = Math.abs(value);
  const sign = value >= 0 ? '+' : '-';
  const cls = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
  const text = `${sign}$${smartFormatAbs(abs, { currency: true })}`;
  return { text, cls };
}

/** Format absolute value smartly */
function smartFormatAbs(abs, opts = {}) {
  const locale = opts.currency ? 'en-US' : 'en-IN';
  if (abs < 0.000001) return abs.toExponential(4);
  if (abs < 0.01) return abs.toFixed(6);
  if (abs < 1) return abs.toFixed(4);
  if (abs < 10000) return abs.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return abs.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Full precision (5 decimal places) for hover state */
export function formatFullPrecision(value) {
  if (value === null || value === undefined || isNaN(value)) return '$0.00000';
  return `$${Math.abs(value).toFixed(5)}`;
}

/** Format holdings quantity with smart decimals */
export function formatHolding(value, symbol = '') {
  if (!value && value !== 0) return '0';
  const abs = Math.abs(value);
  let str;
  if (abs < 0.000001) str = abs.toExponential(6);
  else if (abs < 0.001) str = abs.toFixed(8);
  else if (abs < 1) str = abs.toFixed(6);
  else if (abs < 1000) str = abs.toFixed(4);
  else str = abs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  return symbol ? `${str} ${symbol}` : str;
}

/** Format price with appropriate decimals */
export function formatPrice(value) {
  if (!value && value !== 0) return '$0';
  const abs = Math.abs(value);
  if (abs < 0.000001) return `$${abs.toExponential(4)}`;
  if (abs < 0.01) return `$${abs.toFixed(8)}`;
  if (abs < 1) return `$${abs.toFixed(4)}`;
  if (abs < 100) return `$${abs.toFixed(2)}`;
  return `$${abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Compute total value of a holding */
export function computeTotalValue(holding) {
  return holding.currentPrice * holding.totalHolding;
}

/** Full precision total value string */
export function formatTotalValueFull(holding) {
  const val = computeTotalValue(holding);
  return `$${val.toFixed(5)}`;
}

/** Short total value */
export function formatTotalValue(holding) {
  const val = computeTotalValue(holding);
  if (val < 0.000001) return `$${val.toExponential(4)}`;
  if (val < 0.01) return `$${val.toFixed(6)}`;
  if (val < 1) return `$${val.toFixed(4)}`;
  return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
