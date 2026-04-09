import type { ReactNode } from 'react';

import { classNames } from '@/lib/classnames';

type BadgeVariant = 'gold' | 'soft' | 'neutral' | 'danger';

const badgeVariants: Record<BadgeVariant, string> = {
  gold: 'border-[color:rgba(208,176,112,0.45)] bg-[color:rgba(208,176,112,0.12)] text-[color:var(--accent-primary)]',
  soft: 'border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] text-[color:var(--text-secondary)]',
  neutral: 'border-[color:var(--border-subtle)] bg-transparent text-[color:var(--text-secondary)]',
  danger: 'border-[color:rgba(191,71,71,0.5)] bg-[color:rgba(191,71,71,0.15)] text-[color:var(--danger-primary)]',
};

type BadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: BadgeVariant;
};

export function Badge({ children, className, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-[2px] border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] leading-none',
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
