import { useState, useMemo } from 'react';
import { useTax, getHoldingKey } from '../../context/TaxContext';
import { filterHoldings, sortHoldings } from '../../utils/calculations';
import { Loader, ErrorBox, Checkbox } from '../UI/SharedUI';
import HoldingRow from './HoldingRow';
import './Holdings.css';

const PAGE_SIZE = 8;

function SortButton({ label, sortKeyAsc, sortKeyDesc, currentSort, onSort }) {
  const isAsc = currentSort === sortKeyAsc;
  const isDesc = currentSort === sortKeyDesc;
  const nextSort = isAsc ? sortKeyDesc : sortKeyAsc;

  return (
    <button
      className="sort-btn"
      onClick={() => onSort(nextSort)}
      title={`Sort by ${label}`}
    >
      {label}
      <span className="sort-arrows">
        <svg className={`arrow up ${isAsc ? 'active' : ''}`} width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
        <svg className={`arrow down ${isDesc ? 'active' : ''}`} width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </span>
    </button>
  );
}

export default function HoldingsTable() {
  const {
    holdings, holdLoading, holdError,
    selectedIds, toggleHolding, toggleAll,
  } = useTax();

  const [sortBy,   setSortBy]   = useState('value_desc');
  const [showAll,  setShowAll]  = useState(false);

  // Derived: filter + sort (filter removed, default to 'all')
  const processed = useMemo(
    () => sortHoldings(filterHoldings(holdings, 'all', ''), sortBy),
    [holdings, sortBy]
  );

  // Paginate / view-all
  const displayed = showAll ? processed : processed.slice(0, PAGE_SIZE);

  // All keys for select-all (scoped to current filtered set)
  const allKeys = useMemo(
    () => processed.map((h, i) => getHoldingKey(h, holdings.indexOf(h))),
    [processed, holdings]
  );
  const allChecked     = allKeys.length > 0 && allKeys.every((k) => selectedIds.has(k));
  const someChecked    = allKeys.some((k) => selectedIds.has(k)) && !allChecked;
  const selectedInView = allKeys.filter((k) => selectedIds.has(k)).length;

  function handleToggleAll(checked) {
    toggleAll(allKeys, checked);
  }

  if (holdLoading) {
    return (
      <div className="holdings-card">
        <div className="holdings-card__header">
          <h2 className="holdings-card__title">Holdings</h2>
        </div>
        <Loader text="Fetching your holdings…" />
      </div>
    );
  }

  if (holdError) {
    return (
      <div className="holdings-card">
        <div className="holdings-card__header">
          <h2 className="holdings-card__title">Holdings</h2>
        </div>
        <div style={{ padding: '20px' }}>
          <ErrorBox message={holdError} />
        </div>
      </div>
    );
  }

  return (
    <div className="holdings-card">
      {/* Card header */}
      <div className="holdings-card__header">
        <h2 className="holdings-card__title">Holdings</h2>
        {selectedIds.size > 0 && (
          <span className="holdings-card__selected">
            {selectedIds.size} asset{selectedIds.size > 1 ? 's' : ''} selected
          </span>
        )}
      </div>

      {/* Filter bar removed as per user request */}

      {/* Table */}
      <div className="holdings-table-wrap">
        <table className="holdings-table">
          <thead>
            <tr className="holdings-table__head-row">
              <th className="col-cb">
                <Checkbox
                  id="select-all"
                  checked={allChecked}
                  indeterminate={someChecked}
                  onChange={(e) => handleToggleAll(e.target.checked)}
                  label="Select all visible holdings"
                />
              </th>
              <th className="col-asset">
                <SortButton
                  label="Asset"
                  sortKeyAsc="name_asc"
                  sortKeyDesc="name_desc"
                  currentSort={sortBy}
                  onSort={setSortBy}
                />
              </th>
              <th className="col-holdings">
                Holdings
                <span className="th-sub">Avg Buy Price</span>
              </th>
              <th className="col-price">Current Price</th>
              <th className="col-value">
                <SortButton
                  label="Total Value"
                  sortKeyAsc="value_asc"
                  sortKeyDesc="value_desc"
                  currentSort={sortBy}
                  onSort={setSortBy}
                />
                {/* <span className="th-sub">Hover for 5dp</span> */}
              </th>
              <th className="col-stcg">
                <SortButton
                  label="Short-Term Gain"
                  sortKeyAsc="stcg_asc"
                  sortKeyDesc="stcg_desc"
                  currentSort={sortBy}
                  onSort={setSortBy}
                />
                {/* <span className="th-sub">Balance</span> */}
              </th>
              <th className="col-ltcg">
                <SortButton
                  label="Long-Term Gain"
                  sortKeyAsc="ltcg_asc"
                  sortKeyDesc="ltcg_desc"
                  currentSort={sortBy}
                  onSort={setSortBy}
                />
                {/* <span className="th-sub">Balance</span> */}
              </th>
              <th className="col-sell">Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={8} className="holdings-empty">
                  <div className="holdings-empty__inner">
                    <span className="holdings-empty__icon">🔍</span>
                    <span>No assets match your filters</span>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => setSortBy('value_desc')}
                    >
                      Reset sort
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              displayed.map((holding) => {
                const idx = holdings.indexOf(holding);
                const key = getHoldingKey(holding, idx);
                return (
                  <HoldingRow
                    key={key}
                    holding={holding}
                    rowKey={key}
                    checked={selectedIds.has(key)}
                    onToggle={toggleHolding}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer — View All / Show Less */}
      {processed.length > PAGE_SIZE && (
        <div className="holdings-card__footer">
          <button
            className="btn btn--ghost"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
                Show Less
              </>
            ) : (
              <>
                View All {processed.length} Assets
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </>
            )}
          </button>
          <span className="holdings-card__footer-count">
            {showAll ? processed.length : Math.min(PAGE_SIZE, processed.length)} / {processed.length} shown
          </span>
        </div>
      )}
    </div>
  );
}
