import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ThemeIndicatorGrid } from '@/components/theme-indicator-grid';
import { ThemeInterpretationSection } from '@/components/theme-interpretation-section';
import { ThemeOverviewCard } from '@/components/theme-overview-card';
import { ThemeRelationshipSection } from '@/components/theme-relationship-section';
import { Card, CardBody } from '@/components/ui/card';
import { TerminalDirectory } from '@/components/terminal-directory';
import { TerminalWorkspace } from '@/components/terminal-workspace';
import { getCachedIndicatorDataBySlugSafe } from '@/lib/indicator-data';
import { getAllThemeSeeds, getThemeBySlug, getThemeSeedBySlug } from '@/lib/theme-data';

export const revalidate = 86400;

type MarketThemePageProps = {
  params: Promise<{
    theme: string;
  }>;
};

export async function generateMetadata({ params }: MarketThemePageProps): Promise<Metadata> {
  const { theme } = await params;
  const themeSeed = getThemeSeedBySlug(theme);

  if (!themeSeed) {
    return { title: '未找到主题 | Trader42 指标字典' };
  }

  return {
    title: `${themeSeed.title} | Trader42 指标字典`,
    description: themeSeed.summary,
  };
}

export async function generateStaticParams() {
  return getAllThemeSeeds().map((theme) => ({ theme: theme.slug }));
}

export default async function MarketThemePage({ params }: MarketThemePageProps) {
  const { theme } = await params;
  const themeData = await getThemeBySlug(theme, { loadIndicator: getCachedIndicatorDataBySlugSafe });

  if (!themeData) {
    notFound();
  }

  return (
    <TerminalWorkspace
      leftRail={<TerminalDirectory activeTheme={themeData.slug} activeScopes={['美国']} />}
      rightRail={
        <div className="space-y-3">
          <Card>
            <CardBody className="space-y-3">
              <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">这一页先解决什么</p>
              <div className="space-y-2 text-[15px] leading-7 text-[color:var(--text-secondary)]">
                <p>1. 先认识这一组指标在看什么</p>
                <p>2. 再理解它们彼此的关系</p>
                <p>3. 最后再进入单指标页深读</p>
              </div>
            </CardBody>
          </Card>
        </div>
      }
    >
      <div className="space-y-3">
        <ThemeOverviewCard theme={themeData} />
        <div data-testid="theme-main-grid" className="grid gap-3 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] xl:items-start">
          <div data-testid="theme-indicator-column" className="space-y-3">
            <ThemeIndicatorGrid indicators={themeData.indicators} />
          </div>
          <div data-testid="theme-teaching-column" className="space-y-3">
            <ThemeRelationshipSection theme={themeData} />
            <ThemeInterpretationSection theme={themeData} />
          </div>
        </div>
      </div>
    </TerminalWorkspace>
  );
}
