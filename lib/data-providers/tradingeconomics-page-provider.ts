import type { IndicatorDataProviderAdapter } from './types';

function normalizePeriodLabel(monthName: string, year: string) {
  const monthMap: Record<string, string> = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  };

  return `${year}-${monthMap[monthName]}`;
}

export const tradingEconomicsPageProvider: IndicatorDataProviderAdapter = {
  key: 'tradingeconomics-page',
  async getHistory() {
    return undefined;
  },
  async getSnapshot({ seriesKey, fetchImpl = fetch }) {
    const response = await fetchImpl(`https://tradingeconomics.com/${seriesKey.replace(/^\//, '')}`);

    if (!response.ok) {
      return undefined;
    }

    const text = await response.text();
    const pointsMatch = text.match(
      /(?:increased\s+to|decreased\s+to|was unchanged at|remained at)\s+(-?[\d.]+)\s+points\s+in\s+([A-Za-z]+)\s+from\s+(-?[\d.]+)\s+points\s+in\s+([A-Za-z]+)\s+of\s+(\d{4})/i,
    );

    if (pointsMatch) {
      const [, latestValue, latestMonth, previousValue, , year] = pointsMatch;

      return {
        value: Number(latestValue),
        previousValue: Number(previousValue),
        periodLabel: normalizePeriodLabel(latestMonth, year),
        sourceLabel: 'TradingEconomics 公共页（最新值）',
      };
    }

    const percentFromMatch = text.match(
      /(?:increased\s+to|decreased\s+to|was unchanged at|remained at)\s+(-?[\d.]+)\s+percent\s+in\s+([A-Za-z]+)\s+from\s+(-?[\d.]+)\s+percent\s+in\s+([A-Za-z]+)\s+of\s+(\d{4})/i,
    );

    if (percentFromMatch) {
      const [, latestValue, latestMonth, previousValue, , year] = percentFromMatch;

      return {
        value: Number(latestValue),
        previousValue: Number(previousValue),
        periodLabel: normalizePeriodLabel(latestMonth, year),
        sourceLabel: 'TradingEconomics 公共页（最新值）',
      };
    }

    const percentSentenceMatch = text.match(
      /(?:increased|decreased)\s+(-?[\d.]+)\s+percent\s+in\s+([A-Za-z]+)\s+of\s+(\d{4}).*?\b(?:was|from)\s+(-?[\d.]+)\s+percent\s+in\s+([A-Za-z]+)\s+of\s+\3/i,
    );

    if (!percentSentenceMatch) {
      return undefined;
    }

    const [, latestValue, latestMonth, year, previousValue] = percentSentenceMatch;

    return {
      value: Number(latestValue),
      previousValue: Number(previousValue),
      periodLabel: normalizePeriodLabel(latestMonth, year),
      sourceLabel: 'TradingEconomics 公共页（最新值）',
    };
  },
};
