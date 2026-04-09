export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--border-subtle)] bg-[color:#0b0b0b]">
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-3 px-3 py-3 text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-secondary)] sm:px-4 lg:px-5">
        <p>用于学习，不用于实盘交易。</p>
        <p>指标字典 · 样本数据模式 · 可直接部署到 Vercel</p>
      </div>
    </footer>
  );
}
