import { render, screen } from '@testing-library/react';

import type { Indicator } from '@/lib/indicator-types';
import { getThemeBySlug } from '@/lib/theme-data';

import { ThemeIndicatorGrid } from './theme-indicator-grid';

function createIndicator(overrides: Partial<Indicator>): Indicator {
  return {
    slug: 'test',
    title: 'Test',
    category: '通胀',
    summary: 'summary',
    historyUnit: '指数点',
    status: 'live',
    priority: 'P1',
    templateKey: 'generic',
    navGroup: '测试',
    dataProvider: 'fred',
    revalidateSeconds: 86400,
    releaseCadence: '每月',
    updatedAt: '2026-04-08',
    scopes: ['美国'],
    sourceLabel: 'test',
    currentAssessment: { level: 'Medium', reason: 'test' },
    whyItMatters: 'test',
    whatItMeans: [],
    cannotTell: [],
    marketImpact: [],
    history: [{ date: '2026-01', value: 1 }],
    historyNote: 'test',
    ...overrides,
  };
}

describe('ThemeIndicatorGrid', () => {
  it('renders indicator cards for a theme', async () => {
    const theme = await getThemeBySlug('labor');

    expect(theme).toBeDefined();
    render(<ThemeIndicatorGrid indicators={theme!.indicators} />);

    expect(screen.getByTestId('theme-indicator-list')).toHaveClass('grid-cols-1');
    expect(screen.getByRole('link', { name: /非农就业人数（NFP）/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /失业率/ })).toBeInTheDocument();
    expect(screen.getAllByText('上期读数').length).toBeGreaterThan(0);
    expect(screen.getAllByText('18.7 万个岗位').length).toBeGreaterThan(0);
    expect(screen.getAllByText('24.3 万人').length).toBeGreaterThan(0);
    expect(screen.queryByText(/发布时间节奏：/)).toBeNull();
    expect(screen.queryByText(/数据来源：/)).toBeNull();
  });

  it('formats theme values with the same primary display rules as detail pages', () => {
    const indicators = [
      createIndicator({ slug: 'cpi', title: 'CPI', templateKey: 'inflation', history: [{ date: '2026-01', value: 322.45 }] }),
      createIndicator({ slug: 'fomc-rate-decision', title: 'FOMC', templateKey: 'policy', historyUnit: '%', history: [{ date: '2026-01', value: 4.375 }] }),
      createIndicator({ slug: 'ism-pmi', title: 'ISM PMI', templateKey: 'growth', historyUnit: '指数', history: [{ date: '2026-01', value: 49.83 }] }),
    ];

    render(<ThemeIndicatorGrid indicators={indicators} />);

    expect(screen.getAllByText('322 指数点').length).toBeGreaterThan(0);
    expect(screen.getAllByText('4.38%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('49.8').length).toBeGreaterThan(0);
  });

  it('shows current value and percent change versus prior period', () => {
    const indicator = createIndicator({
      slug: 'ism-pmi',
      title: 'ISM PMI',
      templateKey: 'growth',
      historyUnit: '指数',
      history: [
        { date: '2025-12', value: 48.5 },
        { date: '2026-01', value: 49.8 },
        { date: '2026-02', value: 51.2 },
      ],
      latestSnapshot: {
        value: 51.2,
        previousValue: 49.8,
        periodLabel: '2026-02',
        sourceLabel: 'Trading Economics',
      },
    });

    render(<ThemeIndicatorGrid indicators={[indicator]} />);

    expect(screen.getByText('当前值')).toBeInTheDocument();
    expect(screen.getAllByText('51.2').length).toBeGreaterThan(0);
    expect(screen.getByText('较上期变化')).toBeInTheDocument();
    expect(screen.getByText('+2.8%')).toBeInTheDocument();
    expect(screen.queryByText('summary')).toBeNull();
    expect(screen.queryByText(/发布时间节奏：/)).toBeNull();
    expect(screen.queryByText(/数据来源：/)).toBeNull();
  });

  it('uses history to compute percent change when no snapshot previous value exists', () => {
    const indicator = createIndicator({
      slug: 'cpi',
      title: 'CPI',
      templateKey: 'inflation',
      history: [
        { date: '2025-11', value: 321.5 },
        { date: '2025-12', value: 322.4 },
        { date: '2026-01', value: 323.1 },
      ],
      latestSnapshot: {
        value: 323.1,
        periodLabel: '2026-02',
        sourceLabel: 'FRED',
      },
    });

    render(<ThemeIndicatorGrid indicators={[indicator]} />);

    expect(screen.getByText('当前值')).toBeInTheDocument();
    expect(screen.getAllByText('323 指数点').length).toBeGreaterThan(0);
    expect(screen.getByText('较上期变化')).toBeInTheDocument();
    expect(screen.getByText('+0.2%')).toBeInTheDocument();
    expect(screen.queryByText('summary')).toBeNull();
  });

  it('keeps CPI cards on raw index points instead of converting to percentages', () => {
    const indicator = createIndicator({
      slug: 'cpi',
      title: 'CPI',
      templateKey: 'inflation',
      history: [
        { date: '2025-01-01', value: 313.0 },
        { date: '2025-02-01', value: 314.0 },
        { date: '2025-03-01', value: 315.0 },
        { date: '2025-04-01', value: 316.0 },
        { date: '2025-05-01', value: 317.0 },
        { date: '2025-06-01', value: 318.0 },
        { date: '2025-07-01', value: 319.0 },
        { date: '2025-08-01', value: 320.0 },
        { date: '2025-09-01', value: 321.0 },
        { date: '2025-10-01', value: 322.0 },
        { date: '2025-11-01', value: 323.0 },
        { date: '2025-12-01', value: 324.0 },
        { date: '2026-01-01', value: 325.52 },
      ],
    });

    render(<ThemeIndicatorGrid indicators={[indicator]} />);

    expect(screen.getAllByText('326 指数点').length).toBeGreaterThan(0);
    expect(screen.queryByText('325.52%')).toBeNull();
  });

  it('shows an absolute change for nonfarm payrolls instead of a percentage swing', () => {
    const indicator = createIndicator({
      slug: 'nonfarm-payrolls',
      title: '非农就业人数（NFP）',
      category: '就业',
      templateKey: 'labor',
      historyUnit: '千个岗位',
      history: [
        { date: '2025-11', value: -140 },
        { date: '2025-12', value: 187 },
      ],
    });

    render(<ThemeIndicatorGrid indicators={[indicator]} />);

    expect(screen.getByText('上期读数')).toBeInTheDocument();
    expect(screen.getByText('-14 万个岗位')).toBeInTheDocument();
    expect(screen.queryByText(/-233\.6%/)).toBeNull();
  });
});
