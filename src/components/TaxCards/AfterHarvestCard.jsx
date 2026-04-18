import { useTax } from '../../context/TaxContext';
import { Loader } from '../UI/SharedUI';
import './TaxCards.css';

function formatN(val, decimals = 2) {
  if (val === undefined || val === null) return '—';
  const abs = Math.abs(val);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `$${formatted}`;
}

function AfterStatRow({ label, stValue, ltValue, isTotal = false }) {
  return (
    <div className={`stat-row stat-row--after ${isTotal ? 'stat-row--total' : ''}`}>
      <span className="stat-row__label">{label}</span>
      <span className="stat-row__val">{stValue}</span>
      <span className="stat-row__val">{ltValue}</span>
    </div>
  );
}

export default function AfterHarvestCard() {
  const { afterHarvesting, savings, preHarvesting, cgLoading, cgError, selectedIds } = useTax();

  if (cgLoading) {
    return (
      <div className="tax-card tax-card--after">
        <div className="tax-card__title">After Harvesting</div>
        <Loader text="Loading gains…" size="sm" />
      </div>
    );
  }

  if (cgError) {
    return (
      <div className="tax-card tax-card--after">
        <div className="tax-card__title">After Harvesting</div>
        <p className="tax-card__error">Failed to load: {cgError}</p>
      </div>
    );
  }

  // Show pre-harvest values when nothing selected
  const data = afterHarvesting || preHarvesting;
  if (!data) return null;

  const { stcg, ltcg, realised } = data;
  const showSavings = savings > 0;
  const selectedCount = selectedIds.size;

  return (
    <div className="tax-card tax-card--after">
      <div className="tax-card__title">
        After Harvesting
        {selectedCount > 0 && (
          <span className="after-badge">{selectedCount} asset{selectedCount > 1 ? 's' : ''} selected</span>
        )}
      </div>

      <div className="stat-header">
        <span />
        <span className="stat-header__col">Short-term</span>
        <span className="stat-header__col">Long-term</span>
      </div>

      <AfterStatRow
        label="Profits"
        stValue={formatN(stcg.profits)}
        ltValue={formatN(ltcg.profits)}
      />
      <AfterStatRow
        label="Losses"
        stValue={<span className="val-loss-after">- {formatN(stcg.losses)}</span>}
        ltValue={<span className="val-loss-after">- {formatN(ltcg.losses)}</span>}
      />

      <div className="tax-card__divider tax-card__divider--after" />

      <AfterStatRow
        label="Net Capital Gains"
        stValue={
          <span className={stcg.net >= 0 ? 'val-gain-after' : 'val-loss-after'}>
            {formatN(stcg.net)}
          </span>
        }
        ltValue={
          <span className={ltcg.net >= 0 ? 'val-gain-after' : 'val-loss-after'}>
            {formatN(ltcg.net)}
          </span>
        }
        isTotal
      />

      <div className="tax-card__divider tax-card__divider--after" />

      <div className="tax-card__effective">
        <span className="tax-card__effective-label">Effective Capital Gains:</span>
        <span className="tax-card__effective-value">{formatN(realised)}</span>
      </div>

      {showSavings ? (
        <div className="savings-badge">
          <span className="savings-badge__emoji">🎉</span>
          <span>
            You are going to save upto{' '}
            <strong>
              ${savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
          </span>
        </div>
      ) : (
        <div className="savings-badge savings-badge--empty">
          <span className="savings-badge__hint">
            {selectedCount === 0
              ? 'Select loss-making assets below to see potential savings'
              : 'No tax savings from current selection'}
          </span>
        </div>
      )}
    </div>
  );
}
