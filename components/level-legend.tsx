import { Badge } from './ui/badge';

export function LevelLegend() {
  return (
    <div className="grid gap-1.5 text-[12px] font-medium tracking-[0.06em] text-[color:var(--text-secondary)]">
      <div className="flex items-center gap-2.5">
        <Badge variant="gold" className="px-2.5 py-1.5 text-[12px] tracking-[0.12em]">
          高
        </Badge>
        <span className="text-[12px] leading-6">直接驱动市场</span>
      </div>
      <div className="flex items-center gap-2.5">
        <Badge variant="soft" className="px-2.5 py-1.5 text-[12px] tracking-[0.12em]">
          中
        </Badge>
        <span className="text-[12px] leading-6">情境影响</span>
      </div>
      <div className="flex items-center gap-2.5">
        <Badge variant="neutral" className="px-2.5 py-1.5 text-[12px] tracking-[0.12em]">
          低
        </Badge>
        <span className="text-[12px] leading-6">次要影响</span>
      </div>
    </div>
  );
}
