import type { Indicator } from './indicator-types';

type LaborUnitConversion = {
  factor: number;
  displayUnit: string;
};

const laborUnitConversions: Record<string, LaborUnitConversion> = {
  千人: { factor: 0.1, displayUnit: '万人' },
  千个岗位: { factor: 0.1, displayUnit: '万个岗位' },
  百万个岗位: { factor: 100, displayUnit: '万个岗位' },
};

export function getLaborDisplayUnit(unit: string) {
  return laborUnitConversions[unit]?.displayUnit ?? unit;
}

function normalizeLaborValue(value: number, unit: string) {
  if (unit === '千人' && Math.abs(value) >= 10000) {
    return value / 1000;
  }

  if (unit === '百万个岗位' && Math.abs(value) >= 100) {
    return value / 1000;
  }

  return value;
}

function formatNumber(value: number, decimals: number) {
  const formatted = value.toFixed(decimals);

  return decimals > 0 ? formatted.replace(/\.0+$/, '') : formatted;
}

export function formatLaborMeasurement(value: number | undefined, unit: string, decimals?: number) {
  if (value === undefined) {
    return { valueText: '—', unitText: unit };
  }

  const normalizedValue = normalizeLaborValue(value, unit);
  const conversion = laborUnitConversions[unit];
  const displayValue = conversion ? normalizedValue * conversion.factor : normalizedValue;
  const chosenDecimals = decimals ?? (Math.abs(displayValue) >= 100 ? 0 : 1);

  return {
    valueText: formatNumber(displayValue, chosenDecimals),
    unitText: conversion?.displayUnit ?? unit,
  };
}

export function formatLaborDelta(value: number | undefined, unit: string, decimals?: number) {
  if (value === undefined) {
    return '—';
  }

  const { valueText, unitText } = formatLaborMeasurement(Math.abs(value), unit, decimals);
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';

  return `${sign}${valueText} ${unitText}`;
}

export function formatLaborComparison(
  indicator: Pick<Indicator, 'slug' | 'historyUnit' | 'valueDecimals'>,
  currentValue: number | undefined,
  previousValue: number | undefined,
) {
  if (currentValue === undefined || previousValue === undefined) {
    return {
      label: indicator.slug === 'nonfarm-payrolls' ? '上期读数' : '较上期变化',
      valueText: '—',
      detailText: '无可比上期',
    };
  }

  if (indicator.slug === 'nonfarm-payrolls') {
    const previousReading = formatLaborMeasurement(previousValue, indicator.historyUnit, indicator.valueDecimals);

    return {
      label: '上期读数',
      valueText: `${previousReading.valueText} ${previousReading.unitText}`,
      detailText: '上月新增就业',
    };
  }

  if (previousValue === 0) {
    return {
      label: '较上期变化',
      valueText: '—',
      detailText: '无可比上期',
    };
  }

  const isRateSeries = indicator.slug === 'unemployment-rate';
  const normalizedCurrentValue = isRateSeries ? currentValue : normalizeLaborValue(currentValue, indicator.historyUnit);
  const normalizedPreviousValue = isRateSeries ? previousValue : normalizeLaborValue(previousValue, indicator.historyUnit);
  const deltaValue = normalizedCurrentValue - normalizedPreviousValue;

  return {
    label: '较上期变化',
    valueText: isRateSeries
      ? formatLaborDelta(deltaValue, '个百分点', indicator.valueDecimals ?? 1)
      : formatLaborDelta(deltaValue, indicator.historyUnit, indicator.valueDecimals),
    detailText: isRateSeries ? '单位是百分点' : '招聘动能变化',
  };
}
