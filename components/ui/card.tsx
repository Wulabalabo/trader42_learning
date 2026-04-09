import type { ReactNode } from 'react';

import { classNames } from '@/lib/classnames';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={classNames(
        'rounded-[3px] border border-[color:var(--border-subtle)] bg-[color:var(--surface-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={classNames('border-b border-[color:var(--border-subtle)] px-4 py-3 sm:px-5 sm:py-4', className)}>{children}</div>;
}

export function CardBody({ children, className }: CardProps) {
  return <div className={classNames('px-4 py-3 sm:px-5 sm:py-4', className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardProps) {
  return <div className={classNames('border-t border-[color:var(--border-subtle)] px-4 py-3 sm:px-5 sm:py-4', className)}>{children}</div>;
}
