# 灵感库分类法

## 条目种类与边界

| `entryKind` | 收录对象 | 关键字段 |
| --- | --- | --- |
| `source` | 持续策展、搜索或浏览外部作品的目录/平台。 | `primaryTheme`、内容类型、用途 |
| `site` | 单个官网、产品站、作品集或独立网页。 | **唯一** `domain`、`pageTypes`、`visualTraits`、`badges` |
| `brand` | 可系统研究的真实品牌设计语言或 DESIGN.md。 | **唯一** `domain`、可选 `collections`、官网与截图来源 |
| `collection` | 项目内的主题性策展集合。 | `key`、条目关联 |

目录站一律是 `source`；单个网页是 `site`；可复用品牌分析是 `brand`。不要把网页、目录和品牌分析做成同一个条目。第三方图片、Logo、字体或截图默认只外链；明确获得 vendoring 授权后可以保存，但必须保留来源 URL、采集日期、素材类型和权利归属。

## 网站与品牌的统一领域

网站和品牌各选一个 `domain`，按用户未来会以什么行业寻找它决定，而不是按技术栈或最显眼的视觉风格决定：

`ai-llm`、`developer-tools`、`cloud-data-devops`、`productivity-saas`、`design-creative`、`fintech-crypto`、`ecommerce-retail`、`media-content`、`consumer-tech`、`automotive-mobility`、`aerospace-industrial`、`travel-hospitality`、`education-knowledge`、`health-wellness`、`fashion-luxury`、`agency-portfolio`、`food-beverage`、`culture-nonprofit`。

可用专题是与领域正交的策展维度。当前只有 `retro-web`：它是年代/视觉专题，**不是行业领域**；仅在对象确实来自或明确致敬早期 Web 时添加。

## `site` 标注规则

- `pageTypes` 可多选：`marketing-site`、`landing-page`、`product-page`、`docs`、`ecommerce`、`editorial`、`portfolio`、`experimental`。
- `visualTraits` 可多选，但只标可由公开样本支撑的特征：`minimal`、`typographic`、`monochrome`、`dark-mode`、`bold`、`playful`、`editorial`、`illustrative`、`futuristic`、`animated`、`three-dimensional`、`photography-led`。
- `badges` 是策展判断，不是领域：`industry-reference`、`editor-pick`、`independent-gem`。不确定时不贴徽标。
- 每个网站记录 canonical URL、别名、第一方 provenance、核验日期和权利边界；本地保存截图时还要记录 `path`、`sourceUrl`、`finalUrl`、`capturedAt`、尺寸、状态和 `assetKind`。同一根域/同一维护主体的备用网址只保留一个条目。

## `source` 与 `site` 模板

```ts
// Curated directory or platform
{
  slug: "example-source",
  entryKind: "source",
  name: "Example Source",
  nameZh: "示例目录",
  aliases: ["Example"],
  url: "https://example.com/",
  canonicalUrl: "https://example.com/",
  primaryTheme: "websites",
  secondaryThemes: [],
  contentTypes: ["website"],
  useCases: ["web-design-inspiration"],
  visualTraits: ["minimal"],
  access: "public",
  rightsStatus: "external-only",
  provenance: [{ url: "https://example.com/about", kind: "first-party", note: "Official positioning." }],
  reviewedAt: "YYYY-MM-DD",
}

// Individual website
{
  slug: "example-site",
  entryKind: "site",
  name: "Example Site",
  nameZh: "示例网站",
  aliases: ["Example"],
  url: "https://example.com/",
  canonicalUrl: "https://example.com/",
  domain: "design-creative",
  collections: [],
  pageTypes: ["marketing-site", "portfolio"],
  visualTraits: ["typographic", "minimal"],
  badges: ["independent-gem"],
  access: "public",
  rightsStatus: "external-only",
  provenance: [{ url: "https://example.com/about", kind: "first-party", note: "Official positioning." }],
  reviewedAt: "YYYY-MM-DD",
}
```

## 审核结论

`accept` 表示来源稳定、用途明确、无明显重复；`watch` 表示 canonical、权利或分类证据尚不足；`reject` 表示重复、失效、无关或风险明显。逐项记录 `high`、`medium` 或 `low` confidence，并在报告中附 1–3 条第一方证据链接。
