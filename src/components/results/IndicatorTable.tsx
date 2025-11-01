import type { TechnicalIndicators } from '../../types/backend';

interface IndicatorTableProps {
  indicators: TechnicalIndicators;
}

export function IndicatorTable({ indicators }: IndicatorTableProps) {
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') return value.toFixed(2);
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const rows: Array<{ label: string; value: string }> = [];

  // RSI
  if (indicators.rsi !== undefined) {
    rows.push({ label: 'RSI', value: formatValue(indicators.rsi) });
  }

  // MACD
  if (indicators.macd) {
    rows.push({ label: 'MACD', value: formatValue(indicators.macd.macd) });
    rows.push({ label: 'MACD Signal', value: formatValue(indicators.macd.signal) });
    rows.push({ label: 'MACD Histogram', value: formatValue(indicators.macd.histogram) });
  }

  // Moving Averages
  if (indicators.moving_averages) {
    const ma = indicators.moving_averages;
    if (ma.sma_20) rows.push({ label: 'SMA 20', value: formatValue(ma.sma_20) });
    if (ma.sma_50) rows.push({ label: 'SMA 50', value: formatValue(ma.sma_50) });
    if (ma.ema_12) rows.push({ label: 'EMA 12', value: formatValue(ma.ema_12) });
    if (ma.ema_26) rows.push({ label: 'EMA 26', value: formatValue(ma.ema_26) });
  }

  // Bollinger Bands
  if (indicators.bollinger_bands) {
    rows.push({ label: 'BB Upper', value: formatValue(indicators.bollinger_bands.upper) });
    rows.push({ label: 'BB Middle', value: formatValue(indicators.bollinger_bands.middle) });
    rows.push({ label: 'BB Lower', value: formatValue(indicators.bollinger_bands.lower) });
  }

  // ATR
  if (indicators.atr !== undefined) {
    rows.push({ label: 'ATR', value: formatValue(indicators.atr) });
  }

  // ADX
  if (indicators.adx !== undefined) {
    rows.push({ label: 'ADX', value: formatValue(indicators.adx) });
  }

  // Stochastic
  if (indicators.stochastic) {
    rows.push({ label: 'Stochastic %K', value: formatValue(indicators.stochastic.k) });
    rows.push({ label: 'Stochastic %D', value: formatValue(indicators.stochastic.d) });
  }

  // Volume
  if (indicators.volume !== undefined) {
    rows.push({ label: 'Volume', value: formatValue(indicators.volume) });
  }

  // Any other indicators
  Object.keys(indicators).forEach((key) => {
    if (!['rsi', 'macd', 'moving_averages', 'bollinger_bands', 'atr', 'adx', 'stochastic', 'volume'].includes(key)) {
      rows.push({ label: key, value: formatValue(indicators[key]) });
    }
  });

  if (rows.length === 0) {
    return <div className="text-text-disabled text-sm">No indicators available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-3 text-text-muted font-medium">Indicator</th>
            <th className="text-right py-2 px-3 text-text-muted font-medium">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-border hover:bg-card/50">
              <td className="py-2 px-3 text-text-secondary">{row.label}</td>
              <td className="py-2 px-3 text-right font-mono text-text-primary">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

