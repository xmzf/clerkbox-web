import { Download, MessageCircle } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export function Footer() {
  const { ref: ctaRef, revealed: ctaIn } = useReveal<HTMLDivElement>(0.1);

  return (
    <footer className="relative overflow-hidden border-t border-md3-outline-variant bg-md3-surface px-6 pt-24 lg:px-10 lg:pt-32">
      <div className="mx-auto max-w-7xl">
        <div
          ref={ctaRef}
          className={`text-center transition-all duration-700 ease-md3-emphasized ${
            ctaIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="text-4xl font-black tracking-tight text-md3-on-surface sm:text-5xl lg:text-6xl">
            你的下一位工程师，<br className="hidden sm:block" />
            已经准备好了。
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-md3-on-surface-variant">
            免费 · 开源 · Apache 2.0 协议 —— 现在开始。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#download" className="btn-filled h-12 px-8 text-base">
              <Download size={18} /> 下载 ClerkBox
            </a>
            <a
              href="https://github.com/XMZF-vAI/clerkbox"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outlined h-12 px-8 text-base"
            >
              <GitHubIcon size={18} /> GitHub
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
          {[
            { label: 'Releases', href: 'https://github.com/XMZF-vAI/clerkbox/releases' },
            { label: 'Issues', href: 'https://github.com/XMZF-vAI/clerkbox/issues' },
            { label: 'Pull Requests', href: 'https://github.com/XMZF-vAI/clerkbox/pulls' },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="state-layer rounded-md3-full px-3 py-2 font-mono text-xs uppercase tracking-widest text-md3-on-surface-variant transition-colors hover:text-md3-primary"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>

      <div className="pointer-events-none mt-20 select-none overflow-hidden text-center">
        <span className="block text-[12vw] font-black leading-none tracking-tighter text-md3-primary/5">
          CLERKBOX
        </span>
      </div>

      <div className="border-t border-md3-outline-variant bg-md3-surface-variant/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 font-mono text-xs tracking-wide text-md3-on-surface-variant sm:flex-row lg:px-10">
          <span>© 2026 XMZF Studio · Apache License 2.0</span>
          <span className="flex items-center gap-2">
            <MessageCircle size={14} /> Made with care · Electron / React / MD3
          </span>
        </div>
      </div>
    </footer>
  );
}
