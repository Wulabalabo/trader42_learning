import usMarket from '@/data/markets/us.json';

export type MarketContent = {
  slug: 'us';
  title: string;
  eyebrow: string;
  tag: string;
  hero: string;
  teachingStepsTitle: string;
  teachingSteps: string[];
  themeSectionTitle: string;
  themeSectionDescription: string;
  bigPicture: {
    title: string;
    description: string;
    items: string[];
  };
};

const marketRegistry: Record<string, MarketContent> = {
  us: usMarket as MarketContent,
};

export function getMarketContent(slug: string) {
  return marketRegistry[slug];
}
