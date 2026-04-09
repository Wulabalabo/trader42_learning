import { IndicatorList } from '@/components/indicator-list';
import { ImpactGauge } from '@/components/impact-gauge';
import { TerminalDirectory } from '@/components/terminal-directory';
import { TerminalWorkspace } from '@/components/terminal-workspace';
import { getAllIndicators } from '@/lib/indicators';
import { Card, CardBody } from '@/components/ui/card';

export const revalidate = 86400;

export default async function IndicatorsPage() {
  const indicators = await getAllIndicators();

  return (
    <TerminalWorkspace
      leftRail={<TerminalDirectory activeKey="indicators" />}
      rightRail={
        <div className="space-y-3">
          <ImpactGauge label="目录总览" level="Medium" subtitle="扫描状态" />
          <Card>
            <CardBody className="space-y-3">
              <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">阅读顺序</p>
              <div className="space-y-2 text-[15px] leading-7 text-[color:var(--text-secondary)]">
                <p>1. 打开指标</p>
                <p>2. 浏览历史路径</p>
                <p>3. 阅读市场影响</p>
                <p>4. 查看它无法告诉你的内容</p>
              </div>
            </CardBody>
          </Card>
        </div>
      }
    >
      <IndicatorList
        heading="核心指标"
        description="使用此页浏览完整入门集合，按主题筛选，并一次打开一个指标。"
        items={indicators}
      />
    </TerminalWorkspace>
  );
}
