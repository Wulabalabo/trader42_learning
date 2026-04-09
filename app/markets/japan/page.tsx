import { MarketPlaceholderPage } from '@/components/market-placeholder-page';

export const revalidate = 86400;

export default async function JapanMarketPage() {
  return (
    <MarketPlaceholderPage
      title="日本市场"
      activeKey="japan-market"
      activeScopes={['日本']}
      hero="日本市场会更关注日元、央行政策正常化、收益率曲线和全球套息交易。它经常通过汇率和流动性渠道放大全球波动。"
      whyItMatters="日本不只是本国市场问题。日本央行、日元和套息交易变化，往往会影响全球风险资产、债券和外汇的资金流向。"
      coverage={[
        '1. 日本央行政策与退出宽松',
        '2. 日元与汇率波动',
        '3. 收益率曲线与全球资金回流',
        '4. 套息交易与风险资产联动',
      ]}
    />
  );
}
