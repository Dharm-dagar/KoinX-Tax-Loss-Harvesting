import { useCapitalGains } from '../hooks/useCapitalGains';
import { useHoldings } from '../hooks/useHoldings';
import DisclaimerAccordion from '../components/UI/DisclaimerAccordion';
import PreHarvestCard from '../components/TaxCards/PreHarvestCard';
import AfterHarvestCard from '../components/TaxCards/AfterHarvestCard';
import HoldingsTable from '../components/Holdings/HoldingsTable';
import { Popover } from '../components/UI/SharedUI';
import './TaxHarvesting.css';

function HowItWorksContent() {
  return (
    <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>
      <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 8, fontSize: 14 }}>
        What is Tax-Loss Harvesting?
      </strong>
      Tax-loss harvesting is a strategy of selling assets at a loss to offset capital gains,
      reducing your overall tax liability for the year.
      <br /><br />
      <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 6 }}>How to use this tool:</strong>
      <ol style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <li>Review your current capital gains in the <em>Pre Harvesting</em> card.</li>
        <li>Select holdings from the table below that have losses.</li>
        <li>Watch the <em>After Harvesting</em> card update in real-time.</li>
        <li>Execute the suggested trades to realise the savings.</li>
      </ol>
      <br />
      <a
        href="https://koinx.com"
        target="_blank"
        rel="noreferrer"
        style={{ color: 'var(--blue)', fontWeight: 600 }}
      >
        Learn more at KoinX →
      </a>
    </div>
  );
}

export default function TaxHarvesting() {
  // Fire off data fetching
  useCapitalGains();
  useHoldings();

  return (
    <main className="page">
      <div className="page__inner">
        {/* Page title row */}
        <div className="page__title-row">
          <div className="page__title-left">
            <h1 className="page__title">Tax Harvesting</h1>
            <Popover
              trigger={
                <span className="how-link">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  How it works?
                </span>
              }
            >
              <HowItWorksContent />
            </Popover>
          </div>
        </div>

        {/* Disclaimer */}
        <DisclaimerAccordion />

        {/* Cards grid */}
        <div className="cards-grid">
          <PreHarvestCard />
          <AfterHarvestCard />
        </div>

        {/* Holdings Table */}
        <HoldingsTable />
      </div>
    </main>
  );
}
