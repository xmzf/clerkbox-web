import { Shield, Lock, FileCheck, Bug } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const tools = [
  'read_file', 'write_file', 'search_replace', 'list_dir',
  'search_files', 'search_content', 'web_search', 'web_fetch',
  'execute_command', 'spawn_agent', 'save_memory', 'search_memory',
];

const safety = [
  {
    icon: Bug,
    title: '危险命令拦截',
    desc: 'rm -rf、format、Stop-Computer 等黑名单命令执行前必须经你确认。',
  },
  {
    icon: FileCheck,
    title: '写入白名单与备份',
    desc: 'Plan 模式仅允许写入 .clerkbox/plan/；文件修改前自动创建 .clerkbox-bak。',
  },
  {
    icon: Lock,
    title: '路径与 URL 校验',
    desc: '文件操作限定在工作目录内；openExternal 仅放行 http / https。',
  },
  {
    icon: Shield,
    title: '沙箱隔离',
    desc: 'sandbox + contextIsolation 全开，nodeIntegration 关闭，最小权限原则。',
  },
];

export function Tools() {
  const { ref: headRef, revealed: headIn } = useReveal<HTMLDivElement>(0.1);
  const { ref: termRef, revealed: termIn } = useReveal<HTMLDivElement>(0.12);
  const { ref: listRef, revealed: listIn } = useReveal<HTMLDivElement>(0.12);

  return (
    <section id="tools" className="border-t border-md3-outline-variant bg-md3-surface px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div
          ref={headRef}
          className={`mb-14 max-w-2xl transition-all duration-700 ease-md3-emphasized ${
            headIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="section-label mb-3">03 — Tools &amp; Safety</div>
          <h2 className="text-4xl font-black tracking-tight text-md3-on-surface sm:text-5xl">工具系统与安全</h2>
          <p className="mt-4 text-lg text-md3-on-surface-variant">
            能做事，也知边界。每一次工具调用都在你的注视之下。
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          <div
            ref={termRef}
            className={`rounded-md3-xl border border-md3-outline-variant bg-md3-inverse text-md3-inverse-on-surface shadow-md3-3 lg:col-span-2 transition-all duration-700 ease-md3-emphasized ${
              termIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-md3-error/80" />
              <span className="h-3 w-3 rounded-full bg-md3-tertiary/80" />
              <span className="h-3 w-3 rounded-full bg-md3-secondary-container/80" />
              <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-white/50">Agent · ReAct Loop</span>
            </div>
            <div className="p-6 font-mono text-[13px] leading-7 sm:p-8 sm:text-sm">
              <p>
                <span className="text-md3-tertiary-container">❯</span>{' '}
                <span className="text-white">帮我重构 parseDate 函数</span>
              </p>
              <p className="text-md3-primary-container/90">→ thinking 分析函数职责与调用方…</p>
              <p className="text-md3-primary-container/90">→ read_file src/utils.ts</p>
              <p className="text-md3-primary-container/90">→ search_replace src/utils.ts ✓ 已备份</p>
              <p className="text-md3-primary-container/90">→ done</p>
              <p className="mt-3 text-white/60"># 任意时刻可按 [停止] 中止循环</p>
            </div>
          </div>

          <div
            ref={listRef}
            className={`flex flex-col gap-4 lg:col-span-3 transition-all duration-700 ease-md3-emphasized ${
              listIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {safety.map((item) => (
              <div key={item.title} className="card-filled flex items-start gap-4 p-5 sm:gap-5 sm:p-6">
                <div className="grid h-11 w-11 flex-none place-items-center rounded-md3-lg bg-md3-primary-container text-md3-on-primary-container shadow-md3-1">
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-md3-on-surface">{item.title}</h4>
                  <p className="mt-1 text-sm leading-6 text-md3-on-surface-variant">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <div className="mb-5 font-mono text-xs uppercase tracking-widest text-md3-on-surface-variant">
            12 Built-in Tools
          </div>
          <div className="flex flex-wrap gap-3">
            {tools.map((t) => (
              <span
                key={t}
                className="rounded-md3-md border border-md3-outline-variant bg-md3-surface px-4 py-2 font-mono text-xs text-md3-on-surface-variant shadow-md3-1 transition-all hover:-translate-y-0.5 hover:border-md3-primary/40 hover:text-md3-primary"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
