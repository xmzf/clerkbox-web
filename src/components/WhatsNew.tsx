import {
  Globe, FileCode2, Cpu, Globe2, Languages, BarChart3, ShieldAlert, Scale, Sparkles, Sliders, Plug,
} from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const highlights = [
  {
    icon: Cpu,
    title: 'Anthropic Prompt Caching',
    en: 'Cache',
    desc: '对 Anthropic 请求自动启用 Prompt Caching，静态系统提示前缀命中缓存；每条消息显示缓存写入 / 读取 token 与命中率。',
    chips: ['自动启用', '命中率展示', '成本优化'],
    accent: 'md3-primary',
  },
  {
    icon: FileCode2,
    title: 'AGENTS.md 项目指令',
    en: 'Project Rules',
    desc: '自动读取工作目录根目录的 AGENTS.md 注入系统提示词，遵循跨工具标准（OpenAI Codex / OpenCode / Qwen 原生支持），可回退 CLAUDE.md。',
    chips: ['AGENTS.md', 'CLAUDE.md 兼容', '完全可选'],
    accent: 'md3-tertiary',
  },
  {
    icon: Globe2,
    title: 'WebUI 远程访问',
    en: 'Remote Access',
    desc: '一键启动内置 Web 服务，把完整界面暴露给同一局域网内的任意浏览器。每次启动生成随机 token，服务器部署可设环境变量 CLERKBOX_WEBUI_AUTO=1 自动开启，与桌面端完全双向同步。',
    chips: ['随机 token', 'SSE 流式', '服务器部署'],
    accent: 'md3-secondary',
  },
  {
    icon: Languages,
    title: '国际化 i18n',
    en: 'i18n',
    desc: '中文 / English 运行时切换无需重启；侧边栏、设置、VIBE 控件、技能市场全量本地化。',
    chips: ['中 / 英', '热切换', '全量覆盖'],
    accent: 'md3-primary',
  },
  {
    icon: BarChart3,
    title: 'Token 用量统计',
    en: 'Token Usage',
    desc: '累计 API 调用次数、输入 / 输出 token、缓存写入 / 命中与命中率，独立的设置页统计面板。',
    chips: ['用量面板', '缓存命中', '成本可视化'],
    accent: 'md3-tertiary',
  },
  {
    icon: ShieldAlert,
    title: '中断按钮强制停止',
    en: 'Force Stop',
    desc: '主进程子进程跟踪与终止，按下中断立即停止所有正在执行的工具调用，不再有失控的循环。',
    chips: ['子进程跟踪', '立即生效', '无残留'],
    accent: 'md3-error',
  },
  {
    icon: Scale,
    title: 'Apache 2.0 协议迁移',
    en: 'License',
    desc: '从 MIT 切换到 Apache License 2.0，含明确的专利授权条款，衍生作品可灵活选择许可证。',
    chips: ['Apache 2.0', '专利授权', '更友好'],
    accent: 'md3-secondary',
  },
  {
    icon: Sliders,
    title: '模型级高级设置',
    en: 'Per-Model Config',
    desc: '每个模型可单独配置 Temperature、输入 / 输出 token 上限、思考能力；支持 effort / budget / enable / glm / auto 五种思考协议风格，按厂商预设自动推断。',
    chips: ['Temperature', 'Token 上限', '思考档位'],
    accent: 'md3-primary',
  },
  {
    icon: Plug,
    title: '技能商店 CocoLoop Hub',
    en: 'Skill Hub',
    desc: '技能商店迁移至 CocoLoop Hub（国内加速），含 BSS 等级、下载量、来源徽章。Windows zip 解压失败修复，安装一次到位。',
    chips: ['CocoLoop Hub', 'BSS 等级', '下载量'],
    accent: 'md3-tertiary',
  },
  {
    icon: Globe,
    title: '模型选择器按提供商分组',
    en: 'Model Picker',
    desc: 'DeepSeek / OpenAI / Anthropic / 通义千问 / GLM 按提供商分组可折叠，配置管理更清爽。',
    chips: ['分组可折叠', '一键切换', '主/子 Agent 独立'],
    accent: 'md3-primary',
  },
];

function HighlightCard({ item, index }: { item: (typeof highlights)[number]; index: number }) {
  const { ref, revealed } = useReveal<HTMLDivElement>(0.1);
  const Icon = item.icon;
  return (
    <div
      ref={ref}
      className={`card-elevated group relative flex flex-col gap-4 overflow-hidden p-6 transition-all duration-700 ease-md3-emphasized sm:p-7 ${
        revealed ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-${item.accent}/15 blur-2xl transition-opacity duration-500 group-hover:opacity-100`} />
      <div className={`relative flex h-11 w-11 items-center justify-center rounded-md3-lg bg-${item.accent}-container text-${item.accent === 'md3-error' ? 'md3-on-error-container' : `on-${item.accent.split('-')[1]}-container`} shadow-md3-1`}>
        <Icon size={22} strokeWidth={1.8} />
      </div>
      <div className="relative">
        <div className="section-label mb-1">{item.en}</div>
        <h3 className="text-lg font-bold text-md3-on-surface">{item.title}</h3>
      </div>
      <p className="relative flex-1 text-sm leading-6 text-md3-on-surface-variant">{item.desc}</p>
      <div className="relative flex flex-wrap gap-1.5">
        {item.chips.map((c) => (
          <span key={c} className="chip text-[11px]">{c}</span>
        ))}
      </div>
    </div>
  );
}

export function WhatsNew() {
  const { ref: headRef, revealed: headIn } = useReveal<HTMLDivElement>(0.1);

  return (
    <section id="whats-new" className="border-t border-md3-outline-variant bg-md3-surface px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div
          ref={headRef}
          className={`mb-12 flex flex-col gap-3 transition-all duration-700 ease-md3-emphasized sm:flex-row sm:items-end sm:justify-between ${
            headIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div>
            <div className="section-label mb-3">00 — What's New in v1.7.0</div>
            <h2 className="text-4xl font-black tracking-tight text-md3-on-surface sm:text-5xl">
              这一版带来了什么
            </h2>
            <p className="mt-3 max-w-xl text-base text-md3-on-surface-variant">
              v1.6 → v1.7 是一次厚实的工程升级 —— 10 项关键改进，覆盖从成本到协作、从协议到远程访问。
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-md3-full bg-md3-primary-container px-4 py-1.5 text-xs font-medium text-md3-on-primary-container sm:self-end">
            <Sparkles size={14} />
            10 项升级 · Apache 2.0
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h, i) => (
            <HighlightCard key={h.title} item={h} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
