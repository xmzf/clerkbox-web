import { Check, Circle } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const done = [
  'ReAct 工具循环 + 流式输出',
  '子 Agent 编排（内置 + 自定义）',
  'Skills 技能市场',
  '长期记忆系统',
  'VIBE 沉浸模式',
  'MD3 动态主题',
  '圆角窗口 + 自绘标题栏',
  '欢迎页引导',
  '长上下文自动压缩',
  'Token 用量追踪',
  '危险命令拦截',
  '文件修改自动备份',
  'Anthropic Prompt Caching（缓存命中率展示）',
  'AGENTS.md 项目指令（跨工具标准，CLAUDE.md 兼容回退）',
  'WebUI 远程访问（浏览器操控 + token 认证）',
  '国际化 i18n（中英运行时切换）',
  'Token 用量统计面板（含 TokenUsageStats）',
  '模型选择器按提供商分组可折叠',
  '中断按钮强制停止（主进程子进程跟踪）',
  'Apache 2.0 协议迁移（含专利授权）',
];

const todo = [
  '会话分支（Fork）',
  '消息编辑重发',
  '多模型并行对比',
  '工具调用回放',
  '子 Agent 工作流可视化',
  '流式断点续传',
  '会话导出（MD / JSON / PDF）',
  '跨会话全文搜索（SQLite FTS5）',
  'Prompt 模板与变量系统',
  '子 Agent 并行执行',
  'Skills 评分与评论',
  'Skills 本地签名校验',
  '命令面板（Ctrl+K）',
  '多窗口多会话',
  'Token 用量仪表盘',
  'macOS / Linux 支持',
];

export function Roadmap() {
  const { ref: headRef, revealed: headIn } = useReveal<HTMLDivElement>(0.1);
  const { ref: gridRef, revealed: gridIn } = useReveal<HTMLDivElement>(0.1);

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
          <h2 className="text-4xl font-black tracking-tight text-md3-on-surface sm:text-5xl">路线图</h2>
          <p className="mt-4 text-lg text-md3-on-surface-variant">
            已交付的扎实，与正在路上的野心。
          </p>
        </div>

        <div
          ref={gridRef}
          className={`grid gap-8 lg:grid-cols-2 transition-all duration-700 ease-md3-emphasized ${
            gridIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="card-filled p-8 sm:p-10">
            <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-md3-on-surface">
              <span className="grid h-8 w-8 place-items-center rounded-md3-md bg-md3-primary-container text-md3-on-primary-container">
                <Check size={16} strokeWidth={3} />
              </span>
              v1.7.0 已完成
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {done.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-md3-on-surface-variant">
                  <Check size={16} className="mt-0.5 flex-none text-md3-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-elevated p-8 sm:p-10">
            <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-md3-on-surface">
              <span className="grid h-8 w-8 place-items-center rounded-md3-md bg-md3-tertiary-container text-md3-on-tertiary-container">
                <Circle size={14} fill="currentColor" />
              </span>
              v1.8+ 计划中
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {todo.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-md3-on-surface-variant">
                  <Circle size={8} className="mt-1.5 flex-none text-md3-tertiary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
