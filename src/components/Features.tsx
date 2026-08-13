import {
  Layers, RefreshCw, Bot, Sparkles, Database, Music2,
} from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const features = [
  {
    icon: Layers,
    title: '多模型即插即用',
    en: 'Multi-Model',
    desc: '内置 DeepSeek、GPT-4o、Claude 3.5、通义千问、GLM-4 预设，支持任意 OpenAI 兼容端点，主 Agent 与子 Agent 可独立选择模型。',
    chips: ['自定义端点', '一键切换', '密钥加密'],
    span: 'lg:col-span-7',
  },
  {
    icon: RefreshCw,
    title: 'ReAct 工具循环',
    en: 'Reasoning + Acting',
    desc: '推理 → 工具调用 → 观察 → 再推理，最多 999 轮。流式输出，思考过程实时可见，危险命令自动拦截。',
    chips: ['流式', '可中止', '自动备份'],
    span: 'lg:col-span-5',
  },
  {
    icon: Bot,
    title: '子 Agent 编排',
    en: 'Sub-Agents',
    desc: '只读「侦察兵」与全工具「通用助手」内置可用，支持 frontmatter 自定义 Agent。独立上下文，仅回传总结。',
    chips: ['explore', 'general', '自定义'],
    span: 'lg:col-span-5',
  },
  {
    icon: Sparkles,
    title: 'Skills 技能市场',
    en: 'Skill Store',
    desc: '从社区市场一键安装提示词模板，自动从 GitHub 仓库拉取 SKILL.md，激活后注入 system prompt。',
    chips: ['一键安装', '自动注入', '热切换'],
    span: 'lg:col-span-7',
  },
  {
    icon: Database,
    title: '长期记忆',
    en: 'Long-term Memory',
    desc: 'user / feedback / project / reference 四类记忆，Markdown + frontmatter 索引，Agent 主动写入，跨会话延续理解。',
    chips: ['本地文件', 'frontmatter', '跨会话'],
    span: 'lg:col-span-6',
  },
  {
    icon: Music2,
    title: 'VIBE 沉浸模式',
    en: 'Vibe Mode',
    desc: '全屏背景、液态玻璃 UI、悬浮音乐播放器，一键进入无干扰专注环境，退出后普通界面完整保留。',
    chips: ['专注模式', '音乐播放', '配置持久化'],
    span: 'lg:col-span-6',
  },
];

function FeatureCard({
  feature, index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const { ref, revealed } = useReveal<HTMLDivElement>(0.12);
  const Icon = feature.icon;

  return (
    <div
      ref={ref}
      className={`card-elevated group flex flex-col gap-5 p-7 sm:p-8 ${feature.span} ${
        revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transition: 'opacity 600ms cubic-bezier(0.2,0,0,1), transform 600ms cubic-bezier(0.2,0,0,1)', transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-md3-lg bg-md3-primary-container text-md3-on-primary-container shadow-md3-1 transition-transform duration-md3-medium group-hover:scale-110">
        <Icon size={24} strokeWidth={1.8} />
      </div>
      <div>
        <div className="section-label mb-1">{feature.en}</div>
        <h3 className="text-2xl font-bold text-md3-on-surface">{feature.title}</h3>
      </div>
      <p className="flex-1 text-[15px] leading-7 text-md3-on-surface-variant">{feature.desc}</p>
      <div className="flex flex-wrap gap-2">
        {feature.chips.map((c) => (
          <span key={c} className="chip">{c}</span>
        ))}
      </div>
    </div>
  );
}

export function Features() {
  const { ref: headRef, revealed: headIn } = useReveal<HTMLDivElement>(0.1);

  return (
    <section id="features" className="px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div
          ref={headRef}
          className={`mb-14 max-w-2xl transition-all duration-700 ease-md3-emphasized ${
            headIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="section-label mb-3">01 — Capabilities</div>
          <h2 className="text-4xl font-black tracking-tight text-md3-on-surface sm:text-5xl">核心能力</h2>
          <p className="mt-4 text-lg text-md3-on-surface-variant">
            一个工作台，装下搜索、写作、编码、自动化与思考。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
