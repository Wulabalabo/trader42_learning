import { render, screen } from '@testing-library/react';

import { MarketImpactGrid } from './market-impact-grid';

describe('MarketImpactGrid', () => {
  it('shows market impact levels and a legend', () => {
    render(
        <MarketImpactGrid
        impacts={[
          { market: '美元', level: 'High', reason: '利率预期会迅速变化。' },
          { market: '黄金', level: 'Medium', reason: '通常通过实际收益率来交易。' },
        ]}
      />,
    );

    expect(screen.getByText('市场影响').className).toContain('text-[14px]');
    expect(screen.getByText('美元')).toBeInTheDocument();
    expect(screen.getByText('美元').className).toContain('text-[16px]');
    expect(screen.getByText('利率预期会迅速变化。').className).toContain('text-[15px]');

    expect(screen.getByText('直接驱动市场').className).toContain('text-[12px]');
    expect(screen.getByText('情境影响').className).toContain('text-[12px]');
    expect(screen.getByText('次要影响').className).toContain('text-[12px]');

    const highLabels = screen.getAllByText('高');
    expect(highLabels.some((node) => node.className.includes('text-[12px]'))).toBe(true);
  });
});
