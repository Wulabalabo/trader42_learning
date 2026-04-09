import type { MarketTheme } from '@/lib/indicator-types';

import { Card, CardBody } from './ui/card';

type ThemeRelationshipSectionProps = {
  theme: MarketTheme;
};

export function ThemeRelationshipSection({ theme }: ThemeRelationshipSectionProps) {
  return (
    <section className="space-y-5">
      <div className="space-y-5">
        {theme.relationships.map((section) => (
          <div key={section.title} data-testid="theme-relationship-card">
            <Card>
              <CardBody className="space-y-2">
                <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-primary)]">{section.title}</p>
                <div className="space-y-2 text-sm leading-6 text-[color:var(--text-secondary)]">
                  {section.body?.map((item) => <p key={item}>{item}</p>)}
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
