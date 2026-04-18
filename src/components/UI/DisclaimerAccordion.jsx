import { useState } from 'react';
import './DisclaimerAccordion.css';

const DISCLAIMERS = [
  'Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.',
  'Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.',
  'Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.',
  'Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.',
  'Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.',
];

export default function DisclaimerAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`disclaimer ${open ? 'disclaimer--open' : ''}`}>
      <button
        className="disclaimer__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="disclaimer__left">
          <span className="disclaimer__icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </span>
          Important Notes &amp; Disclaimers
        </span>
        <span className={`disclaimer__chevron ${open ? 'disclaimer__chevron--up' : ''}`} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>

      <div className="disclaimer__body" aria-hidden={!open}>
        <ul className="disclaimer__list">
          {DISCLAIMERS.map((text, i) => (
            <li key={i} className="disclaimer__item">
              <span className="disclaimer__bullet" aria-hidden="true">•</span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
