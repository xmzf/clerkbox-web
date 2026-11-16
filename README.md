# ClerkBox 官网

ClerkBox 4.0 的中英双语产品官网。使用 React 19、TypeScript 和 Vite，包含工作空间、VIBE 和消息撤回的本地交互演示，以及根据实际 GitHub Release 更新的下载区。

产品展示以桌面仓库的实际组件、主题变量和布局为依据。`public/product/` 中的 VIBE / 撤回配图由桌面端真实代码渲染，使用隔离的预设会话。官网交互使用本地样例状态；不会连接桌面 IPC、模型或工作文件。页面采用原生 CSS 滚动动画，支持减少动态效果，未支持滚动时间轴的浏览器保留完整静态布局。

成长时间轴从 2026 年 5 月立项讲起（由项目发起者补充），其余节点对应桌面仓库提交记录。中英故事文案位于 `src/content/story.ts`，日期与提交链接在 `src/components/Story.tsx` 中维护。

## 本地运行

使用 Node.js 20.19+ 或 22.12+：

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

默认地址为 http://127.0.0.1:5180/ 。演示使用预设内容，不调用模型、不上传资料，也不访问本地工作文件。中英文选择保存在浏览器中。

## 检查与构建

```sh
npm run build
npm run preview -- --host 127.0.0.1
```

构建依次执行全项目 TypeScript 检查、中英文翻译键与空值检查、Release 解析检查和生产打包，产物位于 `dist/`。也可单独运行 `npm run check:i18n` 和 `npm run check:releases`。

启动站点后运行 `npm run check:ui`，验证 VIBE、撤回、草稿、焦点、时间轴、下载失败与重试等浏览器行为。检查工具复用相邻桌面项目安装的 Electron；也可通过 `CLERKBOX_DESKTOP_PACKAGE` 指定桌面 `package.json`，通过 `SITE_TEST_URL` 指定测试地址（默认 `http://127.0.0.1:5180/`）。使用临时浏览器资料，不读取用户应用数据，报告写入系统临时目录。性能测量和棘轮命令见 `perf/bench/README.md`。

桌面样式、文案和图标可用 `node scripts/sync-desktop-demo.mjs <桌面仓库路径>` 重新生成。当前参考桌面提交 `d2546e4`，主题为深色 / classic、界面缩放 100%。生成产物随仓库提交，普通构建不依赖桌面源码。桌面 UI 原始组件由 XMZF Studio 以 Apache-2.0 发布，完整许可随站点保留于 `public/licenses/ClerkBox.txt`；网页适配使用隔离样例状态、原生网页对话框与离屏动画暂停。Lucide / Feather 图标许可保留在 `DesktopIcon.tsx` 中。

## 内容与下载

- `src/content/site.ts`：页面和 SEO 文案。
- `src/content/demo.ts`：交互演示文案。
- `src/content/download.ts`：下载和发布状态文案。
- `src/content/story.ts`：有提交记录可追溯的成长故事。
- `src/lib/releases.ts`：产品版本、官方仓库与下载资产校验。
- `src/styles/`：整站、产品演示和下载区样式。

新增文案时同时更新 `zh`、`en`。页面标题、描述和分享元数据随语言同步；无 JavaScript 时保留官方 Release 入口。

官网拉丁字体 Manrope 以 SIL Open Font License 随站点自托管；授权见 `public/fonts/OFL.txt`。桌面产品展示使用应用原始字体栈，不套用营销页字体。

下载区固定请求 `XMZF-vAI/clerkbox` 的 `v4.0.0` Release，只提供版本、架构和地址均校验通过的 4.0 官方 Windows、macOS 和 Linux 资产，不读取 latest 或回退到旧版本。4.0 尚未公开时显示待发布状态，网络失败或超时显示错误状态，均可重试并查看 4.0 源码构建指南；已公开但缺少某平台安装包时提供 4.0 发布页入口。发布对应安装包后，页面自动更新可用下载；以后升级主版本时同步修改 `src/lib/releases.ts` 的 `PRODUCT_VERSION` 与页面文案。

## 部署

将 `npm run build` 生成的 `dist/` 发布到静态站点托管服务。当前源码未指定托管平台或域名，资源以站点根路径 `/` 为基准。配置正式域名后，可将 `index.html` 中的分享图地址改为完整的 HTTPS URL，并补充 canonical；`public/social-card.png` 已提供 1200 × 630 分享图。

桌面应用源码及许可证见 [ClerkBox](https://github.com/XMZF-vAI/clerkbox)。
