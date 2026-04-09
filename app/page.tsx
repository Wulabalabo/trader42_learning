import Link from 'next/link';

import homepage from '@/data/homepage.json';

import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { TerminalDirectory } from '@/components/terminal-directory';
import { TerminalWorkspace } from '@/components/terminal-workspace';

export const revalidate = 86400;

type HomePageContent = typeof homepage;

const homePageContent = homepage as HomePageContent;

export default function HomePage() {
  return (
    <TerminalWorkspace
      leftRail={<TerminalDirectory activeKey="home" />}
      rightRail={
        <Card>
          <CardBody className="space-y-3">
            <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">{homePageContent.usage.title}</p>
            <ul className="space-y-3 text-[15px] leading-7 text-[color:var(--text-secondary)]">
              {homePageContent.usage.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      }
    >
      <div className="space-y-3">
        <Card>
          <CardBody className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border-subtle)] pb-3 text-[11px] uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">
              <Badge variant="gold">{homePageContent.hero.eyebrow}</Badge>
              <span>系统说明</span>
            </div>

            <div className="mx-auto max-w-4xl space-y-5 text-center">
              <div className="space-y-4">
                <h1 className="mx-auto max-w-3xl text-[2.5rem] font-semibold tracking-[0.04em] text-[color:var(--text-primary)] sm:text-[3.2rem]">
                  {homePageContent.hero.title}
                </h1>
                <p className="mx-auto max-w-[46rem] text-[15px] leading-8 text-[color:var(--text-secondary)] sm:text-[16px]">
                  {homePageContent.hero.description}
                </p>
              </div>

              <div className="mx-auto max-w-[46rem] rounded-[3px] border-t border-[color:rgba(208,176,112,0.45)] bg-[color:rgba(255,255,255,0.015)] px-4 py-4 text-left">
                <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-primary)]/90">{homePageContent.hero.highlightsTitle}</p>
                <ul className="mt-3 space-y-3 text-[14px] leading-6 text-[color:var(--text-secondary)]">
                  {homePageContent.hero.highlights.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex max-w-[46rem] flex-wrap items-center justify-center gap-3 pt-1 text-[15px] leading-7 text-[color:var(--text-secondary)] mx-auto">
                <span>{homePageContent.hero.socialLabel}</span>
                <Link
                  href={homePageContent.hero.socialHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--accent-primary)] underline decoration-[color:rgba(208,176,112,0.5)] underline-offset-4 transition-colors hover:text-[color:var(--text-primary)]"
                >
                  {homePageContent.hero.socialHandle}
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">{homePageContent.overview.title}</p>
          </CardHeader>
          <CardBody>
            <ul className="space-y-3 text-[15px] leading-7 text-[color:var(--text-secondary)]">
              {homePageContent.overview.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">{homePageContent.marketMap.title}</p>
          </CardHeader>
          <CardBody>
            <div className="grid gap-3 lg:grid-cols-2">
              {homePageContent.marketMap.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block rounded-[3px] border border-[color:var(--border-subtle)] bg-[color:rgba(255,255,255,0.02)] p-4 transition-colors hover:border-[color:rgba(208,176,112,0.35)] hover:bg-[color:rgba(255,255,255,0.03)]"
                >
                  <p className="text-[13px] font-semibold tracking-[0.06em] text-[color:var(--text-primary)]">{item.title}</p>
                  <p className="mt-2 text-[15px] leading-7 text-[color:var(--text-secondary)]">{item.body}</p>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </TerminalWorkspace>
  );
}
