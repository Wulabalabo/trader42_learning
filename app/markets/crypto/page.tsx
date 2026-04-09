import { MarketPlaceholderPage } from '@/components/market-placeholder-page';

export const revalidate = 86400;

export default async function CryptoMarketPage() {
  return (
    <MarketPlaceholderPage
      title="Crypto 市场"
      activeKey="crypto-market"
      activeScopes={['Crypto']}
      hero="Crypto 更像独立资产生态，会更关注美元流动性、风险偏好、ETF、链上周期和监管。它不是国家市场，但有自己的宏观框架。"
      whyItMatters="Crypto 虽然有独立叙事，但它和美元流动性、科技风险偏好、监管变化、稳定币与 ETF 资金流动都有很强联系。"
      coverage={[
        '1. 美元流动性与风险偏好',
        '2. ETF 与机构资金流',
        '3. 链上周期与叙事轮动',
        '4. 监管变化与市场结构',
      ]}
    />
  );
}
