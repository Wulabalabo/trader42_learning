import Link from 'next/link';

import { primaryNavigation } from '@/lib/site-navigation';

export function SiteHeader() {
  return (
    <header className="border-b border-[color:var(--border-subtle)] bg-[color:#0b0b0b]">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-3 py-3 sm:px-4 lg:px-5 xl:flex-row xl:items-center xl:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-6 w-6 place-items-center border border-[color:var(--border-strong)] text-[11px] text-[color:var(--text-primary)]">
            □
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--text-primary)]">
            Trader42
          </span>
          <span className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">
            指标字典 v1.0
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-5 text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-secondary)]">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.href === '/' ? 'text-[color:var(--text-primary)] transition-colors hover:text-[color:var(--accent-primary)]' : 'transition-colors hover:text-[color:var(--text-primary)]'}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
