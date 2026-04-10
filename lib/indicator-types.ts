export type ImpactLevel = 'High' | 'Medium' | 'Low';
export type IndicatorStatus = 'live' | 'placeholder';
export type IndicatorTemplateKey = 'inflation' | 'labor' | 'policy' | 'growth' | 'generic';
export type IndicatorPriority = 'P1' | 'P2' | 'P3';
export type IndicatorDataProvider = 'fred' | 'openbb' | 'aktools' | 'sample' | 'spglobal-release' | 'tradingeconomics-page';
export type MarketSlug = 'us' | 'eurozone';

export const impactLevelLabel: Record<ImpactLevel, string> = {
  High: '高',
  Medium: '中',
  Low: '低',
};

export interface IndicatorMarketImpact {
  market: string;
  level: ImpactLevel;
  reason: string;
}

export type IndicatorReadingGuideBlock =
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'bullets';
      items: string[];
    };

export interface IndicatorReadingGuideSection {
  title: string;
  blocks: IndicatorReadingGuideBlock[];
}

export interface IndicatorReadingGuide {
  summary: string[];
  sections: IndicatorReadingGuideSection[];
}

export interface IndicatorMarketReadScenario {
  title: string;
  reactions: string[];
}

export interface IndicatorHistoryPoint {
  date: string;
  value: number;
}

export interface Indicator {
  slug: string;
  title: string;
  category: string;
  status: IndicatorStatus;
  priority: IndicatorPriority;
  templateKey: IndicatorTemplateKey;
  navGroup: string;
  dataProvider: IndicatorDataProvider;
  seriesKey?: string;
  revalidateSeconds: number;
  releaseCadence: string;
  updatedAt: string;
  scopes: string[];
  summary: string;
  readingGuide?: IndicatorReadingGuide;
  historyUnit: string;
  valueDecimals?: number;
  fredSeriesId?: string;
  historySource?: 'FRED' | '样本数据';
  sourceLabel?: string;
  latestSnapshot?: {
    value: number;
    previousValue?: number;
    periodLabel: string;
    releaseLabel?: string;
    sourceLabel: string;
  };
  dataSemanticsLabel?: string;
  dataSemanticsNote?: string;
  marketReadIntro?: string;
  marketReadDescription?: string;
  marketReadScenarios?: IndicatorMarketReadScenario[];
  currentAssessment: {
    level: ImpactLevel;
    reason: string;
  };
  whyItMatters: string;
  whatItMeans: string[];
  cannotTell: string[];
  marketImpact: IndicatorMarketImpact[];
  history: IndicatorHistoryPoint[];
  historyNote: string;
}

export interface MarketThemeSection {
  title: string;
  body?: string[];
  items?: string[];
}

export interface MarketTheme {
  slug: string;
  title: string;
  market: MarketSlug;
  navLabel: string;
  summary: string;
  overview: string[];
  indicatorSlugs: string[];
  relationships: MarketThemeSection[];
  howToRead: MarketThemeSection[];
  marketImpactSummary: string[];
  indicators: Indicator[];
}
