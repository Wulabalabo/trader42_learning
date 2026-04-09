import { render, screen, within } from '@testing-library/react';

import usMarketContent from '@/data/markets/us.json';

import USMarketPage from './page';

describe('US market page', () => {
  it('renders the US market teaching homepage', async () => {
    render(await USMarketPage());

    expect(screen.getByRole('heading', { name: usMarketContent.title })).toBeInTheDocument();
    expect(screen.getByText(usMarketContent.hero)).toBeInTheDocument();
    expect(screen.getByText(usMarketContent.themeSectionTitle)).toBeInTheDocument();
    expect(screen.getByText(usMarketContent.themeSectionDescription)).toBeInTheDocument();
    expect(screen.queryByText(usMarketContent.tag)).toBeNull();
    expect(screen.getByRole('link', { name: '通胀指标' })).toHaveAttribute('href', '/markets/us/inflation');
    expect(screen.getByRole('link', { name: '就业市场' })).toHaveAttribute('href', '/markets/us/labor');
    expect(screen.getByRole('link', { name: '央行政策' })).toHaveAttribute('href', '/markets/us/policy');
    expect(screen.getByRole('link', { name: '增长与景气' })).toHaveAttribute('href', '/markets/us/growth');
    expect(screen.getByText('推进阅读顺序')).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText(usMarketContent.teachingSteps[0])).toBeInTheDocument();
    expect(screen.getByText(usMarketContent.bigPicture.title)).toBeInTheDocument();
    expect(screen.getByText(usMarketContent.bigPicture.description)).toBeInTheDocument();
    expect(screen.getByText(usMarketContent.bigPicture.items[0])).toBeInTheDocument();
    expect(screen.queryAllByText(/^先解决：/)).toHaveLength(0);

    const rightRail = screen.getByText('推进阅读顺序').closest('aside');
    const themeSection = screen.getByText(usMarketContent.themeSectionTitle).closest('div');
    const bigPictureSection = screen.getByText(usMarketContent.bigPicture.title).closest('div');

    expect(rightRail).not.toBeNull();
    expect(themeSection).not.toBeNull();
    expect(bigPictureSection).not.toBeNull();

    const rightRailElement = rightRail as HTMLElement;
    const themeSectionElement = themeSection as HTMLElement;
    const bigPictureSectionElement = bigPictureSection as HTMLElement;

    expect(within(rightRailElement).queryByText(usMarketContent.bigPicture.title)).toBeNull();
    expect(themeSectionElement.compareDocumentPosition(bigPictureSectionElement) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });
});
