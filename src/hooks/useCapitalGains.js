import { useEffect } from 'react';
import { fetchCapitalGains } from '../services/api';
import { useTax } from '../context/TaxContext';

export function useCapitalGains() {
  const { setCapitalGains, setCgLoading, setCgError } = useTax();

  useEffect(() => {
    let cancelled = false;
    setCgLoading(true);
    setCgError(null);

    fetchCapitalGains()
      .then((data) => {
        if (!cancelled) {
          setCapitalGains(data);
          setCgLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setCgError(err.message || 'Failed to fetch capital gains');
          setCgLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [setCapitalGains, setCgLoading, setCgError]);
}
