import usMarket from '@/data/markets/us.json';
import eurozoneMarket from '@/data/markets/eurozone.json';
import chinaMarket from '@/data/markets/china.json';

import type { MarketSlug } from './indicator-types';

export type MarketContent = {
  slug: MarketSlug;
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
  eurozone: eurozoneMarket as MarketContent,
  china: chinaMarket as MarketContent,
};

export function getMarketContent(slug: MarketSlug) {
  return marketRegistry[slug];
}
