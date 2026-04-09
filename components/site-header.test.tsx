import { render, screen } from '@testing-library/react';

import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  it('keeps primary navigation but removes scope pills', () => {
    render(<SiteHeader />);

    expect(screen.getByRole('link', { name: /Trader42 指标字典 v1.0/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '首页' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '指标库' })).toBeInTheDocument();
    expect(screen.queryByText('范围：')).toBeNull();
    expect(screen.queryByText('美国')).toBeNull();
    expect(screen.queryByText('中国')).toBeNull();
    expect(screen.queryByText('欧元区')).toBeNull();
    expect(screen.queryByText('日本')).toBeNull();
    expect(screen.queryByText('Crypto')).toBeNull();
  });
});
