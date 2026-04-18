import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { computePreHarvesting, computeAfterHarvesting, computeSavings } from '../utils/calculations';

const TaxContext = createContext(null);

export function TaxProvider({ children }) {
  const [capitalGains, setCapitalGains]   = useState(null);
  const [holdings, setHoldings]           = useState([]);
  const [selectedIds, setSelectedIds]     = useState(new Set());
  const [cgLoading, setCgLoading]         = useState(false);
  const [cgError, setCgError]             = useState(null);
  const [holdLoading, setHoldLoading]     = useState(false);
  const [holdError, setHoldError]         = useState(null);

  // Pre-harvesting derived state
  const preHarvesting = useMemo(() => {
    if (!capitalGains) return null;
    return computePreHarvesting(capitalGains.capitalGains);
  }, [capitalGains]);

  // After-harvesting derived state
  const afterHarvesting = useMemo(() => {
    if (!capitalGains) return null;
    const selected = holdings.filter((h, i) => selectedIds.has(getHoldingKey(h, i)));
    return computeAfterHarvesting(capitalGains.capitalGains, selected);
  }, [capitalGains, holdings, selectedIds]);

  // Savings
  const savings = useMemo(() => {
    if (!preHarvesting || !afterHarvesting) return 0;
    return computeSavings(preHarvesting.realised, afterHarvesting.realised);
  }, [preHarvesting, afterHarvesting]);

  // Toggle one holding
  const toggleHolding = useCallback((key) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // Toggle all
  const toggleAll = useCallback((allKeys, checked) => {
    setSelectedIds(checked ? new Set(allKeys) : new Set());
  }, []);

  // Clear all selections
  const clearAll = useCallback(() => setSelectedIds(new Set()), []);

  return (
    <TaxContext.Provider value={{
      capitalGains, setCapitalGains,
      holdings, setHoldings,
      selectedIds,
      toggleHolding, toggleAll, clearAll,
      preHarvesting, afterHarvesting, savings,
      cgLoading, setCgLoading, cgError, setCgError,
      holdLoading, setHoldLoading, holdError, setHoldError,
    }}>
      {children}
    </TaxContext.Provider>
  );
}

export function useTax() {
  const ctx = useContext(TaxContext);
  if (!ctx) throw new Error('useTax must be inside TaxProvider');
  return ctx;
}

/** Generate a stable unique key for a holding row */
export function getHoldingKey(holding, index) {
  return `${holding.coin}_${index}`;
}
