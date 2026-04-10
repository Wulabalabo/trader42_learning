import { render, screen } from '@testing-library/react';

import MarketThemePage from './page';

describe('Eurozone market theme page', () => {
  it('renders the inflation topic page', async () => {
    render(await MarketThemePage({ params: Promise.resolve({ theme: 'inflation' }) }));

    expect(screen.getByRole('heading', { name: '欧元区通胀' })).toBeInTheDocument();
    expect(screen.getByText(/欧元区通胀最难的地方，不是只看一个总 CPI/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /欧元区 HICP/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /欧元区核心 HICP/ }).length).toBeGreaterThan(0);
  });
});
