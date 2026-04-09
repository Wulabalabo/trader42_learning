import { Card, CardBody } from '@/components/ui/card';
import { TerminalDirectory } from '@/components/terminal-directory';
import { TerminalWorkspace } from '@/components/terminal-workspace';

type MarketPlaceholderPageProps = {
  title: string;
  activeKey: string;
  activeScopes: string[];
  hero: string;
  whyItMatters: string;
  coverage: string[];
};

export function MarketPlaceholderPage({ title, activeKey, activeScopes, hero, whyItMatters, coverage }: MarketPlaceholderPageProps) {
  return (
    <TerminalWorkspace
      leftRail={<TerminalDirectory activeKey={activeKey} activeScopes={activeScopes} />}
      rightRail={
        <Card>
          <CardBody className="space-y-3">
            <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">当前状态</p>
            <div className="space-y-2 text-[15px] leading-7 text-[color:var(--text-secondary)]">
              <p>正在施工</p>
              <p>这一页先占位，后续会逐步补完整主题地图、指标关系和单指标入口。</p>
            </div>
          </CardBody>
        </Card>
      }
    >
      <div className="space-y-3">
        <Card>
          <CardBody className="space-y-4">
            <div className="border-b border-[color:var(--border-subtle)] pb-3">
              <p className="text-[12px] font-medium tracking-[0.12em] text-[color:var(--text-secondary)]">市场占位页</p>
            </div>

            <div className="space-y-3">
              <h1 className="text-[2.2rem] font-semibold tracking-[0.04em] text-[color:var(--text-primary)] sm:text-[2.7rem]">{title}</h1>
              <p className="max-w-3xl text-[15px] leading-7 text-[color:var(--text-secondary)]">{hero}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-3">
            <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">为什么这个市场重要</p>
            <p className="text-[15px] leading-7 text-[color:var(--text-secondary)]">{whyItMatters}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-3">
            <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">后续会覆盖什么</p>
            <div className="space-y-2 text-[15px] leading-7 text-[color:var(--text-secondary)]">
              {coverage.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </TerminalWorkspace>
  );
}
