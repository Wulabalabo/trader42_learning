import { render, screen } from '@testing-library/react';

import EurozoneMarketPage from './page';

describe('Eurozone market placeholder page', () => {
  it('shows the under construction placeholder', async () => {
    render(await EurozoneMarketPage());

    expect(screen.getByRole('heading', { name: '欧元区市场' })).toBeInTheDocument();
    expect(screen.queryByText('Eurozone / Macro')).toBeNull();
    expect(screen.getByText(/正在施工/)).toBeInTheDocument();
    expect(screen.getByText(/欧元区市场会更关注 ECB、通胀、增长分化、德国制造业与欧元汇率/)).toBeInTheDocument();
  });
});
