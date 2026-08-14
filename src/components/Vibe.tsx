import { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Maximize, Settings2, LogOut, Music,
  FolderOpen, Hammer, ChevronDown, Brain, Zap, Send, FileText,
} from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

// 与 ClerkBox src/index.css 中 .liquid-glass 系列完全一致
const glass = {
  background: 'linear-gradient(135deg, rgb(20 22 28 / 0.52) 0%, rgb(20 22 28 / 0.38) 100%)',
  backdropFilter: 'blur(40px) saturate(180%)',
  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
  border: '1px solid rgb(255 255 255 / 0.22)',
  boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.32), inset 0 -1px 0 rgb(255 255 255 / 0.08), 0 8px 32px rgb(0 0 0 / 0.32)',
} as const;

const glassSubtle = {
  background: 'linear-gradient(135deg, rgb(20 22 28 / 0.42) 0%, rgb(20 22 28 / 0.30) 100%)',
  backdropFilter: 'blur(28px) saturate(160%)',
  WebkitBackdropFilter: 'blur(28px) saturate(160%)',
  border: '1px solid rgb(255 255 255 / 0.18)',
  boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.24), 0 4px 20px rgb(0 0 0 / 0.24)',
} as const;

const VIBE_MUSIC_URL = 'https://download.xmzf.space/d/well.mp3?sign=80T1gAdArbx1nhRPlVCxMh6HYUN5ZojtXqRrrfZV8aM=:0';

function formatTime(t: number) {
  if (!isFinite(t) || isNaN(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function Vibe() {
  const { ref: headRef, revealed: headIn } = useReveal<HTMLDivElement>(0.1);
  const { ref: mockRef, revealed: mockIn } = useReveal<HTMLDivElement>(0.1);

  // 真实音频播放
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => { setProgress(audio.currentTime); setDuration(audio.duration || 0); };
    const onEnd = () => { audio.currentTime = 0; setProgress(0); setIsPlaying(false); };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onTime);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onTime);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch { /* 浏览器自动播放策略阻止 */ }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setProgress(audio.currentTime);
  };

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
            backgroundImage: 'url(https://download.xmzf.space/d/all.jpg?sign=76nF_pS2izwdX4O9NtrMo16a1LzhIaN8K1NX9Vuhdus=:0)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* 真实音频元素，默认不自动播放 */}
          <audio ref={audioRef} src={VIBE_MUSIC_URL} preload="metadata" />

          <div className="absolute inset-0 bg-black/30" />

          <div className="relative z-10 flex h-[520px] flex-col text-white">
            {/* 左上：全屏按钮 —— VibeControls */}
            <button className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full px-3 py-2 text-white/90" style={glass}>
              <Maximize size={14} />
              <span className="text-xs font-medium">全屏</span>
            </button>

            {/* 右上：悬浮音乐播放器 —— VibeMusicPlayer（可交互） */}
            <div className="absolute right-4 top-4 z-50 flex items-center gap-3 rounded-full px-4 py-2 text-white/90" style={glass}>
              <Music size={16} className="text-white/70" />
              <div className="flex min-w-[140px] flex-col">
                <span className="max-w-[160px] truncate text-xs font-medium">well.mp3</span>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={duration || 1}
                    value={progress}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                    aria-label="seek"
                  />
                  <span className="text-[10px] tabular-nums text-white/60">
                    {formatTime(progress)}/{formatTime(duration)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/15"><SkipBack size={14} /></span>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label={isPlaying ? 'pause' : 'play'}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
                <span className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/15"><SkipForward size={14} /></span>
              </div>
            </div>

            {/* 左下 / 右下：定制 / 退出 —— VibeControls */}
            <button className="absolute bottom-4 left-4 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-white/90" style={glass}>
              <Settings2 size={16} />
              <span className="text-xs font-medium">定制</span>
            </button>
            <button className="absolute bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-white/90" style={glass}>
              <LogOut size={16} />
              <span className="text-xs font-medium">退出</span>
            </button>

            {/* 消息区 —— MessageItem vibe 分支：rounded-md3-md(12px) */}
            <div className="flex flex-1 flex-col justify-center gap-3 px-12 py-14">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-md3-md px-4 py-2.5 text-sm leading-relaxed text-white" style={glass}>
                  今晚只想安静地写完这份设计稿。
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-md3-md px-4 py-2.5 text-sm leading-relaxed text-white/90" style={glassSubtle}>
                  好。我整理了大纲与参考资料，随时可以开始。
                </div>
              </div>
              <div className="flex justify-start">
                <div className="flex max-w-md items-center gap-2 rounded-md3-xs border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] text-white/60">
                  <FileText size={11} />
                  <span className="font-medium text-white/80">read_file</span>
                  <span className="truncate text-white/40">outline.md</span>
                  <span className="ml-auto rounded-md3-xs bg-emerald-500/15 px-1 py-0.5 text-[10px] text-emerald-400">完成</span>
                </div>
              </div>
            </div>

            {/* 输入区 —— ChatInput vibe 分支：liquid-glass rounded-[28px] + 工具栏 */}
            <div className="relative z-10 px-12 pb-10">
              <div className="mx-auto flex max-w-3xl flex-col gap-2 rounded-[28px] px-5 py-3.5" style={glass}>
                <span className="min-h-[20px] py-1 text-sm text-white/50">说点什么…</span>
                <div className="flex items-center gap-1">
                  <span className="grid h-8 w-8 place-items-center rounded-md3-sm text-white/70 hover:bg-white/15"><FolderOpen size={16} /></span>
                  <span className="flex h-8 items-center gap-1 rounded-md3-sm bg-white/10 px-2 text-xs font-medium text-white/80">
                    <Hammer size={14} /> Craft <ChevronDown size={12} />
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-md3-sm text-white/70 hover:bg-white/15"><Brain size={16} /></span>
                  <span className="flex h-8 items-center gap-1 rounded-md3-sm px-2 text-xs text-white/70">
                    <Zap size={14} /> 技能 <ChevronDown size={12} />
                  </span>
                  <span className="flex h-8 items-center gap-1 rounded-md3-sm px-2 text-xs text-white/70">
                    MiniMax-M3 <ChevronDown size={12} />
                  </span>
                  <span className="flex-1" />
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/25 text-white hover:bg-white/35">
                    <Send size={16} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { title: '全屏背景', desc: '默认全屏背景图，可自定义网络图或本地图片。' },
            { title: '液态玻璃 UI', desc: 'blur 40px + saturate 180%，三档毛玻璃视觉语言。' },
            { title: '悬浮播放器', desc: '右上角音乐控制，支持单曲 / 音乐文件夹播放。' },
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
