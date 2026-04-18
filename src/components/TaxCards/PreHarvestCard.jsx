import { useTax } from '../../context/TaxContext';
import { Loader } from '../UI/SharedUI';
import './TaxCards.css';

function StatRow({ label, stValue, ltValue, isTotal = false }) {
  return (
    <div className={`stat-row ${isTotal ? 'stat-row--total' : ''}`}>
      <span className="stat-row__label">{label}</span>
      <span className="stat-row__val">{stValue}</span>
      <span className="stat-row__val">{ltValue}</span>
    </div>
  );
}

function formatN(val, decimals = 2) {
  if (val === undefined || val === null) return '—';
  const abs = Math.abs(val);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `$${formatted}`;
}

export default function PreHarvestCard() {
  const { preHarvesting, cgLoading, cgError } = useTax();

  if (cgLoading) {
    return (
      <div className="tax-card tax-card--pre">
        <div className="tax-card__title">Pre Harvesting</div>
        <Loader text="Loading gains…" size="sm" />
      </div>
    );
  }

  if (cgError) {
    return (
      <div className="tax-card tax-card--pre">
        <div className="tax-card__title">Pre Harvesting</div>
        <p className="tax-card__error">Failed to load: {cgError}</p>
      </div>
    );
  }

  if (!preHarvesting) return null;

  const { stcg, ltcg, realised } = preHarvesting;

  return (
    <div className="tax-card tax-card--pre">
      <div className="tax-card__title">Pre Harvesting</div>

      {/* Column headers */}
      <div className="stat-header">
        <span />
        <span className="stat-header__col">Short-term</span>
        <span className="stat-header__col">Long-term</span>
      </div>

      <StatRow
        label="Profits"
        stValue={formatN(stcg.profits)}
        ltValue={formatN(ltcg.profits)}
      />
      <StatRow
        label="Losses"
        stValue={<span className="val-loss">- {formatN(stcg.losses)}</span>}
        ltValue={<span className="val-loss">- {formatN(ltcg.losses)}</span>}
      />

      <div className="tax-card__divider" />

      <StatRow
        label="Net Capital Gains"
        stValue={
          <span className={stcg.net >= 0 ? 'val-gain' : 'val-loss'}>
            {formatN(stcg.net)}
          </span>
        }
        ltValue={
          <span className={ltcg.net >= 0 ? 'val-gain' : 'val-loss'}>
            {formatN(ltcg.net)}
          </span>
        }
        isTotal
      />

      <div className="tax-card__divider" />

      <div className="tax-card__realised">
        <span className="tax-card__realised-label">Realised Capital Gains:</span>
        <span className="tax-card__realised-value">{formatN(realised)}</span>
      </div>
    </div>
  );
}
