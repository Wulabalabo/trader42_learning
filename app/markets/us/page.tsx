import Link from 'next/link';

import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { TerminalDirectory } from '@/components/terminal-directory';
import { TerminalWorkspace } from '@/components/terminal-workspace';
import { getMarketContent } from '@/lib/market-data';
import { getAllThemeSeeds, getThemeHref } from '@/lib/theme-data';

export const revalidate = 86400;

export default async function USMarketPage() {
  const themes = getAllThemeSeeds('us');
  const content = getMarketContent('us');

  return (
    <TerminalWorkspace
      leftRail={<TerminalDirectory activeKey="us-market" activeScopes={['美国']} />}
      rightRail={
        <div className="space-y-3">
          <Card>
            <CardBody className="space-y-3">
              <div className="space-y-2 border-b border-[color:var(--border-subtle)] pb-3">
                <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">学习路径</p>
                <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">推进阅读顺序</p>
              </div>

              <div className="space-y-2">
                {content.teachingSteps.map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-[3px] border border-[color:var(--border-subtle)] bg-[color:rgba(255,255,255,0.02)] px-3 py-3">
                    <span className="min-w-10 text-[12px] font-semibold tracking-[0.12em] text-[color:var(--accent-primary)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[14px] leading-6 text-[color:var(--text-secondary)]">{step}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      }
    >
      <div className="space-y-3">
        <Card>
          <CardBody className="space-y-4">
            <div className="border-b border-[color:var(--border-subtle)] pb-3">
              <p className="text-[12px] font-medium tracking-[0.12em] text-[color:var(--text-secondary)]">{content.eyebrow}</p>
            </div>

            <div className="space-y-3">
              <h1 className="text-[2.2rem] font-semibold tracking-[0.04em] text-[color:var(--text-primary)] sm:text-[2.7rem]">{content.title}</h1>
              <p className="max-w-3xl text-[15px] leading-7 text-[color:var(--text-secondary)]">{content.hero}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-3">
            <div className="space-y-2 border-b border-[color:var(--border-subtle)] pb-3">
              <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">整体大图</p>
              <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">{content.bigPicture.title}</p>
              <p className="text-[14px] leading-6 text-[color:var(--text-secondary)]">{content.bigPicture.description}</p>
            </div>

            <div className="grid gap-2 lg:grid-cols-2">
              {content.bigPicture.items.map((item) => (
                <div key={item} className="flex gap-3 rounded-[3px] border border-[color:var(--border-subtle)] bg-[color:rgba(255,255,255,0.02)] px-3 py-3">
                  <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-[color:var(--accent-primary)]" />
                  <p className="text-[14px] leading-6 text-[color:var(--text-secondary)]">{item}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">{content.themeSectionTitle}</p>
            <p className="mt-2 text-[15px] leading-7 text-[color:var(--text-secondary)]">{content.themeSectionDescription}</p>
          </CardHeader>
          <CardBody>
            <div className="grid gap-3 lg:grid-cols-2">
                {themes.map((theme) => (
                <Link key={theme.slug} href={getThemeHref('us', theme.slug)} className="block h-full">
                  <Card className="h-full transition-colors hover:border-[color:rgba(208,176,112,0.35)] hover:bg-[color:rgba(255,255,255,0.02)]">
                    <CardBody className="space-y-3">
                      <div className="border-b border-[color:var(--border-subtle)] pb-3">
                        <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">主题入口</p>
                        <h2 className="mt-2 text-[18px] font-semibold tracking-[0.04em] text-[color:var(--text-primary)]">{theme.navLabel}</h2>
                      </div>

                      <p className="text-sm leading-6 text-[color:var(--text-secondary)]">{theme.summary}</p>

                      <p className="text-[12px] leading-6 text-[color:var(--text-secondary)]">包含指标：{theme.indicatorSlugs.length} 个</p>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </TerminalWorkspace>
  );
}
