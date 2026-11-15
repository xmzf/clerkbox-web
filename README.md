# ClerkBox 官网

ClerkBox 4.0 的中英双语产品官网。使用 React 19、TypeScript 和 Vite，包含工作空间、VIBE 和消息撤回的本地交互演示，以及根据实际 GitHub Release 更新的下载区。

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

## 内容与下载

- `src/content/site.ts`：页面和 SEO 文案。
- `src/content/demo.ts`：交互演示文案。
- `src/content/download.ts`：下载和发布状态文案。
- `src/lib/releases.ts`：产品版本、官方仓库与下载资产校验。
- `src/styles/`：整站、产品演示和下载区样式。

新增文案时同时更新 `zh`、`en`。页面标题、描述和分享元数据随语言同步；无 JavaScript 时保留官方 Release 入口。

下载区在浏览器请求 `XMZF-vAI/clerkbox` 的最新公开稳定 Release，只提供该版本中校验通过的官方 Windows、macOS 和 Linux 资产。产品介绍版本与公开下载版本分别展示；缺少安装包、API 不可用或请求超时均提供 Release 页面入口，失败后可重试。发布新版应用时不需要在页面中手写安装包链接。

## 部署

将 `npm run build` 生成的 `dist/` 发布到静态站点托管服务。当前源码未指定托管平台或域名，资源以站点根路径 `/` 为基准。配置正式域名后，可将 `index.html` 中的分享图地址改为完整的 HTTPS URL，并补充 canonical；`public/social-card.png` 已提供 1200 × 630 分享图。

桌面应用源码及许可证见 [ClerkBox](https://github.com/XMZF-vAI/clerkbox)。
