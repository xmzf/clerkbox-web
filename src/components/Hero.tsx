import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export function Hero() {
  const { ref: leftRef, revealed: leftIn } = useReveal<HTMLDivElement>(0.15);
  const { ref: rightRef, revealed: rightIn } = useReveal<HTMLDivElement>(0.1);

  return (
    <section id="top" className="relative overflow-hidden px-6 pb-16 pt-36 lg:px-10 lg:pt-44">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-md3-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-md3-tertiary/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div
          ref={leftRef}
          className={`transition-all duration-700 ease-md3-emphasized ${
            leftIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-md3-full bg-md3-primary-container px-4 py-1.5 text-xs font-medium text-md3-on-primary-container">
            <Sparkles size={14} />
            v1.7.0 · Apache 2.0 开源 · Windows
          </div>

          <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-md3-on-surface sm:text-6xl lg:text-7xl">
            ClerkBox
            <span className="mt-4 block text-3xl font-bold text-md3-on-surface-variant sm:text-4xl lg:text-5xl">
              把 AI 工程师装进你的桌面
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-md3-on-surface-variant">
            单一 AI Agent 桌面工作台。多模型对话、ReAct 工具循环、子 Agent 编排、Skills 技能市场、长期记忆与 VIBE 沉浸模式 —— 全部本地运行，数据不出本机。
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#download" className="btn-filled h-12 px-7 text-base">
              <Download size={18} />
              下载 Windows 版
              <ArrowRight size={16} />
            </a>
            <a
              href="https://github.com/XMZF-vAI/clerkbox"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outlined h-12 px-7 text-base"
            >
              <GitHubIcon size={18} />
              GitHub
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="chip !border-transparent bg-md3-surface-container">Electron 42</span>
            <span className="chip !border-transparent bg-md3-surface-container">React 19</span>
            <span className="chip !border-transparent bg-md3-surface-container">TypeScript 6</span>
            <span className="chip !border-transparent bg-md3-surface-container">Apache 2.0</span>
          </div>
        </div>

        <div
          ref={rightRef}
          className={`transition-all duration-700 delay-150 ease-md3-emphasized ${
            rightIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="mx-auto w-full max-w-[920px]">
            <img
              src="/hero-screenshot.png"
              alt="ClerkBox 主界面截图"
              className="block w-full select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
