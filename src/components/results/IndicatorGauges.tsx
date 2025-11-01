import type { TechnicalIndicators } from '../../types/backend';
import { RSIGauge } from './gauges/RSIGauge';
import { MACDChart } from './gauges/MACDChart';
import { BollingerBandsVisual } from './gauges/BollingerBandsVisual';
import { StochasticChart } from './gauges/StochasticChart';
import { ProgressIndicator } from './gauges/ProgressIndicator';
import { MovingAverageComparison } from './gauges/MovingAverageComparison';

interface IndicatorGaugesProps {
  indicators: TechnicalIndicators;
  currentPrice?: number;
}

export function IndicatorGauges({ indicators, currentPrice }: IndicatorGaugesProps) {
  // Type guards
  const isBollingerBands = (value: unknown): value is { upper: number; middle: number; lower: number; band_pct?: number } => {
    if (typeof value !== 'object' || value === null) return false;
    const obj = value as Record<string, unknown>;
    return (
      'upper' in obj &&
      'middle' in obj &&
      'lower' in obj &&
      typeof obj.upper === 'number' &&
      typeof obj.middle === 'number' &&
      typeof obj.lower === 'number'
    );
  };

  const isStochastic = (value: unknown): value is { k: number; d: number } => {
    if (typeof value !== 'object' || value === null) return false;
    const obj = value as Record<string, unknown>;
    return (
      'k' in obj &&
      'd' in obj &&
      typeof obj.k === 'number' &&
      typeof obj.d === 'number'
    );
  };

  const isValidNumber = (value: unknown): value is number => 
    typeof value === 'number' && !isNaN(value) && isFinite(value);

  // Extract indicator values with proper type handling
  const rsi = typeof indicators.rsi_14 === 'number' ? indicators.rsi_14 : indicators.rsi;
  const macd = indicators.macd;
  const bbands = isBollingerBands(indicators.bbands) ? indicators.bbands : 
                 isBollingerBands(indicators.bollinger_bands) ? indicators.bollinger_bands : 
                 null;
  const stoch = isStochastic(indicators.stoch) ? indicators.stoch :
                isStochastic(indicators.stochastic) ? indicators.stochastic :
                null;
  const adx = typeof indicators.adx_14 === 'number' ? indicators.adx_14 : indicators.adx;
  const atr = typeof indicators.atr_14 === 'number' ? indicators.atr_14 : indicators.atr;
  const sma_20 = isValidNumber(indicators.sma_20) ? indicators.sma_20 :
                 isValidNumber(indicators.moving_averages?.sma_20) ? indicators.moving_averages.sma_20 :
                 undefined;
  const sma_50 = isValidNumber(indicators.sma_50) ? indicators.sma_50 :
                 isValidNumber(indicators.moving_averages?.sma_50) ? indicators.moving_averages.sma_50 :
                 undefined;
  const ema_50 = isValidNumber((indicators as Record<string, unknown>).ema_50) ? (indicators as Record<string, unknown>).ema_50 as number : undefined;
  const obv = isValidNumber(indicators.obv) ? indicators.obv : undefined;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* RSI Gauge */}
      {rsi !== undefined && (
        <div className="bg-card-hover/50 rounded-lg p-4 border border-border">
          <RSIGauge value={rsi} />
        </div>
      )}

      {/* MACD Chart */}
      {macd && macd.macd !== undefined && macd.signal !== undefined && (
        <div className="bg-card-hover/50 rounded-lg p-4 border border-border">
          <MACDChart 
            macd={macd.macd} 
            signal={macd.signal} 
            histogram={isValidNumber((macd as Record<string, unknown>).hist) ? (macd as Record<string, unknown>).hist as number : macd.histogram ?? 0} 
          />
        </div>
      )}

      {/* Bollinger Bands */}
      {bbands && (
        <div className="bg-card-hover/50 rounded-lg p-4 border border-border">
          <BollingerBandsVisual
            upper={bbands.upper}
            middle={bbands.middle}
            lower={bbands.lower}
            currentPrice={currentPrice}
            bandPct={bbands.band_pct}
          />
        </div>
      )}

      {/* Stochastic */}
      {stoch && (
        <div className="bg-card-hover/50 rounded-lg p-4 border border-border">
          <StochasticChart k={stoch.k} d={stoch.d} />
        </div>
      )}

      {/* ADX */}
      {adx !== undefined && (
        <div className="bg-card-hover/50 rounded-lg p-4 border border-border">
          <ProgressIndicator
            label="ADX (Trend Strength)"
            value={adx}
            max={100}
            thresholds={{ low: 20, medium: 25, high: 50 }}
            contextLabel={adx < 20 ? 'Weak Trend' : adx < 25 ? 'Emerging Trend' : adx < 50 ? 'Strong Trend' : 'Very Strong Trend'}
          />
        </div>
      )}

      {/* ATR */}
      {atr !== undefined && (
        <div className="bg-card-hover/50 rounded-lg p-4 border border-border">
          <ProgressIndicator
            label="ATR (Volatility)"
            value={atr}
            max={currentPrice ? currentPrice * 0.1 : 100}
            thresholds={{ low: 10, medium: 30, high: 60 }}
            contextLabel={atr < 10 ? 'Low Volatility' : atr < 30 ? 'Moderate Volatility' : 'High Volatility'}
          />
        </div>
      )}

      {/* Moving Averages */}
      {(sma_20 !== undefined || sma_50 !== undefined || ema_50 !== undefined) && (
        <div className="bg-card-hover/50 rounded-lg p-4 border border-border md:col-span-2">
          <MovingAverageComparison
            sma_20={sma_20}
            sma_50={sma_50}
            ema_50={ema_50}
            currentPrice={currentPrice}
          />
        </div>
      )}

      {/* OBV (if available) */}
      {obv !== undefined && (
        <div className="bg-card-hover/50 rounded-lg p-4 border border-border">
          <div className="text-xs text-text-muted mb-2 font-medium">On-Balance Volume</div>
          <div className="text-2xl font-bold font-mono text-text-primary">
            {obv.toLocaleString()}
          </div>
          <div className="text-xs text-text-disabled mt-1">
            {obv > 0 ? 'Accumulation' : obv < 0 ? 'Distribution' : 'Neutral'}
          </div>
        </div>
      )}
    </div>
  );
}

