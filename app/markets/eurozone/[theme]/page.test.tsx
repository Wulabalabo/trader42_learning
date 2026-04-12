import { render, screen } from '@testing-library/react';

import eurozoneInflationTheme from '@/data/themes/eurozone-inflation.json';

import MarketThemePage from './page';

describe('Eurozone market theme page', () => {
  it('renders the inflation topic page', async () => {
    render(await MarketThemePage({ params: Promise.resolve({ theme: 'inflation' }) }));

    expect(screen.getByRole('heading', { name: eurozoneInflationTheme.title })).toBeInTheDocument();
    expect(screen.getByText(eurozoneInflationTheme.summary)).toBeInTheDocument();
    expect(screen.getByText(eurozoneInflationTheme.overview[0])).toBeInTheDocument();
    expect(screen.getByText('服务项价格通常已经包含在核心 HICP 里，单看时更适合判断价格黏性主要卡在哪一段。')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /欧元区 HICP/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /欧元区核心 HICP/ }).length).toBeGreaterThan(0);
  });
});
