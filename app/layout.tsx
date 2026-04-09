import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getSiteUrl } from '@/lib/site';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Trader42 指标字典',
  description: '面向新手交易员的宏观与市场指标字典，先从美国开始，后续扩展到 Global、中国和 Crypto。',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN" style={{ fontSize: '17px' }}>
      <body>
        <SiteHeader />
        <main className="mx-auto min-h-[calc(100vh-7rem)] w-full max-w-[1680px] px-3 py-3 sm:px-4 lg:px-5">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
