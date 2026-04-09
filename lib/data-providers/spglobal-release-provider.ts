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

function normalizeReleaseLabel(monthName: string, day: string, year: string) {
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

  return `${year}-${monthMap[monthName]}-${day.padStart(2, '0')}`;
}

export const spGlobalReleaseProvider: IndicatorDataProviderAdapter = {
  key: 'spglobal-release',
  async getHistory() {
    return undefined;
  },
  async getSnapshot({ fetchImpl = fetch }) {
    const teResponse = await fetchImpl('https://tradingeconomics.com/united-states/services-pmi');

    if (!teResponse.ok) {
      return undefined;
    }

    const teText = await teResponse.text();
    const summaryMatch = teText.match(
      /Services PMI in the United States (?:decreased|increased) to ([\d.]+) points in ([A-Za-z]+) from ([\d.]+) points in ([A-Za-z]+) of (\d{4})/i,
    );

    if (!summaryMatch) {
      return undefined;
    }

    const [, latestValue, latestMonth, previousValue, , year] = summaryMatch;

    let releaseLabel: string | undefined;
    const releasesResponse = await fetchImpl('https://www.pmi.spglobal.com/Public/Release/PressReleases?language=en');

    if (releasesResponse.ok) {
      const releasesText = await releasesResponse.text();
      const releaseMatch = releasesText.match(/([A-Za-z]+)\s+(\d{2})\s+(\d{4})\s+\d{2}:\d{2}\s+UTC\s+S&P Global US Services PMI/i);

      if (releaseMatch) {
        releaseLabel = normalizeReleaseLabel(releaseMatch[1], releaseMatch[2], releaseMatch[3]);
      }
    }

    return {
      value: Number(latestValue),
      previousValue: Number(previousValue),
      periodLabel: normalizePeriodLabel(latestMonth, year),
      releaseLabel,
      sourceLabel: 'S&P Global 官方发布（最新值）',
    };
  },
};
