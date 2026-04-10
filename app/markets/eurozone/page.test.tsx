import { render, screen } from '@testing-library/react';

import eurozoneMarketContent from '@/data/markets/eurozone.json';

import EurozoneMarketPage from './page';

describe('Eurozone market page', () => {
  it('renders the Eurozone market teaching homepage', async () => {
    render(await EurozoneMarketPage());

    expect(screen.getByRole('heading', { name: eurozoneMarketContent.title })).toBeInTheDocument();
    expect(screen.getByText(eurozoneMarketContent.hero)).toBeInTheDocument();
    expect(screen.getByText(eurozoneMarketContent.themeSectionTitle)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '通胀与价格' })).toHaveAttribute('href', '/markets/eurozone/inflation');
    expect(screen.getByRole('link', { name: '欧洲央行政策' })).toHaveAttribute('href', '/markets/eurozone/policy');
    expect(screen.getByRole('link', { name: '增长与景气' })).toHaveAttribute('href', '/markets/eurozone/growth');
    expect(screen.getByRole('link', { name: '就业与内需' })).toHaveAttribute('href', '/markets/eurozone/labor');
    expect(screen.getByText('推进阅读顺序')).toBeInTheDocument();
    expect(screen.queryByText(/正在施工/)).toBeNull();
  });
});
