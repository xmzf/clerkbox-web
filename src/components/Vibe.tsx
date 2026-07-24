import { Play, SkipForward, Maximize2, Settings2, LogOut, Music } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const glassStrong = {
  background: 'linear-gradient(135deg, rgba(20,22,28,0.52), rgba(20,22,28,0.38))',
  backdropFilter: 'blur(40px) saturate(180%)',
  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.22)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.32), 0 8px 32px rgba(0,0,0,0.32)',
} as const;

const glassSubtle = {
  background: 'linear-gradient(135deg, rgba(20,22,28,0.42), rgba(20,22,28,0.30))',
  backdropFilter: 'blur(28px) saturate(160%)',
  WebkitBackdropFilter: 'blur(28px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.24), 0 4px 20px rgba(0,0,0,0.24)',
} as const;

export function Vibe() {
  const { ref: headRef, revealed: headIn } = useReveal<HTMLDivElement>(0.1);
  const { ref: mockRef, revealed: mockIn } = useReveal<HTMLDivElement>(0.1);

  return (
    <section id="vibe" className="px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div
          ref={headRef}
          className={`mb-16 max-w-2xl transition-all duration-700 ease-md3-emphasized ${
            headIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="section-label mb-3">02 — Vibe Mode</div>
          <h2 className="text-4xl font-black tracking-tight text-md3-on-surface sm:text-5xl">VIBE 沉浸模式</h2>
          <p className="mt-4 text-lg text-md3-on-surface-variant">
            关掉世界的噪音。全屏背景、液态玻璃与一段背景音乐，让对话成为唯一发生的事。
          </p>
        </div>

        <div
          ref={mockRef}
          className={`relative overflow-hidden rounded-[16px] border border-white/15 shadow-md3-5 transition-all duration-700 ease-md3-emphasized ${
            mockIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/30" />

          <div className="relative z-10 flex min-h-[460px] flex-col text-white">
            <div className="absolute right-4 top-4 z-50 flex items-center gap-3 rounded-full px-4 py-2 text-white/90" style={glassStrong}>
              <Music size={16} className="text-white/70" />
              <span className="max-w-[120px] truncate text-xs font-medium">夜间氛围</span>
              <div className="h-1 w-16 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-2/5 rounded-full bg-white/60" />
              </div>
              <span className="text-[10px] text-white/60 tabular-nums">01:24</span>
              <button className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/15">
                <SkipForward size={12} />
              </button>
              <button className="grid h-8 w-8 place-items-center rounded-full bg-white/20 hover:bg-white/30">
                <Play size={14} fill="currentColor" />
              </button>
            </div>

            <div className="absolute left-4 top-4 z-50 flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-white/90" style={glassStrong}>
              <Maximize2 size={14} /> 全屏
            </div>

            <div className="absolute bottom-4 left-4 z-50 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs text-white/90" style={glassStrong}>
              <Settings2 size={16} /> 定制
            </div>

            <div className="absolute bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs text-white/90" style={glassStrong}>
              <LogOut size={16} /> 退出
            </div>

            <div className="flex flex-1 flex-col justify-center gap-4 px-12 py-16">
              <div className="self-end max-w-[80%] rounded-[20px] px-5 py-3 text-sm" style={glassStrong}>
                今晚只想安静地写完这份设计稿。
              </div>
              <div className="max-w-[80%] rounded-[20px] px-5 py-3 text-sm text-white/90" style={glassSubtle}>
                好。我整理了大纲与参考资料，随时可以开始。
              </div>
            </div>

            <div className="relative z-10 px-12 pb-8">
              <div className="flex max-w-3xl items-center gap-2 rounded-[28px] px-5 py-3.5" style={glassStrong}>
                <span className="flex-1 text-sm text-white/50">输入消息…</span>
                <button className="grid h-9 w-9 place-items-center rounded-full bg-white/25 text-white hover:bg-white/35">
                  <Play size={16} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { title: '全屏背景', desc: 'Pexels 高质量图片，支持自定义网络图或本地图片。' },
            { title: '液态玻璃 UI', desc: 'blur 40px + saturate 180%，三档毛玻璃视觉语言。' },
            { title: '悬浮播放器', desc: '右上角音乐控制，支持单曲或文件夹循环播放。' },
          ].map((item, i) => (
            <div key={item.title} className="card-filled p-6" style={{ transitionDelay: `${120 + i * 80}ms` }}>
              <h4 className="text-lg font-bold text-md3-on-surface">{item.title}</h4>
              <p className="mt-1 text-sm leading-6 text-md3-on-surface-variant">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
