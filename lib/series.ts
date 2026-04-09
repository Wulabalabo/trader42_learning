import type { IndicatorHistoryPoint } from './indicator-types';

type ChartPoint = {
  x: number;
  y: number;
};

export function getLatestPoint(history: IndicatorHistoryPoint[]): IndicatorHistoryPoint | undefined {
  return history.at(-1);
}

export function getSeriesBounds(history: IndicatorHistoryPoint[]) {
  const values = history.map((point) => point.value);

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

export function buildSeriesPath(
  history: IndicatorHistoryPoint[],
  width = 640,
  height = 220,
  padding = 24,
): string {
  if (history.length === 0) {
    return '';
  }

  const { min, max } = getSeriesBounds(history);
  const range = max - min || 1;
  const stepX = history.length === 1 ? 0 : (width - padding * 2) / (history.length - 1);

  const points = history.map<ChartPoint>((point, index) => {
    const x = padding + index * stepX;
    const normalized = (point.value - min) / range;
    const y = height - padding - normalized * (height - padding * 2);

    return { x, y };
  });

  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');
}

export function getSeriesTickIndices(length: number, maxTicks = 6): number[] {
  if (length <= 0) {
    return [];
  }

  if (length <= maxTicks) {
    return Array.from({ length }, (_, index) => index);
  }

  const step = (length - 1) / (maxTicks - 1);
  const indices = Array.from({ length: maxTicks }, (_, index) => Math.round(index * step));

  return Array.from(new Set(indices)).sort((a, b) => a - b);
}

export function getSeriesComparison(history: IndicatorHistoryPoint[]) {
  if (history.length === 0) {
    return undefined;
  }

  const latest = history.at(-1)!;
  const previous = history.at(-2);
  const bounds = getSeriesBounds(history);
  const range = bounds.max - bounds.min || 1;
  const positionPercent = Math.round(((latest.value - bounds.min) / range) * 100);

  return {
    latest,
    previous,
    change: previous
      ? {
          absolute: Number((latest.value - previous.value).toFixed(1)),
          percent: previous.value === 0 ? undefined : Number((((latest.value - previous.value) / previous.value) * 100).toFixed(1)),
        }
      : undefined,
    position: {
      percent: positionPercent,
      label: positionPercent >= 75 ? '高位' : positionPercent <= 25 ? '低位' : '中位',
    },
  };
}

export function getSeriesAverage(history: IndicatorHistoryPoint[], periods = history.length) {
  if (history.length === 0) {
    return undefined;
  }

  const sample = history.slice(Math.max(history.length - periods, 0));
  if (sample.length === 0) {
    return undefined;
  }

  const total = sample.reduce((sum, point) => sum + point.value, 0);

  return Number((total / sample.length).toFixed(2));
}

export function getSeriesDelta(history: IndicatorHistoryPoint[], periodsAgo = 1) {
  if (history.length <= periodsAgo) {
    return undefined;
  }

  const latest = history.at(-1)!;
  const comparison = history.at(-(periodsAgo + 1))!;
  const absolute = Number((latest.value - comparison.value).toFixed(3));
  const percent = comparison.value === 0 ? undefined : Number((((latest.value - comparison.value) / comparison.value) * 100).toFixed(1));

  return {
    latest,
    comparison,
    absolute,
    percent,
  };
}

export function formatObservationDate(date: string) {
  const [year, month] = date.split('-');

  if (!year || !month) {
    return date;
  }

  return `${year}年${Number(month)}月`;
}
