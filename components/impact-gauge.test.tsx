import { render, screen } from '@testing-library/react';

import { ImpactGauge } from './impact-gauge';

describe('ImpactGauge', () => {
  it('renders the market impact module with larger labels', () => {
    render(<ImpactGauge label="目录总览" level="High" subtitle="扫描状态" />);

    expect(screen.getByText('市场影响').className).toContain('text-[14px]');
    expect(screen.getByText('目录总览').className).toContain('text-[16px]');
    expect(screen.getByText('扫描状态').className).toContain('text-[12px]');

    const badges = screen.getAllByText('高');
    expect(badges.some((node) => node.className.includes('text-[11px]'))).toBe(true);
  });
});
