import { useEffect, useRef } from 'react';
import {
  MessageSquare, Sparkles, Send, Brain, Zap,
  FolderOpen, ChevronDown, Wrench, FileText,
} from 'lucide-react';

export function AppWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, raf = 0, running = true;

    const layers = [
      { varName: '--md-primary-rgb', alpha: 0.12, amp: 0.14, freq: 1.1, speed: 0.00042 },
      { varName: '--md-tertiary-rgb', alpha: 0.09, amp: 0.20, freq: 0.8, speed: -0.00031 },
      { varName: '--md-secondary-rgb', alpha: 0.06, amp: 0.28, freq: 0.6, speed: 0.00022 },
    ];

    const readColor = (name: string) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || '128 128 128';
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      layers.forEach((L, i) => {
        const parts = readColor(L.varName).split(' ');
        const r = parts[0] || '128', g = parts[1] || '128', b = parts[2] || '128';
        const base = H * (0.35 + i * 0.14);
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 3) {
          const y = base
            + Math.sin((x / W) * Math.PI * 2 * L.freq + t * L.speed + i * 1.7) * H * L.amp
            + Math.sin((x / W) * Math.PI * 2 * L.freq * 2.3 + t * L.speed * 1.5) * H * L.amp * 0.35;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H); ctx.closePath();
        ctx.fillStyle = `rgba(${r},${g},${b},${L.alpha})`;
        ctx.fill();
      });
      if (running && !reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(draw); }
      else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0 });
    io.observe(canvas);
    raf = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(raf); window.removeEventListener('resize', resize); io.disconnect(); };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <div className="overflow-hidden rounded-[12px] border border-md3-outline-variant/30 bg-md3-surface shadow-md3-4">
        {/* TitleBar */}
        <div className="flex h-11 items-center gap-2 border-b border-md3-outline-variant/15 bg-md3-surface/80 px-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="" className="h-5 w-5 rounded" />
            <span className="text-sm font-medium text-md3-on-surface">ClerkBox</span>
            <span className="rounded-md3-xs bg-md3-surface-container px-1.5 py-0.5 text-[10px] text-md3-on-surface-variant">v1.6.0</span>
          </div>
          <span className="flex-1" />
          <span className="mr-2 inline-flex h-7 items-center gap-1 rounded-md3-sm bg-md3-tertiary/15 px-2 text-md3-tertiary">
            <Sparkles size={14} />
            <span className="text-xs font-medium">VIBE</span>
          </span>
          <span className="hidden items-center gap-1.5 rounded-md3-sm px-2 py-1 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-md3-on-surface-variant">就绪</span>
          </span>
          <span className="grid h-7 w-7 place-items-center rounded text-md3-on-surface-variant hover:bg-md3-surface-container">─</span>
          <span className="grid h-7 w-7 place-items-center rounded text-md3-on-surface-variant hover:bg-md3-surface-container">□</span>
          <span className="grid h-7 w-7 place-items-center rounded hover:bg-md3-error/20 hover:text-md3-error">✕</span>
        </div>

        <div className="flex h-[420px]">
          {/* Sidebar */}
          <div className="hidden w-52 flex-col border-r border-md3-outline-variant/15 bg-md3-surface-container/60 md:flex">
            <div className="flex gap-1.5 px-3 pt-3 pb-2">
              <button className="flex flex-1 items-center justify-center gap-1 rounded-md3-md bg-md3-surface-container-high px-2 py-1.5 text-[11px] font-medium text-md3-on-surface hover:bg-md3-surface-container">
                <MessageSquare size={12} /> 新会话
              </button>
              <button className="flex flex-1 items-center justify-center gap-1 rounded-md3-md bg-md3-surface-container-high px-2 py-1.5 text-[11px] font-medium text-md3-on-surface-variant hover:bg-md3-surface-container">
                <Zap size={12} /> 技能
              </button>
            </div>
            <div className="px-3 pb-2">
              <div className="flex items-center gap-1.5 rounded-md3-sm bg-md3-warning/15 px-2 py-1.5 text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-md3-warning" />
                <span className="font-medium text-md3-warning">Craft</span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden px-2">
              <div className="flex items-center gap-2 rounded-full bg-md3-secondary-container px-3 py-1.5 text-[11px] font-medium text-md3-on-secondary-container">
                <MessageSquare size={12} className="flex-none" />
                <span className="truncate">重构 utils</span>
              </div>
              <div className="mt-1 flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] text-md3-on-surface-variant hover:bg-md3-surface-container">
                <MessageSquare size={12} className="flex-none" />
                <span className="truncate">依赖结构分析</span>
              </div>
              <div className="mt-1 flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] text-md3-on-surface-variant hover:bg-md3-surface-container">
                <MessageSquare size={12} className="flex-none" />
                <span className="truncate">周报初稿</span>
              </div>
            </div>
          </div>

          {/* 聊天区 */}
          <div className="relative flex min-w-0 flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 py-4">
              <div className="flex justify-end">
                <div className="max-w-[88%] rounded-md3-md bg-md3-primary-container px-3 py-2 text-xs leading-relaxed text-md3-on-primary-container">
                  帮我重构 src/utils.ts 里的 parseDate 函数
                </div>
              </div>
              <div className="flex justify-start">
                <div className="flex w-full max-w-[92%] flex-col gap-1.5">
                  <div className="flex items-center gap-1 py-0.5">
                    <span className="text-[11px] font-medium text-md3-on-surface-variant/60">Thought for 3s</span>
                    <ChevronDown size={11} className="text-md3-on-surface-variant/40" />
                  </div>
                  <div className="overflow-hidden rounded-md3-xs border border-md3-outline-variant/15 bg-md3-surface-container/40">
                    <div className="flex items-center gap-2 px-2.5 py-1 text-[10px]">
                      <FileText size={11} className="text-md3-primary" />
                      <span className="font-medium text-md3-on-surface">read_file</span>
                      <span className="truncate text-md3-on-surface-variant">src/utils.ts</span>
                      <span className="rounded-md3-xs bg-emerald-500/15 px-1 py-0.5 text-[9px] text-emerald-600">完成</span>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-md3-xs border border-md3-outline-variant/15 bg-md3-surface-container/40">
                    <div className="flex items-center gap-2 px-2.5 py-1 text-[10px]">
                      <Wrench size={11} className="text-md3-primary" />
                      <span className="font-medium text-md3-on-surface">search_replace</span>
                      <span className="rounded-md3-xs bg-emerald-500/15 px-1 py-0.5 text-[9px] text-emerald-600">完成</span>
                    </div>
                  </div>
                  <div className="rounded-md3-md bg-md3-surface-container-high px-3 py-2 text-xs leading-relaxed text-md3-on-surface">
                    重构完成 — 拆分职责、补充类型。<span className="text-md3-primary">parseDate</span> 只负责解析，校验移至 <span className="text-md3-primary">validateDate</span>。
                  </div>
                </div>
              </div>
            </div>

            <canvas ref={canvasRef} className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 w-full [mask-image:linear-gradient(to_top,black_55%,transparent)]" />

            {/* 输入区 */}
            <div className="relative z-10 border-t border-md3-outline-variant/15 bg-md3-surface/90 px-3 py-2.5 backdrop-blur-sm">
              <div className="mb-1 flex items-center gap-1 text-[10px] text-md3-on-surface-variant/50">
                <FolderOpen size={10} /> d:\projects\my-app
              </div>
              <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-[24px] border border-md3-outline-variant/10 bg-md3-surface-container-high px-4 py-2 focus-within:border-md3-primary/30">
                <textarea
                  className="min-h-[18px] flex-1 resize-none bg-transparent text-xs text-md3-on-surface outline-none"
                  defaultValue="输入指令…"
                  rows={1}
                />
              </div>
              <div className="mx-auto mt-1.5 flex max-w-3xl items-center gap-1">
                <button className="grid h-7 w-7 place-items-center rounded-md3-sm text-md3-on-surface-variant hover:bg-md3-surface-container">
                  <FolderOpen size={13} />
                </button>
                <button className="inline-flex h-7 items-center gap-1 rounded-md3-sm bg-md3-warning/15 px-2 text-[10px] text-md3-warning">
                  Craft
                </button>
                <button className="grid h-7 w-7 place-items-center rounded-md3-sm text-md3-on-surface-variant hover:bg-md3-surface-container">
                  <Brain size={14} />
                </button>
                <button className="grid h-7 w-7 place-items-center rounded-md3-sm text-md3-on-surface-variant hover:bg-md3-surface-container">
                  <Zap size={14} />
                </button>
                <button className="inline-flex h-7 items-center gap-1 rounded-md3-sm px-2 text-[10px] text-md3-on-surface-variant hover:bg-md3-surface-container">
                  deepseek-chat <ChevronDown size={10} />
                </button>
                <span className="flex-1" />
                <button className="grid h-8 w-8 place-items-center rounded-full bg-md3-primary text-md3-on-primary hover:bg-md3-primary/90">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
