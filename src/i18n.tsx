import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'zh' | 'en'

/**
 * 全站双语字典。结构即语义：t('hero.sub') 按点号路径取值。
 * mock.* 键是应用界面复刻里的 UI 文案，与 ClerkBox 实际 i18n 键保持同义。
 */
const dict = {
  zh: {
    meta: { title: 'ClerkBox — 本地优先的 AI 桌面工作台' },
    header: {
      navFeatures: '核心能力',
      navLunora: 'Lunora 额度',
      navDownload: '下载',
      cta: '免费下载',
      github: 'GitHub 仓库',
    },
    ann: '🎉 ClerkBox 2.5 正式发布 —— harness 兼容模式 · 工作台面板 · VIBE 沉浸模式',
    hero: {
      h1a: '简单、可靠、',
      h1b: '本地优先。',
      sub: 'ClerkBox 是本地优先的 AI 桌面工作台：多供应商对话、ReAct 工具循环、子 Agent 与技能市场，把搜索、写作、编码与自动化放进同一个窗口，数据全程留在你的电脑上。',
      cta: '立即下载 ClerkBox',
      ctaFor: '适用于 Windows 11',
      allDownloads: '查看全部下载',
    },
    mock: {
      newChat: '新会话',
      skills: '插件市场',
      taskList: '任务列表',
      settings: '设置',
      webui: '启动 WebUI',
      signedOut: '未登录',
      working: 'AI 正在工作中',
      groupA: 'clerkbox-website',
      groupB: 'gomoku-ai',
      groupC: 'release-bot',
      t1: '为 ClerkBox 设计官网首页',
      t2: '优化 Hero 视觉与动效',
      t3: '整理开局提示、回合状态',
      t4: '发布 v2.5.0 更新日志',
      user1: '帮 ClerkBox 做一个官网首页：深色风格、响应式，重点展示核心能力和下载入口',
      timeAt: '19:41',
      thought: '思考了 8 秒',
      msgA: '我先搜一下 README 里的产品亮点，确定首页要展示什么，再动手搭页面。',
      toolW: '写入 96 行',
      toolC: '执行命令',
      toolS: '搜索内容',
      stream: '首页骨架已经能跑起来了：Hero、核心能力、下载区三段式布局完成，响应式也适配了。接下来补齐中英文案和下载链接，然后跑一次全量检查',
      agentPhase: '正在回复',
      goalTitle: '目标模式',
      goalPill: '进行中',
      goalCond: '官网首页交付并构建通过',
      goalMeta: '已评估 2 次 · 已运行 6 分钟 · 最近检查：构建通过，还差文案与双语切换',
      goalHint: '每轮回复后由独立评估器检查目标，未完成则自动续跑',
      workdir: 'D:\\www\\clerkbox-website',
      inputPh: '输入指令，按 Enter 发送...',
      harnessName: '默认模式',
      harnessDesc: 'ClerkBox 内置 harness',
      approval: '自动',
      tier: 'high',
      model: 'gpt-5.6-sol',
      thinkBody: '用户要的是产品官网：需要 Hero、核心能力、下载三段式结构。视觉沿用应用的 MD3 深色主题，先从 README 提炼卖点，再分文件落地。',
      disclaimer: 'ClerkBox 可能会产生错误信息，请核实重要内容',
      attachAria: '添加图片或文件',
      cmdMenuAria: '打开命令菜单',
      sendAria: '发送消息',
      tabFiles: '文件',
      tabTerminal: '终端',
      tabBrowser: '浏览器',
      tabSubagent: '子Agent',
      previewEmpty: '选择左侧文件进行预览',
      paramsLabel: '参数',
      thinkingProcess: '思考过程',
      exploreDesc: '扫描 src/components，定位样式 token',
      generalDesc: '12 个文件已汇总回主对话',
      subWorking: '执行中',
      subDone: '已完成',
    },
    features: {
      label: '核心能力',
      title: '一个工作台，装下全部 AI 工作流',
      sub: '从一次提问到一次完整交付，ClerkBox 把 Agent 需要的一切都放在本地同一个面板里。',
      f1t: '22 家供应商预设',
      f1d: 'Lunora、OpenAI、Anthropic、Gemini、DeepSeek、GLM、Ollama 等开箱即用；模型目录在线拉取，永远不会过期。',
      f2t: 'ReAct 工具循环',
      f2d: '推理 → 工具 → 观察 → 再推理，最多 999 轮自主执行；危险命令自动拦截确认，文件写入先备份。',
      f3t: '子 Agent 编排',
      f3d: '侦察兵与通用助手在独立上下文里执行复杂任务，只把最终结论带回主对话，上下文不被污染。',
      f4t: '技能市场',
      f4d: '一键安装社区提示词模板，自动注入 system prompt，随时给 Agent 学会新本领。',
      f5t: 'VIBE 沉浸模式',
      f5d: '全屏氛围背景、液态玻璃 UI 与悬浮音乐播放器，把深夜写码变成一种氛围。',
      f6t: 'MD3 动态主题',
      f6d: 'Material Design 3 色彩引擎，深浅色与种子色随心换 —— 你正在看的这个官网就由它驱动。',
      f7t: 'harness 兼容模式',
      f7d: '内置 Codex / Grok Build / dsh 官方 harness 适配，一键对齐各家官方形态，兼容驱动也能发挥模型的全部实力。',
      f8t: '目标模式',
      f8d: '给 Agent 一个目标而不是一串指令：独立评估器逐轮检查完成度，未达标自动续跑，直到交付为止。',
      f8meta: '已评估 2 次 · 未达标自动续跑',
    },
    lunora: {
      label: 'Lunora API',
      title: '用 Lunora 额度驱动 ClerkBox',
      sub: 'ClerkBox 内置 Lunora 供应商预设 —— 一个 Key 调用 GPT / Claude / Gemini 等主流模型，注册即领 $10 体验额度。',
      c1t: '体验额度先测试',
      c1d: '注册后先用 $10 体验额度验证连通性、速度与输出效果，再决定是否投入。',
      c2t: '按倍率计费透明',
      c2d: '官方参考价 × 分组倍率，充值按需，用多少算多少，没有订阅绑定。',
      c3t: '记录可查可返利',
      c3d: '余额、用量、充值与邀请返利记录全程可追溯，长期使用更安心。',
      tableTitle: '价格对照（示例）',
      tableUnit: '单位：美元 / 1M tokens',
      colModel: '模型',
      colOfficial: '官方参考价',
      colLunora: 'Lunora 展示价',
      rowSolTag: '官网同款',
      rowIn: '输入',
      rowOut: '输出',
      tableNote: '完整价格表与分组倍率以 Lunora 官网为准。',
      s1t: '注册并验证',
      s1d: '领取 $10 体验额度',
      s2t: '创建 API Key',
      s2d: '控制台生成密钥',
      s3t: 'ClerkBox 一键填入',
      s3d: '内置 Lunora 预设',
      cta: '注册领取 $10 体验额度',
      ctaNote: '注册即得，无需绑卡',
    },
    download: {
      title: '全部下载',
      sub: '桌面安装包、源码构建与远程访问，任你选择。',
      winTitle: 'Windows 11（64 位）',
      winRow1: '安装包（64 位）',
      winRow2: '历史版本与更新日志',
      srcTitle: '从源码构建',
      srcRow1: 'git clone https://github.com/XMZF-vAI/clerkbox.git',
      srcRow2: 'npm install → npm run dev',
      webuiTitle: 'WebUI 远程访问',
      webuiDesc: '内置 Web 服务，把完整界面暴露给任意浏览器：默认仅本机访问，可一键开启局域网并扫码直达，桌面端与网页端实时同步。',
      getVersion: 'v2.5.0',
      go: '前往',
    },
    footer: {
      rights: '© 2026 XMZF Studio · Apache-2.0 License',
      repo: 'GitHub 仓库',
      lunora: 'Lunora API',
      studio: 'XMZF Studio',
    },
  },
  en: {
    meta: { title: 'ClerkBox — Local-first AI Desktop Workbench' },
    header: {
      navFeatures: 'Capabilities',
      navLunora: 'Lunora Credit',
      navDownload: 'Download',
      cta: 'Free Download',
      github: 'GitHub repo',
    },
    ann: '🎉 ClerkBox 2.5 is out — Harness compat modes · Workbench panel · VIBE immersive mode',
    hero: {
      h1a: 'Simple. Reliable. ',
      h1b: 'Local-first.',
      sub: 'ClerkBox is a local-first AI desktop workbench: multi-provider chat, a ReAct tool loop, sub-agents and a skills marketplace — search, writing, coding and automation in one window, with your data never leaving your machine.',
      cta: 'Download ClerkBox',
      ctaFor: 'For Windows 11',
      allDownloads: 'See all downloads',
    },
    mock: {
      newChat: 'New chat',
      skills: 'Plugin Market',
      taskList: 'Tasks',
      settings: 'Settings',
      webui: 'Start WebUI',
      signedOut: 'Not signed in',
      working: 'Agent is working',
      groupA: 'clerkbox-website',
      groupB: 'gomoku-ai',
      groupC: 'release-bot',
      t1: 'Design the ClerkBox homepage',
      t2: 'Polish hero visuals & motion',
      t3: 'Clean up opening hints & turns',
      t4: 'Draft v2.5.0 release notes',
      user1: 'Build a homepage for ClerkBox: dark theme, responsive, highlighting the core features and download entry',
      timeAt: '19:41',
      thought: 'Thought for 8s',
      msgA: 'Let me search the README for product highlights first, then start building the page.',
      toolW: 'Wrote 96 lines',
      toolC: 'Run command',
      toolS: 'Search content',
      stream: 'The homepage skeleton is up: hero, features and download sections done, responsive too. Next: bilingual copy and download links, then a full check',
      agentPhase: 'Responding',
      goalTitle: 'Goal mode',
      goalPill: 'Running',
      goalCond: 'Ship the homepage with a passing build',
      goalMeta: '2 evaluations · running 6 min · last check: build passed, copy & bilingual left',
      goalHint: 'An evaluator checks the goal after each turn and auto-continues until done',
      workdir: 'D:\\www\\clerkbox-website',
      inputPh: 'Type a command, press Enter to send...',
      harnessName: 'Default mode',
      harnessDesc: 'ClerkBox built-in harness',
      approval: 'Auto',
      tier: 'high',
      model: 'gpt-5.6-sol',
      thinkBody: 'The user wants a product homepage: hero, features and download sections. Reuse the app MD3 dark theme, distill highlights from the README first, then implement file by file.',
      disclaimer: 'ClerkBox can make mistakes. Verify important info.',
      attachAria: 'Attach images or files',
      cmdMenuAria: 'Open command menu',
      sendAria: 'Send message',
      tabFiles: 'Files',
      tabTerminal: 'Terminal',
      tabBrowser: 'Browser',
      tabSubagent: 'Sub-Agents',
      previewEmpty: 'Select a file on the left to preview',
      paramsLabel: 'Params',
      thinkingProcess: 'Thinking',
      exploreDesc: 'Scanning src/components for style tokens',
      generalDesc: '12 files summarized back to the main thread',
      subWorking: 'Running',
      subDone: 'Done',
    },
    features: {
      label: 'Capabilities',
      title: 'One workbench for your entire AI workflow',
      sub: 'From a single question to a full delivery, ClerkBox keeps everything an agent needs in one local panel.',
      f1t: '22 provider presets',
      f1d: 'Lunora, OpenAI, Anthropic, Gemini, DeepSeek, GLM, Ollama and more, out of the box; model lists are fetched live so they never go stale.',
      f2t: 'ReAct tool loop',
      f2d: 'Reason, act, observe, repeat — up to 999 autonomous turns, with dangerous commands gated and file writes backed up first.',
      f3t: 'Sub-agent orchestration',
      f3d: 'Scouts and general agents run complex tasks in isolated contexts and report only their conclusions back to the main thread.',
      f4t: 'Skills marketplace',
      f4d: 'Install community prompt templates in one click, injected automatically into the system prompt.',
      f5t: 'VIBE immersive mode',
      f5d: 'Fullscreen ambience, liquid-glass UI and a floating music player — late-night coding, but with a vibe.',
      f6t: 'MD3 dynamic theming',
      f6d: 'A Material Design 3 color engine with light/dark and seed colors — this very site is powered by it.',
      f7t: 'Harness compat modes',
      f7d: "Built-in Codex / Grok Build / dsh official-harness presets align with each vendor's native form factor, so compatible models still perform at their best.",
      f8t: 'Goal mode',
      f8d: 'Give the agent a goal instead of a checklist: an independent evaluator scores every turn and auto-continues until the work ships.',
      f8meta: '2 evaluations · auto-continues',
    },
    lunora: {
      label: 'Lunora API',
      title: 'Power ClerkBox with Lunora credit',
      sub: 'ClerkBox ships with a Lunora provider preset — one key for GPT / Claude / Gemini and more. New accounts get $10 in free credit.',
      c1t: 'Test with free credit',
      c1d: 'Use the $10 trial credit to verify connectivity, latency and output quality before committing.',
      c2t: 'Transparent multiplier pricing',
      c2d: 'Public reference price × group multiplier. Top up on demand and pay per token — no subscription lock-in.',
      c3t: 'Auditable records & rebates',
      c3d: 'Balance, usage, top-ups and invite rebates are fully traceable for peace of mind.',
      tableTitle: 'Price comparison (examples)',
      tableUnit: 'USD per 1M tokens',
      colModel: 'Model',
      colOfficial: 'Official reference',
      colLunora: 'Lunora price',
      rowSolTag: 'As in the demo',
      rowIn: 'in',
      rowOut: 'out',
      tableNote: 'See the Lunora site for the full price list and multipliers.',
      s1t: 'Register & verify',
      s1d: 'Claim the $10 credit',
      s2t: 'Create an API key',
      s2d: 'Generate it in the console',
      s3t: 'One-click preset',
      s3d: 'Built into ClerkBox',
      cta: 'Claim $10 free credit',
      ctaNote: 'Free on sign-up, no card required',
    },
    download: {
      title: 'All downloads',
      sub: 'Desktop installer, build from source or remote access — pick your way.',
      winTitle: 'Windows 11 (64-bit)',
      winRow1: 'Installer (64-bit)',
      winRow2: 'Release history & notes',
      srcTitle: 'Build from source',
      srcRow1: 'git clone https://github.com/XMZF-vAI/clerkbox.git',
      srcRow2: 'npm install → npm run dev',
      webuiTitle: 'WebUI remote access',
      webuiDesc: 'A built-in web server exposes the full UI to any browser: local-only by default, one click to open LAN access with a QR code, desktop and web stay in sync.',
      getVersion: 'v2.5.0',
      go: 'Go',
    },
    footer: {
      rights: '© 2026 XMZF Studio · Apache-2.0 License',
      repo: 'GitHub repo',
      lunora: 'Lunora API',
      studio: 'XMZF Studio',
    },
  },
} as const

function resolve(obj: unknown, path: string): string {
  const parts = path.split('.')
  let cur: unknown = obj
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p]
    } else {
      return path
    }
  }
  return typeof cur === 'string' ? cur : path
}

interface I18nCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (path: string) => string
}

const Ctx = createContext<I18nCtx | null>(null)

const LANG_KEY = 'clerkbox-site-lang'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY)
      if (saved === 'zh' || saved === 'en') return saved
    } catch {
      /* 隐私模式等场景下读取失败，回落中文 */
    }
    return 'zh'
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {
      /* 写入失败不影响本次会话 */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    document.title = resolve(dict[lang], 'meta.title')
  }, [lang])

  const t = useCallback((path: string) => resolve(dict[lang], path), [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
