import { render, screen } from '@testing-library/react';
import homepage from '@/data/homepage.json';

import HomePage from './page';

describe('Home page', () => {
  it('shows the system overview home page', () => {
    render(<HomePage />);

    expect(screen.getByRole('link', { name: '首页' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: homepage.hero.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: homepage.hero.socialHandle })).toHaveAttribute('href', homepage.hero.socialHref);
    expect(screen.getByText(homepage.overview.title)).toBeInTheDocument();
    expect(screen.getByText(homepage.usage.title)).toBeInTheDocument();
    expect(screen.getByText(homepage.marketMap.title)).toBeInTheDocument();
    expect(screen.getByText(homepage.overview.items[0])).toBeInTheDocument();
    expect(screen.getAllByText(homepage.marketMap.items[0].title).length).toBeGreaterThan(0);
    expect(screen.getByText(homepage.marketMap.items[0].body)).toBeInTheDocument();
    expect(screen.getAllByText(homepage.marketMap.items[2].title).length).toBeGreaterThan(0);
    expect(screen.getByText(homepage.marketMap.items[2].body)).toBeInTheDocument();
    expect(screen.getByText(homepage.usage.items[0])).toBeInTheDocument();

    expect(screen.getByText(homepage.marketMap.items[0].body).closest('a')).toHaveAttribute('href', '/markets/us');
    expect(screen.getByText(homepage.marketMap.items[1].body).closest('a')).toHaveAttribute('href', '/markets/china');
    expect(screen.getByText(homepage.marketMap.items[2].body).closest('a')).toHaveAttribute('href', '/markets/eurozone');
    expect(screen.getByText(homepage.marketMap.items[3].body).closest('a')).toHaveAttribute('href', '/markets/japan');
    expect(screen.getByText(homepage.marketMap.items[4].body).closest('a')).toHaveAttribute('href', '/markets/crypto');
  });
});
