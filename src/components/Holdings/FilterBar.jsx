import { FILTER_OPTIONS, SORT_OPTIONS } from '../../utils/calculations';
import './Holdings.css';

export default function FilterBar({
  search, onSearch,
  filter, onFilter,
  sortBy, onSort,
  totalCount, visibleCount,
}) {
  return (
    <div className="filter-bar">
      {/* Search */}
      <div className="filter-search">
        <span className="filter-search__icon" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input
          type="search"
          className="filter-search__input"
          placeholder="Search assets…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search holdings"
        />
        {search && (
          <button
            className="filter-search__clear"
            onClick={() => onSearch('')}
            aria-label="Clear search"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs" role="group" aria-label="Filter assets">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`filter-tab ${filter === opt.value ? 'filter-tab--active' : ''}`}
            onClick={() => onFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <div className="filter-sort">
        <label className="filter-sort__label" htmlFor="sort-select">Sort:</label>
        <select
          id="sort-select"
          className="filter-sort__select"
          value={sortBy}
          onChange={(e) => onSort(e.target.value)}
          aria-label="Sort holdings"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Count indicator */}
      <div className="filter-count">
        <span className="filter-count__text">
          Showing <strong>{visibleCount}</strong> of <strong>{totalCount}</strong>
        </span>
      </div>
    </div>
  );
}
