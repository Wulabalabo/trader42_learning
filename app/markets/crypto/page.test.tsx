import { render, screen } from '@testing-library/react';

import CryptoMarketPage from './page';

describe('Crypto market placeholder page', () => {
  it('shows the under construction placeholder', async () => {
    render(await CryptoMarketPage());

    expect(screen.getByRole('heading', { name: 'Crypto 市场' })).toBeInTheDocument();
    expect(screen.queryByText('Crypto / Market')).toBeNull();
    expect(screen.getByText(/正在施工/)).toBeInTheDocument();
    expect(screen.getByText(/Crypto 更像独立资产生态，会更关注美元流动性、风险偏好、ETF、链上周期和监管/)).toBeInTheDocument();
  });
});
