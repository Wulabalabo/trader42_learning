import { cache } from 'react';

import coreCpi from '@/data/indicators/core-cpi.json';
import corePce from '@/data/indicators/core-pce.json';
import cpi from '@/data/indicators/cpi.json';
import consumerConfidence from '@/data/indicators/consumer-confidence.json';
import continuingJoblessClaims from '@/data/indicators/continuing-jobless-claims.json';
import ecbDepositRate from '@/data/indicators/ecb-deposit-rate.json';
import eurozoneCompositePmi from '@/data/indicators/eurozone-composite-pmi.json';
import eurozoneCoreHicp from '@/data/indicators/eurozone-core-hicp.json';
import eurozoneHicp from '@/data/indicators/eurozone-hicp.json';
import eurozoneUnemploymentRate from '@/data/indicators/eurozone-unemployment-rate.json';
import fomc from '@/data/indicators/fomc-rate-decision.json';
import initialJoblessClaims from '@/data/indicators/initial-jobless-claims.json';
import ismPmi from '@/data/indicators/ism-pmi.json';
import ismServicesPmi from '@/data/indicators/ism-services-pmi.json';
import joltsJobOpenings from '@/data/indicators/jolts-job-openings.json';
import nonfarmPayrolls from '@/data/indicators/nonfarm-payrolls.json';
import pce from '@/data/indicators/pce.json';
import ppi from '@/data/indicators/ppi.json';
import retailSales from '@/data/indicators/retail-sales.json';
import unemploymentRate from '@/data/indicators/unemployment-rate.json';

import { getProviderAdapter } from './data-providers/provider-registry';
import type {
  IndicatorDataProvider,
  Indicator,
  IndicatorHistoryPoint,
  IndicatorMarketImpact,
  IndicatorPriority,
  IndicatorStatus,
  IndicatorTemplateKey,
  ImpactLevel,
} from './indicator-types';

type IndicatorSeed = Partial<Indicator> & Pick<Indicator, 'slug' | 'title' | 'category' | 'summary' | 'historyUnit'>;

const rawSeedIndicators: IndicatorSeed[] = [
  cpi as IndicatorSeed,
  pce as IndicatorSeed,
  nonfarmPayrolls as IndicatorSeed,
  fomc as IndicatorSeed,
  ismPmi as IndicatorSeed,
  coreCpi as IndicatorSeed,
  ppi as IndicatorSeed,
  unemploymentRate as IndicatorSeed,
  initialJoblessClaims as IndicatorSeed,
  retailSales as IndicatorSeed,
  corePce as IndicatorSeed,
  joltsJobOpenings as IndicatorSeed,
  continuingJoblessClaims as IndicatorSeed,
  ismServicesPmi as IndicatorSeed,
  consumerConfidence as IndicatorSeed,
  eurozoneHicp as IndicatorSeed,
  eurozoneCoreHicp as IndicatorSeed,
  ecbDepositRate as IndicatorSeed,
  eurozoneCompositePmi as IndicatorSeed,
  eurozoneUnemploymentRate as IndicatorSeed,
];

const defaultTemplateByCategory: Record<string, IndicatorTemplateKey> = {
  '通胀': 'inflation',
  '就业': 'labor',
  '政策': 'policy',
  '增长': 'growth',
};

const defaultNavGroupByCategory: Record<string, string> = {
  '通胀': '通胀指标',
  '就业': '就业市场',
  '政策': '央行政策',
  '增长': '增长与景气',
};

const defaultSourceBySlug: Record<string, string> = {
  cpi: '美国劳工统计局',
  pce: '美国经济分析局',
  'nonfarm-payrolls': '美国劳工统计局',
  'fomc-rate-decision': '美联储',
  'ism-pmi': '供应管理协会',
  'core-cpi': '美国劳工统计局',
  ppi: '美国劳工统计局',
  'unemployment-rate': '美国劳工统计局',
  'initial-jobless-claims': '美国劳工部',
  'retail-sales': '美国人口普查局',
  'core-pce': '美国经济分析局',
  'jolts-job-openings': '美国劳工统计局',
  'continuing-jobless-claims': '美国劳工部',
  'ism-services-pmi': '供应管理协会',
  'consumer-confidence': '世界大型企业联合会',
};

const defaultProviderBySlug: Record<string, IndicatorDataProvider> = {
  cpi: 'fred',
  pce: 'fred',
  'nonfarm-payrolls': 'fred',
  'fomc-rate-decision': 'fred',
  'ism-pmi': 'fred',
  'core-cpi': 'fred',
  ppi: 'fred',
  'unemployment-rate': 'fred',
  'initial-jobless-claims': 'fred',
  'retail-sales': 'fred',
  'core-pce': 'fred',
  'jolts-job-openings': 'fred',
  'continuing-jobless-claims': 'fred',
  'ism-services-pmi': 'fred',
  'consumer-confidence': 'fred',
};

const defaultSeriesKeyBySlug: Record<string, string> = {
  cpi: 'CPIAUCNS',
  pce: 'PCEPI',
  'nonfarm-payrolls': 'PAYEMS',
  'fomc-rate-decision': 'DFEDTARU',
  'ism-pmi': 'NAPM',
  'core-cpi': 'CPILFESL',
  ppi: 'PPIACO',
  'unemployment-rate': 'UNRATE',
  'initial-jobless-claims': 'ICSA',
  'retail-sales': 'RSAFS',
  'core-pce': 'PCEPILFE',
  'jolts-job-openings': 'JTSJOL',
  'continuing-jobless-claims': 'CCSA',
  'ism-services-pmi': 'NAPMS',
  'consumer-confidence': 'UMCSENT',
};

const defaultRevalidateSecondsBySlug: Record<string, number> = {
  cpi: 86400,
  pce: 86400,
  'nonfarm-payrolls': 86400,
  'fomc-rate-decision': 86400,
  'ism-pmi': 43200,
  'core-cpi': 86400,
  ppi: 86400,
  'unemployment-rate': 86400,
  'initial-jobless-claims': 21600,
  'retail-sales': 86400,
  'core-pce': 86400,
  'jolts-job-openings': 86400,
  'continuing-jobless-claims': 21600,
  'ism-services-pmi': 43200,
  'consumer-confidence': 86400,
};

const defaultAssessmentByStatus: Record<IndicatorStatus, string> = {
  live: '这是当前站内已经整理完成的学习页，可以直接用来建立初步交易语言。',
  placeholder: '该指标已进入目录，但内容仍在补充，当前先保留学习位置与后续扩展入口。',
};

const defaultPriorityBySlug: Record<string, IndicatorPriority> = {
  cpi: 'P1',
  pce: 'P1',
  'nonfarm-payrolls': 'P1',
  'fomc-rate-decision': 'P1',
  'core-pce': 'P1',
  'unemployment-rate': 'P1',
  'retail-sales': 'P1',
  'ism-services-pmi': 'P2',
  'core-cpi': 'P2',
  ppi: 'P2',
  'jolts-job-openings': 'P2',
  'initial-jobless-claims': 'P2',
  'continuing-jobless-claims': 'P2',
  'consumer-confidence': 'P3',
  'ism-pmi': 'P3',
};

const defaultReleaseCadenceBySlug: Record<string, string> = {
  cpi: '每月中旬',
  pce: '每月月底',
  'nonfarm-payrolls': '每月首周五',
  'fomc-rate-decision': '每年 8 次',
  'ism-pmi': '每月初',
  'core-cpi': '每月中旬',
  ppi: '每月中旬',
  'unemployment-rate': '每月首周五',
  'initial-jobless-claims': '每周四',
  'retail-sales': '每月中旬',
  'core-pce': '每月月底',
  'jolts-job-openings': '每月初',
  'continuing-jobless-claims': '每周四',
  'ism-services-pmi': '每月初',
  'consumer-confidence': '每月月底',
};

const defaultUpdatedAtBySlug: Record<string, string> = {
  cpi: '2026-04-07',
  pce: '2026-04-07',
  'nonfarm-payrolls': '2026-04-07',
  'fomc-rate-decision': '2026-04-07',
  'ism-pmi': '2026-04-07',
  'core-cpi': '2026-04-07',
  ppi: '2026-04-07',
  'unemployment-rate': '2026-04-07',
  'initial-jobless-claims': '2026-04-07',
  'retail-sales': '2026-04-07',
  'core-pce': '2026-04-07',
  'jolts-job-openings': '2026-04-07',
  'continuing-jobless-claims': '2026-04-07',
  'ism-services-pmi': '2026-04-07',
  'consumer-confidence': '2026-04-07',
};

const prioritySortOrder: Record<IndicatorPriority, number> = {
  P1: 1,
  P2: 2,
  P3: 3,
};

function getDefaultWhatItMeans(indicator: IndicatorSeed) {
  if (indicator.status === 'placeholder') {
    return ['先识别它衡量的对象与频率。', '再确认市场最先交易的是水平、变动，还是预期差。'];
  }

  return ['先看最新值，再看变化方向。'];
}

function getDefaultCannotTell(indicator: IndicatorSeed) {
  if (indicator.status === 'placeholder') {
    return ['它不能单独替代完整的宏观判断。', '后续仍需要补充预期差、修正值和交叉验证。'];
  }

  return ['它不能单独代表完整交易结论。'];
}

function getDefaultMarketImpact(indicator: IndicatorSeed): IndicatorMarketImpact[] {
  return [
    { market: '美元', level: 'Medium', reason: `${indicator.title} 通常会先通过增长或利率预期影响美元。` },
    { market: '美债', level: 'Medium', reason: '债券通常最先反映宏观路径变化。' },
    { market: '股票', level: 'Medium', reason: '股票会结合增长、流动性和估值一起定价。' },
    { market: '黄金', level: 'Low', reason: '黄金通常更多跟随实际利率和避险需求。' },
  ];
}

function getDefaultHistory(): IndicatorHistoryPoint[] {
  return [{ date: '2025-01', value: 0 }];
}

function normalizeSeedIndicator(indicator: IndicatorSeed): Indicator {
  const status = indicator.status ?? 'live';
  const templateKey = indicator.templateKey ?? defaultTemplateByCategory[indicator.category] ?? 'generic';
  const dataProvider = indicator.dataProvider ?? (indicator.fredSeriesId ? 'fred' : defaultProviderBySlug[indicator.slug] ?? 'sample');

  return {
    ...indicator,
    status,
    priority: indicator.priority ?? defaultPriorityBySlug[indicator.slug] ?? 'P3',
    templateKey,
    navGroup: indicator.navGroup ?? defaultNavGroupByCategory[indicator.category] ?? '其他指标',
    dataProvider,
    seriesKey: indicator.seriesKey ?? (dataProvider === 'fred' ? indicator.fredSeriesId ?? defaultSeriesKeyBySlug[indicator.slug] : undefined),
    revalidateSeconds: indicator.revalidateSeconds ?? defaultRevalidateSecondsBySlug[indicator.slug] ?? 86400,
    releaseCadence: indicator.releaseCadence ?? defaultReleaseCadenceBySlug[indicator.slug] ?? '待补充',
    updatedAt: indicator.updatedAt ?? defaultUpdatedAtBySlug[indicator.slug] ?? '2026-04-07',
    scopes: indicator.scopes ?? ['美国'],
    readingGuide: indicator.readingGuide,
    sourceLabel: indicator.sourceLabel ?? defaultSourceBySlug[indicator.slug] ?? '编辑学习备注',
    valueDecimals: indicator.valueDecimals,
    dataSemanticsLabel: indicator.dataSemanticsLabel,
    dataSemanticsNote: indicator.dataSemanticsNote,
    marketReadIntro: indicator.marketReadIntro,
    marketReadDescription: indicator.marketReadDescription,
    marketReadScenarios: indicator.marketReadScenarios,
    currentAssessment: {
      level: indicator.currentAssessment?.level ?? 'Medium',
      reason: indicator.currentAssessment?.reason ?? defaultAssessmentByStatus[status],
    },
    whyItMatters: indicator.whyItMatters ?? `${indicator.title} 会影响市场对宏观路径的理解，是值得保留的学习位。`,
    whatItMeans: indicator.whatItMeans?.length ? indicator.whatItMeans : getDefaultWhatItMeans(indicator),
    cannotTell: indicator.cannotTell?.length ? indicator.cannotTell : getDefaultCannotTell(indicator),
    marketImpact: indicator.marketImpact?.length ? indicator.marketImpact : getDefaultMarketImpact(indicator),
    history: indicator.history?.length ? indicator.history : getDefaultHistory(),
    historyNote: indicator.historyNote ?? '当前先保留占位历史序列，后续会补入正式解释和数据来源。',
  };
}

const seedIndicators = rawSeedIndicators.map(normalizeSeedIndicator);
const seedOrderBySlug = new Map(seedIndicators.map((indicator, index) => [indicator.slug, index]));

export function getSeedIndicators(): Indicator[] {
  return seedIndicators;
}

export function getSeedIndicatorBySlug(slug: string): Indicator | undefined {
  return seedIndicators.find((indicator) => indicator.slug === slug);
}

function getIndicatorSeedMap(indicators: Indicator[]) {
  return new Map(indicators.map((indicator) => [indicator.slug, indicator]));
}

function transformMonthlyChange(history: Indicator['history']) {
  return history
    .slice(1)
    .map((point, index) => ({
      date: point.date,
      value: Number((point.value - history[index].value).toFixed(1)),
    }));
}

function normalizeHistory(indicator: Indicator, history: Indicator['history']) {
  if (indicator.slug === 'nonfarm-payrolls') {
    return transformMonthlyChange(history);
  }

  if (indicator.slug === 'jolts-job-openings') {
    return history.map((point) => ({
      date: point.date,
      value: Number((point.value / 1000).toFixed(1)),
    }));
  }

  if (indicator.slug === 'initial-jobless-claims' || indicator.slug === 'continuing-jobless-claims') {
    return history.map((point) => ({
      date: point.date,
      value: Number((point.value / 1000).toFixed(0)),
    }));
  }

  return history;
}

export async function buildIndicators({
  apiKey = process.env.FRED_API_KEY,
  fetchImpl = fetch,
}: {
  apiKey?: string;
  fetchImpl?: typeof fetch;
} = {}): Promise<Indicator[]> {
  return Promise.all(
    seedIndicators.map(async (indicator) => {
      if (indicator.dataProvider !== 'fred' || !indicator.seriesKey || !apiKey) {
        return {
          ...indicator,
          historySource: '样本数据',
        };
      }

      const provider = getProviderAdapter(indicator.dataProvider);

      if (!provider) {
        return {
          ...indicator,
          historySource: '样本数据',
        };
      }

      const history = await provider.getHistory({ seriesKey: indicator.seriesKey, apiKey, fetchImpl });

      if (!history?.length) {
        return {
          ...indicator,
          historySource: '样本数据',
        };
      }

      return {
        ...indicator,
        history: normalizeHistory(indicator, history),
        historySource: 'FRED',
      };
    }),
  );
}

export async function buildIndicatorBySlug(
  slug: string,
  {
    apiKey = process.env.FRED_API_KEY,
    fetchImpl = fetch,
  }: {
    apiKey?: string;
    fetchImpl?: typeof fetch;
  } = {},
): Promise<Indicator | undefined> {
  const indicator = getSeedIndicatorBySlug(slug);

  if (!indicator) {
    return undefined;
  }

  const provider = getProviderAdapter(indicator.dataProvider);

  if (!provider || !indicator.seriesKey || !apiKey) {
    return {
      ...indicator,
      historySource: '样本数据',
    };
  }

  const history = await provider.getHistory({ seriesKey: indicator.seriesKey, apiKey, fetchImpl });

  if (!history?.length) {
    return {
      ...indicator,
      historySource: '样本数据',
    };
  }

  return {
    ...indicator,
    history: normalizeHistory(indicator, history),
    historySource: 'FRED',
  };
}

const loadIndicators = cache(async () => buildIndicators());

export async function getAllIndicators(): Promise<Indicator[]> {
  return [...(await loadIndicators())].sort((left, right) => {
    const priorityDifference = prioritySortOrder[left.priority] - prioritySortOrder[right.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return (seedOrderBySlug.get(left.slug) ?? 0) - (seedOrderBySlug.get(right.slug) ?? 0);
  });
}

export async function getFeaturedIndicators(): Promise<Indicator[]> {
  return (await loadIndicators()).filter((indicator) => indicator.status === 'live').slice(0, 4);
}

export async function getIndicatorBySlug(slug: string): Promise<Indicator | undefined> {
  return buildIndicatorBySlug(slug);
}
