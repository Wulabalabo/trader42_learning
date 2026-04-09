import type { ReactNode } from 'react';

import { Card, CardBody, CardHeader } from './ui/card';

type IndicatorSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function IndicatorSection({ title, description, children }: IndicatorSectionProps) {
  return (
    <Card>
      <CardHeader>
        <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">&gt; {title}</p>
        {description ? <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[color:var(--text-secondary)]">{description}</p> : null}
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}
