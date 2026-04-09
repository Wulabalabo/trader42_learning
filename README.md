# Trader42 指标字典

Trader42 指标字典 是一个面向新手交易员和想补基础的人准备的指标字典，先覆盖美国宏观数据，后续会扩展到 Global、中国和 Crypto。

当前版本是一个学习型 MVP，优先帮助用户建立这几件事：
- 这个指标是什么
- 它为什么重要
- 现在偏高还是偏低
- 历史数据怎么读
- 它通常影响哪些市场
- 它不能说明什么
- 最新可用数据截至哪一期

## 主要功能

- 首页系统说明 + 左侧目录
- 指标列表页，按主题浏览全部指标
- 指标详情页，展示定义、历史、市场影响、数据截至日期和误区
- 指标页会根据 `scope` 高亮左侧范围标签
- `高 / 中 / 低` 的市场影响分级
- 历史数据直读，帮助形成交易直觉
- 每日从 FRED 刷新可用序列，保留最新观测值的截至日期
- `robots.txt` 和 `sitemap.xml`，便于收录与部署

## 当前首发指标

- CPI
- PCE
- 非农就业人数
- FOMC 利率决议
- ISM PMI

## 技术栈

- Next.js
- React
- TypeScript
- Bun
- Tailwind CSS
- Vitest
- Playwright
- Vercel

## 视觉设计

这个项目的视觉风格更接近一张“交易研究终端”截图：左侧目录树，中间是主指标详情，右侧是市场影响和历史数据。整体不是通用 SaaS 仪表盘，而是偏冷静、克制、可审计的研究界面。

- 接近黑色的深色背景，配合细边框分层面板
- 细长、紧凑、偏等宽字体，像控制台而不是营销页
- 大写区块标题、短标签、弱化装饰性文案
- 金色 / 暖黄用于主强调、选中态和关键数值
- 中性灰用于说明、辅助信息和低优先级内容
- 风险信息使用暖红，不扩展成多色系统
- 布局上采用“目录树 + 详情页 + 影响侧栏”的三栏结构
- 先给定义，再给历史上下文，再给常见误解和市场影响

这些规则与本地 `docs/frontend-visual-style-guide.md` 保持一致。

## 说明文档

- `docs/explain/indicator-reading-guide.md`：说明每个指标页怎么读、怎么理解“数据截至”，以及页面上各块信息的用途。

说明：`docs/` 目录用于本地设计和说明文档管理，不再作为 Git 仓库发布内容的一部分。

## 本地运行

先复制环境变量模板：

```bash
copy .env.example .env.local
```

需要的关键变量：

- `FRED_API_KEY`: FRED 真实序列访问密钥
- `AUTH_PROXY_BASE_URL`: 你的 OpenBB / Aktools auth-proxy 地址
- `API_TOKEN`: auth-proxy 的 Bearer token
- `INDICATOR_REVALIDATE_TOKEN`: 手动刷新指标缓存接口使用的 token

如果没有配置 `AUTH_PROXY_BASE_URL`，系统会直接跳过代理请求并回退到样本数据，不会因为缺少该 URL 而崩溃。

```bash
bun install
bun run dev
```

## 常用命令

```bash
bun run test
bun run lint
bun run build
bun run test:e2e
```

## 数据位置

指标内容目前保存在：

- `data/indicators`

真实序列会优先通过 FRED 获取；当前已确认接入的美国宏观序列包括 CPI、PCE、非农、失业率、失业金、JOLTS、Core CPI、Core PCE、PPI、Retail Sales，以及密歇根消费者信心。服务业 PMI 当前使用 S&P Global 口径作为 ISM 服务业 PMI 的高相关替代。

目前仓库内还没有任何已上线指标实际绑定到 `openbb` 或 `aktools` provider。相关代理能力已经预留，后续如果接入新的非 FRED 指标，将通过你的 auth-proxy 访问：

- `http://<proxy>/openbb/...`
- `http://<proxy>/aktools/...`

请求会自动带 `Authorization: Bearer <API_TOKEN>`。如果缺少 `API_TOKEN` 或 `AUTH_PROXY_BASE_URL`，代理请求会被直接跳过。

当前支持通过受保护接口触发指标缓存刷新：

- `POST /api/revalidate-indicators`

请求体示例：

```json
{
  "token": "your-indicator-token",
  "slug": "cpi"
}
```

如果省略 `slug`，会刷新所有指标标签缓存。

新增指标时，通常需要同步更新：

- `lib/indicators.ts`
- 相关页面和测试

## 部署

项目设计为直接部署到 Vercel。

## 目标

后续会继续扩展更多市场、更多区域和更完整的指标解释层。
