import { useEffect, useRef } from 'react';
import {
  Menu, Minus, Square, X, Sparkles, Store, MessageSquare,
  FolderOpen, Hammer, ChevronDown, Brain, Zap, Send, Globe, Settings,
} from 'lucide-react';

function Waves() {
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
      { varName: '--md-primary-rgb', alpha: 0.12, amp: 0.16, freq: 1.1, speed: 0.00042 },
      { varName: '--md-tertiary-rgb', alpha: 0.09, amp: 0.22, freq: 0.8, speed: -0.00031 },
      { varName: '--md-secondary-rgb', alpha: 0.06, amp: 0.3, freq: 0.6, speed: 0.00022 },
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
        const base = H * (0.42 + i * 0.16);
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

  return <canvas ref={canvasRef} className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 w-full" />;
}

export function AppWindow() {
  return (
    <div className="mx-auto w-full max-w-[860px]">
      <div className="flex h-[560px] overflow-hidden rounded-[12px] border border-md3-outline-variant/40 bg-md3-surface shadow-md3-4">
        {/* 侧边栏 —— 全高，真实结构：标题 / 按钮 / 会话 / 底部 WebUI+设置 */}
        <aside className="flex w-48 flex-none flex-col bg-md3-surface-variant/60">
          <div className="flex items-center gap-2.5 px-4 pb-3 pt-4">
            <img src="/icon.png" alt="" className="h-8 w-8 rounded-md3-sm object-contain" />
            <span className="text-[15px] font-bold tracking-wide text-md3-on-surface">ClerkBox</span>
          </div>

          <div className="flex flex-col gap-2 px-2.5">
            <button className="w-full rounded-md3-md bg-md3-surface px-3 py-2 text-[13px] text-md3-on-surface">
              新会话
            </button>
            <button className="flex w-full items-center justify-center gap-1.5 rounded-md3-md bg-md3-surface px-3 py-2 text-[13px] text-md3-on-surface">
              <Store size={14} /> 技能
            </button>
          </div>

          <div className="mt-3 px-2.5">
            <div className="flex items-center gap-2 rounded-md3-md bg-md3-secondary-container px-3 py-2 text-[12px] font-medium text-md3-on-secondary-container">
              <MessageSquare size={13} className="flex-none" />
              <span className="truncate">新会话</span>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex flex-col gap-0.5 border-t border-md3-outline-variant/20 px-2.5 py-2">
            <button className="flex items-center gap-2 rounded-md3-sm px-2.5 py-1.5 text-[12px] text-md3-on-surface-variant">
              <Globe size={14} /> 启动 WebUI
            </button>
            <button className="flex items-center gap-2 rounded-md3-sm px-2.5 py-1.5 text-[12px] text-md3-on-surface-variant">
              <Settings size={14} /> 设置
            </button>
          </div>
        </aside>

        {/* 主区列 */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* 标题栏 —— 只覆盖主区 */}
          <div className="flex h-11 flex-none items-center justify-between border-b border-md3-outline-variant/20 px-3">
            <div className="flex items-center gap-2.5">
              <Menu size={17} className="text-md3-on-surface" />
              <span className="rounded-md3-xs bg-md3-surface-variant px-1.5 py-0.5 text-[11px] text-md3-on-surface-variant">v1.7.0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-7 items-center gap-1 rounded-md3-sm bg-md3-tertiary-container/70 px-2 text-md3-on-tertiary-container">
                <Sparkles size={13} />
                <span className="text-[11px] font-semibold">VIBE</span>
              </span>
              <span className="flex h-7 items-center gap-1.5 rounded-md3-sm bg-md3-surface-variant px-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-md3-on-surface-variant">就绪</span>
              </span>
              <span className="grid h-7 w-8 place-items-center rounded-md3-sm text-md3-on-surface"><Minus size={15} /></span>
              <span className="grid h-7 w-8 place-items-center rounded-md3-sm text-md3-on-surface"><Square size={13} /></span>
              <span className="grid h-7 w-8 place-items-center rounded-md3-sm text-md3-on-surface"><X size={15} /></span>
            </div>
          </div>

          {/* Welcome 区 —— 图标+问候 与 输入框 左对齐居中 */}
          <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-10">
            <div className="w-full max-w-[560px]">
              <div className="mb-7 flex items-center gap-4">
                <img src="/new-chat-icon.png" alt="" className="h-12 w-12 rounded-md3-lg object-cover" />
                <span className="text-xl font-medium text-md3-on-surface">Hi there! How can I help you?</span>
              </div>

              <div className="flex flex-col gap-1.5 rounded-[24px] bg-md3-surface-variant/70 px-4 pb-2.5 pt-3.5">
                <span className="px-1 text-[13px] text-md3-on-surface-variant/70">在 my-app 中工作...</span>
                <div className="flex items-center gap-1">
                  <span className="grid h-8 w-8 place-items-center rounded-md3-sm text-md3-on-surface-variant"><FolderOpen size={15} /></span>
                  <span className="flex h-8 items-center gap-1 rounded-md3-sm bg-amber-500/15 px-2.5 text-[12px] font-medium text-amber-600">
                    <Hammer size={13} /> Craft <ChevronDown size={11} />
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-md3-sm text-md3-on-surface-variant"><Brain size={15} /></span>
                  <span className="flex h-8 items-center gap-1 rounded-md3-sm px-2 text-[12px] text-md3-on-surface-variant">
                    <Zap size={13} /> 技能 <ChevronDown size={11} />
                  </span>
                  <span className="flex h-8 items-center gap-1 rounded-md3-sm px-2 text-[12px] text-md3-on-surface-variant">
                    MiniMax-M3 <ChevronDown size={11} />
                  </span>
                  <span className="flex-1" />
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-md3-primary/70 text-md3-on-primary">
                    <Send size={15} />
                  </span>
                </div>
              </div>
            </div>

            <Waves />
          </div>
        </div>
      </div>
    </div>
  );
}
