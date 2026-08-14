import { Check } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const done = [
  'ReAct 工具循环 + 流式输出',
  '子 Agent 编排（内置 + 自定义）',
  'Skills 技能市场',
  '长期记忆系统（user / feedback / project / reference）',
  'VIBE 沉浸模式（液态玻璃 UI）',
  'MD3 动态主题（浅色 / 深色 / 跟随系统）',
  '圆角窗口 + 自绘标题栏',
  '欢迎页引导',
  '长上下文自动压缩',
  'Token 用量追踪',
  '危险命令拦截',
  '文件修改自动备份',
  'Anthropic Prompt Caching（缓存命中率展示）',
  'AGENTS.md 项目指令（CLAUDE.md 兼容回退）',
  'WebUI 远程访问（随机 token / 局域网 / 服务器部署）',
  'Token 用量统计面板',
  '模型选择器按提供商分组可折叠',
  '中断按钮强制停止（主进程子进程跟踪）',
  '模型级高级设置（Temperature / 输入输出 token / 思考能力）',
  '思考档位体系（effort / budget / enable / glm / auto）',
  '技能商店 CocoLoop Hub（国内加速 / BSS 等级 / 下载量）',
  'Electron 42 网络工具修复（Node 22+ webSearch / webFetch）',
  '发布包含卸载器',
  'Apache 2.0 协议迁移',
];

export function Roadmap() {
  const { ref: headRef, revealed: headIn } = useReveal<HTMLDivElement>(0.1);
  const { ref: listRef, revealed: listIn } = useReveal<HTMLDivElement>(0.1);

  return (
    <section id="roadmap" className="border-t border-md3-outline-variant bg-md3-surface-container/40 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div
          ref={headRef}
          className={`mb-14 max-w-2xl transition-all duration-700 ease-md3-emphasized ${
            headIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="section-label mb-3">05 — Roadmap</div>
          <h2 className="text-4xl font-black tracking-tight text-md3-on-surface sm:text-5xl">已交付的版本</h2>
          <p className="mt-4 text-lg text-md3-on-surface-variant">
            v1.7.0 累计完成的能力项 —— 全部来自 release notes 与源码核对。
          </p>
        </div>

        <div
          ref={listRef}
          className={`card-filled p-8 sm:p-10 transition-all duration-700 ease-md3-emphasized ${
            listIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-md3-on-surface">
            <span className="grid h-8 w-8 place-items-center rounded-md3-md bg-md3-primary-container text-md3-on-primary-container">
              <Check size={16} strokeWidth={3} />
            </span>
            v1.7.0 已完成
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {done.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-md3-on-surface-variant">
                <Check size={16} className="mt-0.5 flex-none text-md3-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
