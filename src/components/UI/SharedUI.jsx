import { useState, useRef, useEffect } from 'react';
import './SharedUI.css';

// ─── Loader ───────────────────────────────────────────────────────────────────

export function Loader({ text = 'Loading…', size = 'md' }) {
  return (
    <div className={`loader loader--${size}`} role="status" aria-live="polite">
      <div className="loader__spinner">
        <div className="loader__ring" />
      </div>
      {text && <span className="loader__text">{text}</span>}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      {[1,2,3,4,5,6,7].map(i => (
        <td key={i}><div className="skeleton-cell" /></td>
      ))}
    </tr>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

export function Tooltip({ children, content, placement = 'top' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  return (
    <span
      ref={ref}
      className="tooltip-wrap"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className={`tooltip-box tooltip-box--${placement}`} role="tooltip">
          {content}
        </span>
      )}
    </span>
  );
}

// ─── Popover (click-triggered) ────────────────────────────────────────────────

export function Popover({ trigger, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <span ref={ref} className="popover-wrap">
      <span onClick={() => setOpen((v) => !v)} className="popover-trigger">
        {trigger}
      </span>
      {open && <span className="popover-box">{children}</span>}
    </span>
  );
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

export function Checkbox({ checked, indeterminate = false, onChange, id, label }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className="cb-label" htmlFor={id}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="cb-input"
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      <span className="cb-visual" aria-hidden="true">
        {indeterminate ? (
          <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
            <rect width="10" height="2" rx="1"/>
          </svg>
        ) : checked ? (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 4 7 9 1"/>
          </svg>
        ) : null}
      </span>
    </label>
  );
}

// ─── Error Box ────────────────────────────────────────────────────────────────

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <span className="error-box__icon">⚠️</span>
      <div className="error-box__content">
        <strong>Something went wrong</strong>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button className="error-box__retry btn btn--outline" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export function Badge({ children, variant = 'default' }) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}
