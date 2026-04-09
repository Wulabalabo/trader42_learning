import { MarketPlaceholderPage } from '@/components/market-placeholder-page';

export const revalidate = 86400;

export default async function ChinaMarketPage() {
  return (
    <MarketPlaceholderPage
      title="中国市场"
      activeKey="china-market"
      activeScopes={['中国']}
      hero="中国市场会更关注增长、地产、政策托底、汇率与商品需求。这些变量不只影响中国资产，也经常影响全球制造业和大宗商品定价。"
      whyItMatters="当市场开始重新定价中国增长、地产修复、财政与货币政策时，商品、亚洲市场、工业周期和风险偏好都会被一起带动。"
      coverage={[
        '1. 增长与内需',
        '2. 地产与信用脉冲',
        '3. 政策托底与汇率',
        '4. 商品需求与区域传导',
      ]}
    />
  );
}
