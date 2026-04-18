/**
 * calculations.js — Core tax-loss harvesting business logic
 *
 * Rules (from assignment):
 *  - If holding stcg.gain > 0  → add to stcg.profits
 *  - If holding stcg.gain < 0  → add |gain| to stcg.losses
 *  - Same logic for ltcg
 *  - Net = profits - losses
 *  - Realised = stcg.net + ltcg.net
 *  - Show savings only when post-realised < pre-realised
 */

/** Compute pre-harvesting summary from API data */
export function computePreHarvesting(capitalGains) {
  const { stcg, ltcg } = capitalGains;
  const stNet = stcg.profits - stcg.losses;
  const ltNet = ltcg.profits - ltcg.losses;
  return {
    stcg: { profits: stcg.profits, losses: stcg.losses, net: stNet },
    ltcg: { profits: ltcg.profits, losses: ltcg.losses, net: ltNet },
    realised: stNet + ltNet,
  };
}

/**
 * Compute after-harvesting summary given selected holdings.
 * @param {Object} capitalGains - from Capital Gains API
 * @param {Array}  selectedHoldings - array of holding objects that are checked
 */
export function computeAfterHarvesting(capitalGains, selectedHoldings) {
  let stProfits = capitalGains.stcg.profits;
  let stLosses  = capitalGains.stcg.losses;
  let ltProfits = capitalGains.ltcg.profits;
  let ltLosses  = capitalGains.ltcg.losses;

  for (const h of selectedHoldings) {
    const stGain = h.stcg.gain;
    const ltGain = h.ltcg.gain;

    if (stGain > 0) stProfits += stGain;
    else if (stGain < 0) stLosses += Math.abs(stGain);

    if (ltGain > 0) ltProfits += ltGain;
    else if (ltGain < 0) ltLosses += Math.abs(ltGain);
  }

  const stNet = stProfits - stLosses;
  const ltNet = ltProfits - ltLosses;
  const realised = stNet + ltNet;

  return {
    stcg: { profits: stProfits, losses: stLosses, net: stNet },
    ltcg: { profits: ltProfits, losses: ltLosses, net: ltNet },
    realised,
  };
}

/**
 * Estimate tax savings.
 * @param {number} preRealised
 * @param {number} postRealised
 * @param {number} taxRate  default 30% (India flat rate for crypto)
 */
export function computeSavings(preRealised, postRealised, taxRate = 0.3) {
  if (postRealised >= preRealised) return 0;
  const reduction = preRealised - postRealised;
  return Math.max(0, reduction * taxRate);
}

/** Determine if a holding has any harvestable loss */
export function hasLoss(holding) {
  return holding.stcg.gain < 0 || holding.ltcg.gain < 0;
}

/** Determine if a holding has any gain */
export function hasGain(holding) {
  return holding.stcg.gain > 0 || holding.ltcg.gain > 0;
}

/** Sort helpers */
export const SORT_OPTIONS = [
  { value: 'name_asc',   label: 'Name (A–Z)' },
  { value: 'name_desc',  label: 'Name (Z–A)' },
  { value: 'stcg_asc',   label: 'ST Gain ↑' },
  { value: 'stcg_desc',  label: 'ST Gain ↓' },
  { value: 'ltcg_asc',   label: 'LT Gain ↑' },
  { value: 'ltcg_desc',  label: 'LT Gain ↓' },
  { value: 'value_desc', label: 'Value ↓' },
  { value: 'value_asc',  label: 'Value ↑' },
];

export function sortHoldings(holdings, sortBy) {
  const sorted = [...holdings];
  switch (sortBy) {
    case 'name_asc':   return sorted.sort((a, b) => a.coin.localeCompare(b.coin));
    case 'name_desc':  return sorted.sort((a, b) => b.coin.localeCompare(a.coin));
    case 'stcg_asc':   return sorted.sort((a, b) => a.stcg.gain - b.stcg.gain);
    case 'stcg_desc':  return sorted.sort((a, b) => b.stcg.gain - a.stcg.gain);
    case 'ltcg_asc':   return sorted.sort((a, b) => a.ltcg.gain - b.ltcg.gain);
    case 'ltcg_desc':  return sorted.sort((a, b) => b.ltcg.gain - a.ltcg.gain);
    case 'value_desc': return sorted.sort((a, b) => (b.currentPrice * b.totalHolding) - (a.currentPrice * a.totalHolding));
    case 'value_asc':  return sorted.sort((a, b) => (a.currentPrice * a.totalHolding) - (b.currentPrice * b.totalHolding));
    default:           return sorted;
  }
}

/** Filter helpers */
export const FILTER_OPTIONS = [
  { value: 'all',    label: 'All Assets' },
  { value: 'gains',  label: 'Gains Only' },
  { value: 'losses', label: 'Losses Only' },
];

export function filterHoldings(holdings, filter, search) {
  let result = [...holdings];

  // Filter by type
  if (filter === 'gains')  result = result.filter(hasGain);
  if (filter === 'losses') result = result.filter(hasLoss);

  // Filter by search query
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (h) =>
        h.coin.toLowerCase().includes(q) ||
        h.coinName.toLowerCase().includes(q)
    );
  }

  return result;
}
