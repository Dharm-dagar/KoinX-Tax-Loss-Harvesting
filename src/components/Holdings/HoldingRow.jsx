import { useState } from 'react';
import { Checkbox, Tooltip } from '../UI/SharedUI';
import {
  formatHolding,
  formatPrice,
  formatGain,
  formatTotalValue,
  formatTotalValueFull,
} from '../../utils/formatters';
import './Holdings.css';

const DEFAULT_LOGO = 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';

function CoinLogo({ src, alt }) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={err ? DEFAULT_LOGO : src}
      alt={alt}
      className="coin-logo"
      onError={() => setErr(true)}
      loading="lazy"
      width={32}
      height={32}
    />
  );
}

function GainCell({ gain, balance, label, symbol }) {
  const { text, cls } = formatGain(gain);
  const balanceFormatted = balance
    ? `${balance.toLocaleString('en-IN', { maximumSignificantDigits: 6 })} ${symbol}`
    : `0 ${symbol}`;

  return (
    <div className="gain-cell">
      <Tooltip
        content={`${label}: ${text} | Balance: ${balanceFormatted}`}
        placement="top"
      >
        <span className={`gain-cell__value gain-cell__value--${cls}`}>{text}</span>
      </Tooltip>
      <span className="gain-cell__balance">{balanceFormatted}</span>
    </div>
  );
}

function TotalValueCell({ holding }) {
  const [hovered, setHovered] = useState(false);
  const shortVal = formatTotalValue(holding);
  const fullVal = formatTotalValueFull(holding);

  return (
    <Tooltip content={`Full precision: ${fullVal}`} placement="top">
      <div
        className={`total-val-cell ${hovered ? 'total-val-cell--hovered' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="total-val-cell__val">{hovered ? fullVal : shortVal}</span>
        {hovered && <span className="total-val-cell__hint">5dp</span>}
      </div>
    </Tooltip>
  );
}

export default function HoldingRow({ holding, rowKey, checked, onToggle }) {
  const amountToSell = checked ? formatHolding(holding.totalHolding, holding.coin) : '—';

  return (
    <tr
      className={`holding-row ${checked ? 'holding-row--checked' : ''}`}
      onClick={() => onToggle(rowKey)}
    >
      {/* Checkbox */}
      <td className="col-cb" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          id={`cb-${rowKey}`}
          checked={checked}
          onChange={() => onToggle(rowKey)}
          label={`Select ${holding.coinName}`}
        />
      </td>

      {/* Asset */}
      <td className="col-asset">
        <div className="asset-cell">
          <div className="asset-cell__logo-wrap">
            <CoinLogo src={holding.logo} alt={holding.coin} />
          </div>
          <div className="asset-cell__info">
            <span className="asset-cell__symbol">{holding.coin}</span>
            <span className="asset-cell__name">{holding.coinName}</span>
          </div>
        </div>
      </td>

      {/* Holdings + Avg Buy Price */}
      <td className="col-holdings">
        <div className="holdings-cell">
          <Tooltip
            content={`Full: ${holding.totalHolding} ${holding.coin}`}
            placement="top"
          >
            <span className="holdings-cell__qty">
              {formatHolding(holding.totalHolding)} {holding.coin}
            </span>
          </Tooltip>
          <span className="holdings-cell__avg">
            Rate: {formatPrice(holding.currentPrice)} / {holding.coin}
          </span>
        </div>
      </td>

      {/* Current Price */}
      <td className="col-price">
        <Tooltip
          content={`Price: $${holding.currentPrice.toFixed(5)}`}
          placement="top"
        >
          <span className="price-cell">{formatPrice(holding.currentPrice)}</span>
        </Tooltip>
      </td>

      {/* Total Current Value — hover shows 5dp */}
      <td className="col-value">
        <TotalValueCell holding={holding} />
      </td>

      {/* Short-Term Gain */}
      <td className="col-stcg">
        <GainCell
          gain={holding.stcg.gain}
          balance={holding.stcg.balance}
          symbol={holding.coin}
          label="ST Gain"
        />
      </td>

      {/* Long-Term Gain */}
      <td className="col-ltcg">
        <GainCell
          gain={holding.ltcg.gain}
          balance={holding.ltcg.balance}
          symbol={holding.coin}
          label="LT Gain"
        />
      </td>

      {/* Amount to Sell */}
      <td className="col-sell">
        <span className={`sell-cell ${checked ? 'sell-cell--active' : 'sell-cell--empty'}`}>
          {amountToSell}
        </span>
      </td>
    </tr>
  );
}
