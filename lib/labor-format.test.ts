import { describe, expect, it } from 'vitest';

import { formatLaborComparison, formatLaborDelta, formatLaborMeasurement } from './labor-format';

describe('labor format', () => {
  it('converts thousand-based labor counts into Chinese ten-thousand units', () => {
    expect(formatLaborMeasurement(178, '千个岗位')).toEqual({ valueText: '17.8', unitText: '万个岗位' });
    expect(formatLaborMeasurement(311, '千人')).toEqual({ valueText: '31.1', unitText: '万人' });
  });

  it('converts million-based JOLTS counts into Chinese ten-thousand units', () => {
    expect(formatLaborMeasurement(7.3, '百万个岗位')).toEqual({ valueText: '730', unitText: '万个岗位' });
  });

  it('guards against raw FRED JOLTS values being converted twice', () => {
    expect(formatLaborMeasurement(6882, '百万个岗位')).toEqual({ valueText: '688', unitText: '万个岗位' });
  });

  it('guards against raw FRED claims counts being converted twice', () => {
    expect(formatLaborMeasurement(202000, '千人')).toEqual({ valueText: '20.2', unitText: '万人' });
    expect(formatLaborMeasurement(1841000, '千人')).toEqual({ valueText: '184', unitText: '万人' });
  });

  it('formats labor deltas with the same display units', () => {
    expect(formatLaborDelta(-69, '千个岗位')).toBe('-6.9 万个岗位');
    expect(formatLaborDelta(13, '千人')).toBe('+1.3 万人');
    expect(formatLaborDelta(-0.1, '个百分点')).toBe('-0.1 个百分点');
  });

  it('shows the prior reading for nonfarm payrolls instead of a change-of-change', () => {
    expect(formatLaborComparison({ slug: 'nonfarm-payrolls', historyUnit: '千个岗位' }, 178, -133)).toEqual({
      label: '上期读数',
      valueText: '-13.3 万个岗位',
      detailText: '上月新增就业',
    });
  });

  it('computes claims deltas after normalizing raw FRED values', () => {
    expect(formatLaborComparison({ slug: 'initial-jobless-claims', historyUnit: '千人' }, 202000, 211000)).toEqual({
      label: '较上期变化',
      valueText: '-0.9 万人',
      detailText: '招聘动能变化',
    });
  });
});
