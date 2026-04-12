import { vi } from 'vitest';

import { buildIndicatorBySlug, getAllIndicators, getIndicatorBySlug } from './indicators';

describe('indicator data', () => {
  it('exposes the seed indicator list', async () => {
    const indicators = await getAllIndicators();

    expect(indicators.map((indicator) => indicator.slug)).toEqual([
      'cpi',
      'pce',
      'nonfarm-payrolls',
      'fomc-rate-decision',
      'unemployment-rate',
      'retail-sales',
      'core-pce',
      'china-official-manufacturing-pmi',
      'china-total-social-financing',
      'china-1y-lpr',
      'china-imports',
      'core-cpi',
      'ppi',
      'initial-jobless-claims',
      'jolts-job-openings',
      'continuing-jobless-claims',
      'ism-services-pmi',
      'ism-pmi',
      'consumer-confidence',
      'eurozone-hicp',
      'eurozone-core-hicp',
      'ecb-deposit-rate',
      'eurozone-composite-pmi',
      'eurozone-unemployment-rate',
    ]);
  });

  it('returns a fully described indicator', async () => {
    const indicator = await getIndicatorBySlug('cpi');

    expect(indicator).toBeDefined();
    expect(indicator?.title).toBe('消费者价格指数（CPI）');
    expect(indicator?.readingGuide?.summary[0]).toBe('它其实就是美国政府在观察：普通人日常买东西，花的钱有没有变贵。');
    expect(indicator?.marketReadIntro).toBeTruthy();
    expect(indicator?.marketReadDescription).toBeTruthy();
    expect(indicator?.marketImpact.length).toBeGreaterThan(0);
    expect(indicator?.history.length).toBeGreaterThan(0);
    expect(indicator?.cannotTell.length).toBeGreaterThan(0);
  });

  it('keeps PCE wording aligned with CPI style', async () => {
    const indicator = await getIndicatorBySlug('pce');

    expect(indicator?.summary).toBe('衡量美国人日常消费品和服务价格变化的关键通胀指标，交易上通常先看同比、环比和预期差。');
    expect(indicator?.readingGuide?.summary[0]).toBe('它其实就是美国政府在观察：普通人花在消费上的钱整体有没有变贵。');
    expect(indicator?.whatItMeans[0]).toContain('当前样本里的最新值代表当前 PCE 的指数点位');
    expect(indicator?.currentAssessment.level).toBe('High');
    expect(indicator?.historyNote).toContain('当前展示的是 PCE 原始指数点位路径');
  });

  it('keeps CPI wording aligned with raw index-point semantics', async () => {
    const indicator = await getIndicatorBySlug('cpi');

    expect(indicator?.whatItMeans[0]).toContain('最新公布的数值代表当前 CPI 的指数点位');
    expect(indicator?.historyNote).toContain('当前展示的是 CPI 原始指数点位路径');
  });

  it('normalizes metadata used by navigation and templates', async () => {
    const indicator = await getIndicatorBySlug('cpi');

    expect(indicator).toBeDefined();
    expect(indicator?.status).toBe('live');
    expect(indicator?.dataProvider).toBe('fred');
    expect(indicator?.seriesKey).toBe('CPIAUCNS');
    expect(indicator?.priority).toBe('P1');
    expect(indicator?.releaseCadence).toBeTruthy();
    expect(indicator?.updatedAt).toBeTruthy();
    expect(indicator?.revalidateSeconds).toBe(86400);
    expect(indicator?.templateKey).toBe('inflation');
    expect(indicator?.navGroup).toBe('通胀指标');
    expect(indicator?.currentAssessment.reason).toBeTruthy();
    expect(indicator?.marketReadIntro).toContain('市场怎么读');
    expect(indicator?.marketReadScenarios).toHaveLength(2);
  });

  it('loads the last upgraded labor indicator with full live content', async () => {
    const indicator = await getIndicatorBySlug('continuing-jobless-claims');

    expect(indicator).toBeDefined();
    expect(indicator?.status).toBe('live');
    expect(indicator?.templateKey).toBe('labor');
    expect(indicator?.navGroup).toBe('就业市场');
    expect(indicator?.currentAssessment.reason).toContain('回到岗位');
    expect(indicator?.whatItMeans.length).toBeGreaterThan(0);
    expect(indicator?.cannotTell.length).toBeGreaterThan(0);
    expect(indicator?.marketImpact.length).toBeGreaterThan(0);
    expect(indicator?.history.length).toBeGreaterThan(0);
  });

  it('adds a broader placeholder coverage set for core US macro indicators', async () => {
    const indicators = await getAllIndicators();

    const placeholderSlugs = indicators.filter((indicator) => indicator.status === 'placeholder').map((indicator) => indicator.slug);

    expect(placeholderSlugs).toEqual([]);
  });

  it('orders indicators by research priority before title', async () => {
    const indicators = await getAllIndicators();

    expect(indicators.slice(0, 5).map((indicator) => indicator.slug)).toEqual([
      'cpi',
      'pce',
      'nonfarm-payrolls',
      'fomc-rate-decision',
      'unemployment-rate',
    ]);
  });

  it('maps second-wave FRED-compatible indicators to provider metadata', async () => {
    const unemploymentRate = await getIndicatorBySlug('unemployment-rate');
    const initialClaims = await getIndicatorBySlug('initial-jobless-claims');
    const continuingClaims = await getIndicatorBySlug('continuing-jobless-claims');
    const jolts = await getIndicatorBySlug('jolts-job-openings');
    const coreCpi = await getIndicatorBySlug('core-cpi');
    const corePce = await getIndicatorBySlug('core-pce');
    const ppi = await getIndicatorBySlug('ppi');
    const retailSales = await getIndicatorBySlug('retail-sales');
    const ismServices = await getIndicatorBySlug('ism-services-pmi');
    const consumerConfidence = await getIndicatorBySlug('consumer-confidence');

    expect(unemploymentRate?.dataProvider).toBe('fred');
    expect(unemploymentRate?.seriesKey).toBe('UNRATE');
    expect(initialClaims?.seriesKey).toBe('ICSA');
    expect(continuingClaims?.seriesKey).toBe('CCSA');
    expect(jolts?.seriesKey).toBe('JTSJOL');
    expect(coreCpi?.seriesKey).toBe('CPILFESL');
    expect(corePce?.seriesKey).toBe('PCEPILFE');
    expect(ppi?.seriesKey).toBe('PPIACO');
    expect(retailSales?.seriesKey).toBe('RSAFS');
    expect(ismServices?.dataProvider).toBe('spglobal-release');
    expect(ismServices?.seriesKey).toBe('us-services-pmi');
    expect(consumerConfidence?.dataProvider).toBe('fred');
    expect(consumerConfidence?.seriesKey).toBe('UMCSENT');
  });

  it('normalizes JOLTS history when building a live indicator', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        observations: [
          { date: '2025-11-01', value: '8460.0' },
          { date: '2025-12-01', value: '8400.0' },
          { date: '2026-01-01', value: '7300.0' },
        ],
      }),
    });

    const indicator = await buildIndicatorBySlug('jolts-job-openings', { apiKey: 'demo-key', fetchImpl: fetchImpl as typeof fetch });

    expect(indicator?.historySource).toBe('FRED');
    expect(indicator?.history.at(-1)).toEqual({ date: '2026-01-01', value: 7.3 });
  });

  it('keeps labor indicator notes aligned with the display units shown on the page', async () => {
    const nonfarm = await getIndicatorBySlug('nonfarm-payrolls');
    const initialClaims = await getIndicatorBySlug('initial-jobless-claims');
    const continuingClaims = await getIndicatorBySlug('continuing-jobless-claims');
    const jolts = await getIndicatorBySlug('jolts-job-openings');

    expect(nonfarm?.historyNote).toContain('万个岗位');
    expect(nonfarm?.historyNote).not.toContain('千个岗位');
    expect(initialClaims?.historyNote).toContain('万人');
    expect(continuingClaims?.historyNote).toContain('万人');
    expect(jolts?.historyNote).toContain('万个岗位');
  });

  it('keeps all indicator detail content aligned with the CPI-style reading structure', async () => {
    const indicators = await getAllIndicators();
    // Only check US and China indicators — eurozone indicator content is a separate backlog item
    const usAndChina = indicators.filter((i) => i.scopes.some((s) => s === '美国' || s === '中国'));

    for (const indicator of usAndChina) {
      expect(indicator.readingGuide?.summary).toHaveLength(1);
      expect(indicator.readingGuide?.sections.length).toBeGreaterThanOrEqual(3);
      expect(indicator.whatItMeans.length).toBeGreaterThanOrEqual(3);
      expect(indicator.cannotTell.length).toBeGreaterThanOrEqual(2);
      expect(indicator.marketReadIntro).toBeTruthy();
      expect(indicator.marketReadDescription).toBeTruthy();
      expect(indicator.marketReadScenarios?.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('loads four china indicators with correct scopes and theme slugs', async () => {
    const indicators = await getAllIndicators();
    const china = indicators.filter((i) => i.scopes.includes('中国'));

    expect(china.map((i) => i.slug)).toEqual([
      'china-official-manufacturing-pmi',
      'china-total-social-financing',
      'china-1y-lpr',
      'china-imports',
    ]);

    const pmi = china.find((i) => i.slug === 'china-official-manufacturing-pmi');
    const tsf = china.find((i) => i.slug === 'china-total-social-financing');
    const lpr = china.find((i) => i.slug === 'china-1y-lpr');
    const imports = china.find((i) => i.slug === 'china-imports');

    expect(pmi?.themeSlug).toBe('demand');
    expect(tsf?.themeSlug).toBe('credit');
    expect(lpr?.themeSlug).toBe('policy');
    expect(imports?.themeSlug).toBe('commodities');

    expect(pmi?.templateKey).toBe('growth');
    expect(lpr?.templateKey).toBe('policy');

    expect(china.every((i) => i.priority === 'P1')).toBe(true);
    expect(china.every((i) => i.status === 'live')).toBe(true);
  });
});
