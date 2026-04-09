import type { ReactNode } from 'react';

type TerminalWorkspaceProps = {
  children: ReactNode;
  leftRail: ReactNode;
  rightRail: ReactNode;
};

export function TerminalWorkspace({ children, leftRail, rightRail }: TerminalWorkspaceProps) {
  return (
    <div className="grid gap-3 xl:grid-cols-[250px_minmax(0,1fr)_320px]">
      <aside className="space-y-3">{leftRail}</aside>
      <section className="min-w-0 space-y-3">{children}</section>
      <aside className="space-y-3">{rightRail}</aside>
    </div>
  );
}
