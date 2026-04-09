import { describe, expect, it } from 'vitest';

import { formatObservationDate, getSeriesAverage, getSeriesComparison, getSeriesDelta } from './series';

describe('series comparison', () => {
  it('summarizes the latest value against the previous point and historical range', () => {
    const summary = getSeriesComparison([
      { date: '2024-01', value: 100 },
      { date: '2024-02', value: 105 },
      { date: '2024-03', value: 103 },
    ]);

    expect(summary?.latest.value).toBe(103);
    expect(summary?.previous?.value).toBe(105);
    expect(summary?.change.absolute).toBe(-2);
    expect(summary?.change.percent).toBeCloseTo(-1.9, 1);
    expect(summary?.position.percent).toBe(60);
    expect(summary?.position.label).toBe('中位');
  });

  it('calculates changes across arbitrary periods', () => {
    const delta = getSeriesDelta(
      [
        { date: '2024-01', value: 100 },
        { date: '2024-02', value: 101 },
        { date: '2024-03', value: 102 },
        { date: '2024-04', value: 103 },
        { date: '2024-05', value: 104 },
        { date: '2024-06', value: 105 },
        { date: '2024-07', value: 106 },
        { date: '2024-08', value: 107 },
        { date: '2024-09', value: 108 },
        { date: '2024-10', value: 109 },
        { date: '2024-11', value: 110 },
        { date: '2024-12', value: 111 },
        { date: '2025-01', value: 112 },
      ],
      1,
    );

    expect(delta?.latest.value).toBe(112);
    expect(delta?.comparison?.value).toBe(111);
    expect(delta?.absolute).toBe(1);
    expect(delta?.percent).toBeCloseTo(0.9, 1);
  });

  it('calculates a trailing average for the latest observations', () => {
    const average = getSeriesAverage(
      [
        { date: '2024-01', value: 1 },
        { date: '2024-02', value: 2 },
        { date: '2024-03', value: 3 },
        { date: '2024-04', value: 4 },
      ],
      3,
    );

    expect(average).toBe(3);
  });

  it('formats observation dates for display', () => {
    expect(formatObservationDate('2026-02-01')).toBe('2026年2月');
    expect(formatObservationDate('2026-02')).toBe('2026年2月');
  });
});
