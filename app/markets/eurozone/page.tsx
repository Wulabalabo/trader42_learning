import { MarketPlaceholderPage } from '@/components/market-placeholder-page';

export const revalidate = 86400;

export default async function EurozoneMarketPage() {
  return (
    <MarketPlaceholderPage
      title="欧元区市场"
      activeKey="eurozone-market"
      activeScopes={['欧元区']}
      hero="欧元区市场会更关注 ECB、通胀、增长分化、德国制造业与欧元汇率。这些变量常常会直接影响全球外汇、债券和风险偏好。"
      whyItMatters="欧元区不是一个单一经济体，但它是全球最重要的货币区之一。ECB 政策、欧元强弱、德法核心数据和能源冲击，都会快速传导到全球市场。"
      coverage={[
        '1. ECB 利率路径与沟通',
        '2. 欧元区通胀与增长分化',
        '3. 德国制造业与景气脉冲',
        '4. 欧元汇率与全球债市联动',
      ]}
    />
  );
}
