# SaaS 整站工程案例：初始化、服务边界与主题替换

> 后续范围澄清：用户聚焦前端组件、页面与整站资产；本报告的全栈服务/工程生成建议已不属于本轮规格。已核对的外部事实保留，相关主题和源码分发事实仍可参考。


日期：2026-10-07。对应 [开源 SaaS 工程如何处理初始化、服务接入与默认运行？](https://github.com/xiaowen-0725/ui-lab/issues/36)。本报告延续 [后台模板研究](2026-10-07-site-template-references.md)，聚焦可独立启动的真实工程，不重复组件画廊调查。没有运行项目、复制模板产品源码、开通服务、使用密钥、提交或操作 GitHub。

**结论：**nextjs/saas-starter 展示一个 Next + Postgres + Stripe 的小型完整业务链；Makerkit 的 canonical 公开 Lite 展示 Next monorepo + 本地 Supabase 的个人账户站点；补充的 OpenSaaS 展示 Wasp + React/Node/Prisma 与独立 Astro 内容站。三者可帮助定义“生成独立工程”的交付面，但不能直接推出“无服务依赖、一键就获得生产安全 SaaS”。目前证据也不支持将 Makerkit Lite 的团队/订阅宣传视为公开实现。[Next package][N-package]、[Next 支付][N-payments]、[Lite manifest][M-package]、[Lite schema][M-migration]、[Lite README][M-readme]、[Wasp app spec][O-spec]。

## 研究边界与固定来源

用户已确认页面、外壳、整站可独立安装、提供无密钥运行示例、统一整站入口按用途筛选；新增的**长期目标**是基于整站模板一键生成独立可启动 SaaS 工程且能换主题。这是待定义/实施的目标，不是 UI Lab 已有能力。按已读 AGENTS、产品定义、编码规则与 research 技能第一方证据规则工作；作为研究子代理未再 spawn。主仓仅用于前轮读取技能，无写入。

| 第一方工程 | 固定 revision | 许可实际文本 | 工程技术证据 |
| --- | --- | --- | --- |
| nextjs/saas-starter | `6e33e58b1e553a41fe22e6b941a7229a002de361`；commit 2025-12-11 22:35:36 UTC | 根 LICENSE 是 MIT，copyright 2025 Vercel；包含保留版权/许可通知及不保证条款 [许可][N-license] | package 声明 Next `15.6.0-canary.59`、React `19.1.0`、Tailwind `4.1.7`，Postgres/Drizzle、Stripe、SWR [manifest][N-package] |
| makerkit/nextjs-saas-starter-kit-lite | `c5cba64391a80620309c4178163dc2df42568d1b`；commit 2026-08-04 12:51:53 UTC | 根 LICENSE 是 MIT，copyright 2024 MakerKit；包含通知保留及不保证条款；未见前轮 studio 那类附加限制 [许可][M-license] | apps/packages/tooling monorepo；workspace catalog 声明 Next `16.3.0`、React `19.2.8`、Tailwind `4.3.3`；根 engines Node `>=22.13.0`、packageManager `pnpm@11.18.0` [根][M-package]、[workspace][M-workspace] |
| wasp-lang/open-saas（补充） | 主代理核对并提供该 SHA：`7a97e012e4aefeef74cc26fe572b30ebc04a019d` | 根 LICENSE 是 MIT，copyright 2023 wasp-lang，包含通知保留及不保证条款 [许可][O-license] | app spec 声明 Wasp `^0.26.0`；app package React `^19.2.1`、Tailwind `^4.1.18`、Prisma `5.19.1`；blog package 是 Astro/Starlight [spec][O-spec]、[app][O-package]、[blog][O-blog] |

前两项 revision 从 GitHub API HEAD 获取，递归树均未标 truncated；OpenSaaS 读取指定 SHA 递归树，亦未标 truncated。版本是 manifest 声明，不是安装解析/兼容验证；在线 OpenSaaS 文档是查阅当日内容，未证明与固定 SHA 的每个步骤完全一致。

固定 commit：[Next](https://github.com/nextjs/saas-starter/commit/6e33e58b1e553a41fe22e6b941a7229a002de361)、[Makerkit Lite](https://github.com/makerkit/nextjs-saas-starter-kit-lite/commit/c5cba64391a80620309c4178163dc2df42568d1b)、[OpenSaaS](https://github.com/wasp-lang/open-saas/commit/7a97e012e4aefeef74cc26fe572b30ebc04a019d)。根许可只说明已读许可范围，未完成第三方包/图像/字体权利链审计；后续复制实质源码仍须保留已有声明和 provenance，公开 Lite 的许可不自动覆盖付费版。

## 案例一：nextjs/saas-starter

### 事实：真正交付的站面和目录

这是单 Next 工程：`app/(dashboard)` 内有 `/` 营销页、`/pricing` 价格页、`/dashboard` 团队/订阅页及 general/security/activity 子页；`app/(login)` 是 sign-in/sign-up 与 Server Actions；`app/api/stripe` 是结账回调与 webhook；`lib/auth`、`lib/db`、`lib/payments` 区分服务职责。根 layout 将 user/team promises 放入 SWR fallback，共享导航读取 user，退出调用 Server Action。这些是有路由、schema 和操作连接的工程，不能只归类为 UI 示例。[根 layout][N-root]、[共享导航][N-shell]、[登录入口][N-login]、[团队页][N-dashboard]、[schema][N-schema]、[支付回调][N-checkout]。

### 事实：初始化不是无密钥的一步启动

1. README 的顺序是 install、Stripe CLI login、`db:setup`、`db:migrate`、`db:seed`、dev；package 真正存在这些脚本。[说明][N-readme]、[脚本][N-package]。
2. setup 脚本先检查 Stripe CLI/config，再询问 local Docker Postgres 或远程 URL、Stripe secret；用 CLI 取 webhook secret，生成随机 AUTH_SECRET，写 `.env`。本地分支创建固定 container_name、54322 端口和数据卷的 docker-compose。写 `.env` 与 compose 用 writeFile，没有保留已有内容的合并逻辑；它是交互初始化，不是非交互生成器。[setup][N-setup]。
3. `.env.example` 要 POSTGRES_URL、STRIPE_SECRET_KEY、STRIPE_WEBHOOK_SECRET、BASE_URL、AUTH_SECRET，且明写默认用 `.env` 而非 `.env.local`。db/drizzle 在模块求值时检查 POSTGRES_URL，缺失即抛错；根 layout 导入 queries，因此无配置不能被认定为可用整站。[env][N-env]、[db][N-db]、[根][N-root]。
4. migrations 文件已存在，Drizzle config 指向 schema/migrations/Postgres。seed 插入固定示例用户和团队，然后**实际调用 Stripe API 创建产品和价格**，不是只写本地 fixture；没有看到去重/重入保护，重复 seed 的邮箱 unique 和远程对象副作用需纳入生成流程设计。[migration][N-migration]、[config][N-drizzle-config]、[seed][N-seed]。

**推断（静态）：**dev 进程启动、路由首次编译、页面可用和业务操作成功是不同层次。只跑 dev 不表示整站可用：无 POSTGRES_URL 会进入已证实的 import-time 错误；登录 actions 又 import Stripe module，Stripe client 在模块顶层实例化；pricing 服务端会 list Stripe products/prices，所以价格卡的数值 fallback 并非无网络降级模式。即使手工接好本地 Postgres 并改成仅本地 seed，当前完整流程仍需进一步拆开支付依赖才能形成诚实的无云密钥示例。[登录 actions][N-actions]、[Stripe module][N-payments]、[pricing][N-pricing]。本报告未验证具体错误出现在哪个 Next 编译阶段，也未拿 dummy Stripe key 试跑。

### 事实：鉴权、团队与 tenant 查询的真实边界

- session 用 bcryptjs 比较/哈希密码、jose HS256 JWT，cookie 设置 httpOnly/secure/sameSite；global middleware 保护 `/dashboard` 并在 GET 更新 session。API 被 matcher 排除；Server Actions 的 validatedActionWithUser/withTeam 再检查真实 user/team。现有机制是一个学习型自有会话示例，不是委托成熟身份服务。[session][N-session]、[middleware][N-middleware]、[action wrappers][N-action-auth]。
- schema 有 users、teams、teamMembers、invitations、activityLogs，团队存 Stripe customer/subscription/status；getTeamForUser 从当前认证 user 的 membership 查团队，getUserWithTeam 用 userId 联结并 limit(1)。这是按成员关联取队伍，未见显式 active tenant 选择契约，不能自动扩成任意多组织切换。[schema][N-schema]、[queries][N-queries]。
- removeTeamMember 删除条件带当前 teamId 与 memberId；inviteTeamMember 取当前 team 并验证邮箱/role/已有邀请。但这两个已读 action 和 wrapper **没有 owner 角色判定**；UI 的 InviteTeamMember 却用 `user.role === owner` 决定邀请表单。隐藏 UI 和登录校验不能替代操作权限；还需区分 users.role 与 membership.role。[服务端 actions][N-actions]、[UI][N-dashboard]、[wrapper][N-action-auth]。
- 邀请实际是 DB insert，发送邀请邮件仍是 TODO；返回“sent”不是邮件投递证据。signup 的邀请分支按 inviteId、email、pending 查记录；本轮不做完整竞态/事务/身份验证安全审计。[actions][N-actions]。

**建议：**借鉴“schema + migration + server queries + auth 包装 + view”的职责分层，但不要把这些手写 session、客户端角色条件或示例邀请流程直接作为生成 SaaS 的安全基线。生成器需要采用已选成熟身份/授权服务的官方集成和目标工程验证；本报告不选定供应商，也不建议另写自制安全机制。

### 事实：订阅/webhook 有实现，也有未覆盖状态

createCheckoutSession 用 Stripe subscription checkout，team customer 与 user client_reference_id，成功跳转 `/api/stripe/checkout`。该 GET 路由 retrieve session/subscription，再由 user membership 查 team，更新订阅并 setSession；初始订阅记录依赖这条回跳链。[Stripe][N-payments]、[checkout callback][N-checkout]。

webhook 读取原始 text、用签名和 webhook secret 验证，只处理 `customer.subscription.updated/deleted`，未处理 README 举例的 checkout.session.completed。handler 按 customer 找 team，处理 active/trialing 与 canceled/unpaid；未见 event ID 持久化/去重，未覆盖所有支付状态，也未验证浏览器未回跳、重试、乱序时的最终一致性。customer portal 有实现，但 withTeam 只保证认证用户和团队，没有账单管理员角色判定。[webhook][N-webhook]、[handler/portal][N-payments]、[actions][N-payment-actions]。

还有产品语义差异：seed 的 price trial 是 7 天，pricing 展示 price trial（缺省 7），checkout subscription_data 写 14 天；pricing 文案说 per user，checkout quantity 固定 1。这些必须由产品规则统一，不能复制演示值作为 seat billing 契约。[seed][N-seed]、[pricing][N-pricing]、[checkout 创建][N-payments]。

### 事实/推断：换主题不等于替换一份 CSS

globals.css 有语义变量和 dark variant，但共享导航、login、pricing 用不少固定 gray/orange/white 类；根 layout 也直接写背景类。本轮未见完整主题选择 UI 的证据。**推断：**换 Theme Kit 需要先将站面品牌/表面样式统一映射到语义 token；已有 dark 变量不能证明整站都可换主题。[CSS][N-css]、[shell][N-shell]、[login][N-login]、[pricing][N-pricing]、[root][N-root]。

## 案例二：Makerkit canonical 公开 Lite

### 事实：完整基础站面，个人账户而非公开完整版团队 SaaS

canonical 仓库是 `makerkit/nextjs-saas-starter-kit-lite`。工程有 `apps/web`、`apps/e2e`、`packages/features/{auth,accounts}`、`packages/{supabase,next,ui,i18n,shared}` 和 tooling。web 使用 workspace:* 内部包、catalog: 依赖；生成时只拷 apps/web 会丢掉工程闭包。[root][M-package]、[web][M-web-package]、[workspace][M-workspace]。

路由树包含营销首页/FAQ/法律页、auth 注册/登录/确认/重置/MFA、`/home` 仪表盘与 settings。HomeLayout 从 navigationConfig 选择 sidebar/header layout；home page 调 DashboardDemo；settings 在 server component 要求认证 user 后呈现个人账户设置。是整站基础工程，dashboard 命名本身不能证明连接真实经营指标。[home layout][M-home-layout]、[home page][M-home-page]、[demo wrapper][M-demo]、[settings][M-settings]。

### 事实：无需自备云密钥的本地路径，但仍需要 Supabase 服务

- 根 scripts 支持 supabase:web:start/stop/reset/typegen，web scripts 调 Supabase CLI；README 明确要 Docker daemon，先起本地 Supabase 再 dev。config.toml 固定 API/DB/Studio/邮件测试端口，DB major_version 15，auth redirect localhost，开启 signup 与邮箱确认。[脚本][M-web-package]、[说明][M-readme]、[Supabase config][M-supabase-config]。
- `.env` 放产品/URL/主题/feature flags，`.env.development` 已提供 localhost Supabase URL 和本地 anon/service-role 样例值。这些值本轮未使用、未写入报告。server client 的 keys helper 强制校验 URL 与 anonKey，admin client 单独 server-only 读 service role。[基础 env][M-env]、[开发 env][M-dev-env]、[keys][M-keys]、[server][M-server-client]、[admin][M-admin-client]。
- migration 创建个人 accounts、权限策略、auth trigger 和头像 storage；seed.sql 是**空文件**，不能宣称初始化就有示例登录用户。auth.users 插入 trigger 创建对应 account，注册确认需看本地邮件测试箱。[migration][M-migration]、[seed][M-seed]、[邮件/确认配置][M-supabase-config]。
- README 建议 Node 18+，requirements 脚本仍检查 18.18+ / pnpm major>=9，但根 manifest 要 Node >=22.13、pnpm 11.18。生成器应以目标 revision 的真实 engines/workspace 为准并验证，不能复制过时安装说明。[README][M-readme]、[requirements][M-requirements]、[manifest][M-package]。

**静态判定：**“不自备云服务密钥”与“环境完全没有 key”不同。源码给出前者的本地 Supabase 路径；移除这些本地 env 值会在 client key 校验中失败。不开本地 Supabase，公开营销正文可能仍能输出部分 HTML，但全局 AuthProvider 的 effect、header user hooks 要初始化 Supabase，auth/home/settings 有服务访问，不能宣称整个站点可用。仅有 dev.mjs requirements 检查并不验证 Docker/service readiness。[keys][M-keys]、[auth provider][M-auth-provider]、[listener][M-auth-listener]、[header][M-header-account]、[proxy][M-proxy]、[dev hook][M-dev]。

OAuth 配置列 google，但同时要求在 Supabase Console 开启 provider；本地 config 没有给 Google client credentials，不能把 OAuth 按钮存在等同于本地免密钥可登录。captcha site key 缺省为空、provider 条件加载，实际接入另有服务契约。[auth config][M-auth-config]、[本地 config][M-supabase-config]、[root providers][M-root-providers]。

### 事实：个人隔离落实在 RLS；团队/账单不能从注释外推

proxy 对 `/home` 验证 Supabase claims、未登录跳 sign-in，并检查 MFA；requireUser 是服务端 claims/MFA 包装，enhanceAction 默认 auth=true，settings 再用 requireUserInServerComponent。server Supabase client 带 cookie，admin client 独立 server-only，形成不同权限入口。[proxy][M-proxy]、[require-user][M-require-user]、[action][M-action]、[settings][M-settings]、[clients][M-server-client]、[admin][M-admin-client]。

实际 SQL 的 accounts SELECT/UPDATE policy 是 `auth.uid() = id`，auth.user trigger 用 new.id 建 account；storage 写规则也围绕账号 id。AccountsApi 查询 accounts.id，依赖调用时 client 权限与 DB RLS。SQL 注释虽说可为 team/personal，但已读公开 schema 没有团队 memberships/roles/subscriptions 表；不能据注释或 teams.json/billing.json 翻译文件认定团队 tenant 模型存在。[SQL][M-migration]、[API][M-accounts-api]。

README 将 **complete billing/subscription、team accounts/management** 等列为 Full 版增加功能；公开 marketing page 的卡片却显示 Multi Tenancy、Billing。实际路由/源码树中未见公开支付 webhook/billing feature package，这与 README Lite 边界相符。删除账户 service 的注释说“取消所有订阅”，实现只调用 Supabase admin.deleteUser，未见订阅取消调用。**付费功能宣传、遗留注释、配图、翻译词条都不是 Lite 可用能力的证明。**本报告未读取付费源码，不能认证其质量或权利。[README][M-readme]、[marketing][M-marketing]、[delete service][M-delete-service]。

### 事实/推断：主题入口较完整，但只证实明暗与 token 边界

RootProviders 用 next-themes，app config 控制 default mode，feature flag 控制 toggle；CSS 分 theme.css（语义映射）和 shadcn-ui.css（值），header 有 ModeToggle。root 避免读主题/session cookie，将主题交给客户端，以保留公开页静态结构。**推断：**这种 token/偏好/provider 分层适合研究“换主题”的工程边界，但现有明暗切换不等于已支持任意品牌 Theme Kit 或所有页面主题回归。[root][M-root]、[providers][M-root-providers]、[config][M-app-config]、[flags][M-flags]、[theme][M-theme]、[token values][M-colors]、[toggle][M-header-account]。

## 补充不同栈：OpenSaaS / Wasp

限定核验指定 SHA 的 LICENSE、`template/app/main.wasp.ts`、package/schema/env example、payment spec、env schema、emailSender spec 与 `template/blog/package.json`。Wasp app spec 将 landing/auth/user/demo AI/payment/file upload/analytics/admin 组合成整站；schema 是 Postgres/Prisma，User 存订阅/credits 字段，并有唯一 paymentProcessorEventId 的 ProcessedWebhookEvent 模型。后者只证实 schema 具备去重记录结构，未追踪完整 webhook handler，不能认证幂等行为。[spec][O-spec]、[schema][O-schema]、[payment routes][O-payment]。

官方 [Getting Started](https://docs.opensaas.sh/start/getting-started/) 写明 `wasp new` 选 saas、Docker 下 `wasp start db`、`wasp db migrate-dev`、复制 `.env.server.example` 后 dummy keys 可 `wasp start`；**这是文档声明，本轮未运行验证，也未证实支付/AI/上传等所有页面动作在 dummy 模式可用**。源码 emailSender 确实配置 Dummy，在日志看确认 URL；env schema 汇总多个服务变量，删除 feature 时还需同步移除对应 schema；支付 spec 注册 pricing、受保护 checkout、checkout action 与 `/payments-webhook`，真实支付仍需要合法凭据/产品配置。[env example][O-env]、[env validation][O-env-validation]、[Dummy mail][O-email]、[payment][O-payment]。

blog 是独立 Astro + Starlight + starlight-blog 工程，官方说明另行 install/dev；因此 app + blog/docs 有独立进程、工具链与部署面。[blog manifest][O-blog]、[启动说明](https://docs.opensaas.sh/start/getting-started/)。可借鉴的是完整公开/登录/账户/支付/后台/内容站地图、明确启动步骤和 Dummy/真实服务的区分。**采用 Wasp 意味着选择其 spec、生成目录、SDK、Prisma 与服务运行方式，属于整体工程框架取舍，不能描述为把一个 UI 安装进 Next。**[app spec][O-spec]、[generated workspace manifest][O-package]。

## 宏观比较：从整站资产到独立工程

以下为证据后的建议，不是已决定选择。

| 面向用户的交付问题 | Next starter | Makerkit Lite | OpenSaaS 补充 |
| --- | --- | --- | --- |
| 真实整站面 | marketing + pricing + login + 团队/dashboard + settings/activity | marketing/legal/FAQ + auth + 个人 home/settings | Wasp SaaS app + 独立 Astro blog/docs |
| 本地服务最低路径 | Postgres；现有 setup/seed 强耦合 Stripe | Docker Supabase；已带本地 env，邮件测试箱 | Docker Postgres + Wasp；官方声明 dummy env 可启动 |
| 无自备云密钥示例 | 当前默认流程不满足；不能只放 placeholder 宣称可用 | 有公开本地路径，仍要求本地 key/config 与服务；OAuth 另计 | 文档有明确 dummy 路径，真实服务功能另计 |
| 公开组织/tenant 证据 | membership 查 team；不完整 owner 授权，默认取首个 membership | 个人账户 RLS；Full 才宣传团队管理 | 本轮只读 User schema，未核验团队隔离 |
| 公开订阅证据 | Checkout + Portal + 部分 webhook 状态，有示例缺口 | 未见完整账单/webhook 实现；Full 宣传 | 注册支付操作/webhook/事件模型；未审计 handler |
| 换主题证据 | token 有，但整站硬编码色仍多 | next-themes 明暗 + 分层语义 CSS | 本轮未查主题逻辑，不宣称已验证 |

Kiranism 仅对照前轮结论：它的 Next/Clerk 壳与 mock product 查询可帮助看消费者适配，但不是本轮新增的完整无密钥 SaaS 基线，不再重复读仓库。[既有报告](2026-10-07-site-template-references.md#事实各项目实际源码组织)。

### 可复用实践（建议）

1. 把交付物区分为**可安装整站前端资产**与**独立工程启动配置**：后者还需要真实 runtime、route adapters、identity、DB/migrations、env schema、service providers 与 package/workspace 闭包。参考 Next 的 auth/db/payments 分层、Makerkit 的 apps/features/provider 分层、Wasp 的声明式整站 spec；不要让 Theme Kit 或 Recipe 冒充这些尚未定义的能力。[N manifest][N-package]、[M manifest][M-web-package]、[Wasp spec][O-spec]、[当前产品边界](../../PRODUCT_DEFINITION.md)。
2. 给独立工程一个可重复的本地启动路径：提供本地服务/fixture/邮件测试说明，把 demo seed 与外部计费对象创建分开；对未接真实服务的按钮/动作明确说明实际可用状态，不把虚假的“付费成功”写入生产鉴权或账单。Makerkit 本地 Supabase、OpenSaaS Dummy mail 有第一方实例，Next seed 的 Stripe 副作用提供反例。[M local config][M-supabase-config]、[O mail][O-email]、[N seed][N-seed]。
3. 统一主题 token 的角色和值，主题偏好由消费工程 provider 负责；保持页面/壳/整站独立身份、引用关系和完整安装闭包。现有 UI Lab 的站面可以进入成熟 starter 的 view 层，但不会因此自动拥有 tenant/订阅服务。[M theme][M-theme]、[M providers][M-root-providers]、[本地编码规则](../../CODING_STANDARDS.md#组件化与依赖方向)。
4. 服务端 action 权限、tenant 查询范围、DB policy、webhook 验签/去重/最终状态应有各自的消费工程验收；优先研究采用成熟方案的官方集成，别从学习型会话代码发明通用安全框架。本次只确认代码存在与具体缺口，没有替用户定身份或账单供应商。

### 一键生成的具体陷阱（建议）

- **只复制 web 子目录：**Makerkit 的 @kit/* workspace 与 catalog: 会断；Wasp 的 .wasp/out 工作区需要框架生成；Next 示例依赖特定 canary。生成前固定完整模板 revision 和实际工具链。[M manifest][M-web-package]、[M workspace][M-workspace]、[O package][O-package]、[N package][N-package]。
- **把 initialize 当 dev：**migrate、注册 trigger、seed、确认邮箱、DB readiness 与 dev listener 是不同成功条件。Next setup 会覆盖 env/compose、seed 有远程副作用；Makerkit reset 是 DB reset，不能自动套到用户已有库。[N setup][N-setup]、[N seed][N-seed]、[M scripts][M-web-package]。
- **多个生成工程冲突：**Next 固定 container_name/54322，Makerkit 固定 project_id/端口，两者还共用 DB 54322；本地生成须分配工程身份和端口，不能认为克隆多份便自然隔离。[N setup][N-setup]、[M config][M-supabase-config]。
- **环境提示与实现脱节：**README 旧 Node 要求、Google 按钮未配 provider、付费功能配图、订阅取消注释都可能误导。按固定代码生成启用功能与启动说明，真实服务接入仍需回调 URL、凭据和权限配置。[M engines][M-package]、[M auth][M-auth-config]、[M marketing][M-marketing]、[M delete service][M-delete-service]。
- **主题替换覆盖工程设置：**不要因换 palette 改业务语义、计划/试用天数、权限、路由或 env。Next 7/14 天、per-user/quantity=1 已表明演示文案和服务规则需要单独核对。[N pricing][N-pricing]、[N Stripe][N-payments]。

## 留给人决定的问题

- 首个可生成工程的用途和服务边界是什么：个人工具、团队工作区还是带订阅的产品？Lite 的个人模型和 Next 的示例 team 不能代替业务领域定义。
- 无密钥示例接受 Docker/本地 Supabase/Wasp，还是只接受无外部进程的前端 fixture？这决定“可启动”和“可操作”的真实范围。
- 选择 Next 工程、Supabase monorepo 或 Wasp 整体工具链有哪些约束？身份、团队权限和计费提供方由谁选定？
- 换主题只改变 token，还是还要覆盖字体、图表、marketing 品牌与内容站？需要哪些页面/状态的视觉验收？
- 哪些成熟工程作为外部参考，哪些经完整许可、契约和消费验证后能成为可生成源模板？本报告不替用户锁定选择。

## 实际验证范围

本轮为聚焦静态核验。读取前两仓 HEAD revision/文件树、固定 SHA 的 package/license/README、初始化/env/seed/migrations、代表性根布局/登录/账户/团队/query/auth/provider/payments/webhook/theme 文件；OpenSaaS 仅做主代理提供 SHA 的补充代码/许可核验及官方启动文档。短文件完整读取；长文件取代表性段落和关键路径，未对所有产品源码逐行审计。实际 permalink 见下方来源定义。

未 clone/install/run/build/test，未使用 env key 值，未执行 setup/migrate/seed/reset/webhook，也未开通 Docker、DB、Supabase、Stripe 或其他服务；没有实际验证匿名页面、邮箱确认、SSR/cache/hydration、tenant 越权、webhook 重放/乱序、主题/移动/可访问性或发布。未读 Makerkit Full 付费源码、未全面核验 OpenSaaS payment/auth handler 和主题；未做供应商价格比较或完整法律/安全认证。没有 commit/push/GitHub 写操作，所有结论按事实、静态推断与建议区分。

## 第一方固定源码链接


### nextjs/saas-starter

- [LICENSE](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/LICENSE)
- [package.json](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/package.json)
- [README.md](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/README.md)
- [.env.example](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/.env.example)
- [lib/db/setup.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/db/setup.ts)
- [lib/db/drizzle.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/db/drizzle.ts)
- [lib/db/seed.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/db/seed.ts)
- [lib/db/schema.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/db/schema.ts)
- [lib/db/queries.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/db/queries.ts)
- [lib/auth/session.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/auth/session.ts)
- [lib/auth/middleware.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/auth/middleware.ts)
- [middleware.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/middleware.ts)
- [lib/payments/stripe.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/payments/stripe.ts)
- [lib/payments/actions.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/payments/actions.ts)
- [app/api/stripe/webhook/route.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/api/stripe/webhook/route.ts)
- [app/api/stripe/checkout/route.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/api/stripe/checkout/route.ts)
- [app/layout.tsx](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/layout.tsx)
- [app/(dashboard)/layout.tsx](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/(dashboard)/layout.tsx)
- [app/(dashboard)/pricing/page.tsx](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/(dashboard)/pricing/page.tsx)
- [app/(login)/login.tsx](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/(login)/login.tsx)
- [app/(login)/actions.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/(login)/actions.ts)
- [app/(dashboard)/dashboard/page.tsx](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/(dashboard)/dashboard/page.tsx)
- [app/globals.css](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/globals.css)
- [lib/db/migrations/0000_soft_the_anarchist.sql](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/db/migrations/0000_soft_the_anarchist.sql)
- [drizzle.config.ts](https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/drizzle.config.ts)

### makerkit/nextjs-saas-starter-kit-lite

- [LICENSE](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/LICENSE)
- [package.json](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/package.json)
- [README.md](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/README.md)
- [pnpm-workspace.yaml](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/pnpm-workspace.yaml)
- [apps/web/package.json](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/package.json)
- [tooling/scripts/src/requirements.mjs](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/tooling/scripts/src/requirements.mjs)
- [tooling/scripts/src/dev.mjs](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/tooling/scripts/src/dev.mjs)
- [apps/web/.env](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/.env)
- [apps/web/.env.development](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/.env.development)
- [apps/web/supabase/config.toml](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/supabase/config.toml)
- [apps/web/supabase/migrations/20241219010757_schema.sql](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/supabase/migrations/20241219010757_schema.sql)
- [apps/web/supabase/seed.sql](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/supabase/seed.sql)
- [apps/web/config/app.config.ts](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/config/app.config.ts)
- [apps/web/config/auth.config.ts](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/config/auth.config.ts)
- [apps/web/config/feature-flags.config.ts](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/config/feature-flags.config.ts)
- [apps/web/proxy.ts](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/proxy.ts)
- [apps/web/app/layout.tsx](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/layout.tsx)
- [apps/web/components/root-providers.tsx](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/components/root-providers.tsx)
- [apps/web/components/auth-provider.tsx](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/components/auth-provider.tsx)
- [packages/supabase/src/hooks/use-auth-change-listener.ts](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/supabase/src/hooks/use-auth-change-listener.ts)
- [apps/web/app/home/layout.tsx](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/home/layout.tsx)
- [apps/web/app/home/page.tsx](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/home/page.tsx)
- [apps/web/app/home/_components/dashboard-demo.tsx](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/home/_components/dashboard-demo.tsx)
- [apps/web/app/home/settings/page.tsx](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/home/settings/page.tsx)
- [apps/web/app/(marketing)/_components/site-header-account-section.tsx](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/(marketing)/_components/site-header-account-section.tsx)
- [apps/web/app/(marketing)/page.tsx](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/(marketing)/page.tsx)
- [packages/supabase/src/require-user.ts](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/supabase/src/require-user.ts)
- [packages/next/src/actions/index.ts](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/next/src/actions/index.ts)
- [packages/features/accounts/src/server/api.ts](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/features/accounts/src/server/api.ts)
- [packages/features/accounts/src/server/services/delete-personal-account.service.ts](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/features/accounts/src/server/services/delete-personal-account.service.ts)
- [packages/supabase/src/clients/server-client.ts](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/supabase/src/clients/server-client.ts)
- [packages/supabase/src/clients/server-admin-client.ts](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/supabase/src/clients/server-admin-client.ts)
- [packages/supabase/src/get-supabase-client-keys.ts](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/supabase/src/get-supabase-client-keys.ts)
- [apps/web/styles/theme.css](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/styles/theme.css)
- [apps/web/styles/shadcn-ui.css](https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/styles/shadcn-ui.css)

### wasp-lang/open-saas

- [LICENSE](https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/LICENSE)
- [template/app/main.wasp.ts](https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/main.wasp.ts)
- [template/app/package.json](https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/package.json)
- [template/blog/package.json](https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/blog/package.json)
- [template/app/schema.prisma](https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/schema.prisma)
- [template/app/.env.server.example](https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/.env.server.example)
- [template/app/src/payment/payment.wasp.ts](https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/src/payment/payment.wasp.ts)
- [template/app/src/env.ts](https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/src/env.ts)
- [template/app/src/server/emailSender.wasp.ts](https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/src/server/emailSender.wasp.ts)

[N-license]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/LICENSE
[N-package]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/package.json
[N-readme]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/README.md
[N-env]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/.env.example
[N-setup]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/db/setup.ts
[N-db]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/db/drizzle.ts
[N-seed]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/db/seed.ts
[N-schema]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/db/schema.ts
[N-queries]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/db/queries.ts
[N-session]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/auth/session.ts
[N-action-auth]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/auth/middleware.ts
[N-middleware]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/middleware.ts
[N-payments]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/payments/stripe.ts
[N-payment-actions]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/payments/actions.ts
[N-webhook]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/api/stripe/webhook/route.ts
[N-checkout]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/api/stripe/checkout/route.ts
[N-root]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/layout.tsx
[N-shell]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/(dashboard)/layout.tsx
[N-pricing]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/(dashboard)/pricing/page.tsx
[N-login]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/(login)/login.tsx
[N-actions]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/(login)/actions.ts
[N-dashboard]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/(dashboard)/dashboard/page.tsx
[N-css]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/app/globals.css
[N-migration]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/lib/db/migrations/0000_soft_the_anarchist.sql
[N-drizzle-config]: https://github.com/nextjs/saas-starter/blob/6e33e58b1e553a41fe22e6b941a7229a002de361/drizzle.config.ts
[M-license]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/LICENSE
[M-package]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/package.json
[M-readme]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/README.md
[M-workspace]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/pnpm-workspace.yaml
[M-web-package]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/package.json
[M-requirements]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/tooling/scripts/src/requirements.mjs
[M-dev]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/tooling/scripts/src/dev.mjs
[M-env]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/.env
[M-dev-env]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/.env.development
[M-supabase-config]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/supabase/config.toml
[M-migration]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/supabase/migrations/20241219010757_schema.sql
[M-seed]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/supabase/seed.sql
[M-app-config]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/config/app.config.ts
[M-auth-config]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/config/auth.config.ts
[M-flags]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/config/feature-flags.config.ts
[M-proxy]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/proxy.ts
[M-root]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/layout.tsx
[M-root-providers]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/components/root-providers.tsx
[M-auth-provider]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/components/auth-provider.tsx
[M-auth-listener]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/supabase/src/hooks/use-auth-change-listener.ts
[M-home-layout]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/home/layout.tsx
[M-home-page]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/home/page.tsx
[M-demo]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/home/_components/dashboard-demo.tsx
[M-settings]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/home/settings/page.tsx
[M-header-account]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/(marketing)/_components/site-header-account-section.tsx
[M-marketing]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/app/(marketing)/page.tsx
[M-require-user]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/supabase/src/require-user.ts
[M-action]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/next/src/actions/index.ts
[M-accounts-api]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/features/accounts/src/server/api.ts
[M-delete-service]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/features/accounts/src/server/services/delete-personal-account.service.ts
[M-server-client]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/supabase/src/clients/server-client.ts
[M-admin-client]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/supabase/src/clients/server-admin-client.ts
[M-keys]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/packages/supabase/src/get-supabase-client-keys.ts
[M-theme]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/styles/theme.css
[M-colors]: https://github.com/makerkit/nextjs-saas-starter-kit-lite/blob/c5cba64391a80620309c4178163dc2df42568d1b/apps/web/styles/shadcn-ui.css
[O-license]: https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/LICENSE
[O-spec]: https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/main.wasp.ts
[O-package]: https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/package.json
[O-blog]: https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/blog/package.json
[O-schema]: https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/schema.prisma
[O-env]: https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/.env.server.example
[O-payment]: https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/src/payment/payment.wasp.ts
[O-env-validation]: https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/src/env.ts
[O-email]: https://github.com/wasp-lang/open-saas/blob/7a97e012e4aefeef74cc26fe572b30ebc04a019d/template/app/src/server/emailSender.wasp.ts
