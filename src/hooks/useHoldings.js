import { useEffect } from 'react';
import { fetchHoldings } from '../services/api';
import { useTax } from '../context/TaxContext';

export function useHoldings() {
  const { setHoldings, setHoldLoading, setHoldError } = useTax();

  useEffect(() => {
    let cancelled = false;
    setHoldLoading(true);
    setHoldError(null);

    fetchHoldings()
      .then((data) => {
        if (!cancelled) {
          setHoldings(data);
          setHoldLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setHoldError(err.message || 'Failed to fetch holdings');
          setHoldLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [setHoldings, setHoldLoading, setHoldError]);
}
