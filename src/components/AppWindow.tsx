import {
  MessageSquare, Settings, Globe, Store, Sparkles,
  FolderOpen, Hammer, ChevronDown, Brain, Zap, Send,
} from 'lucide-react';

export function AppWindow() {
  return (
    <div className="relative mx-auto w-full max-w-[820px]">
      <div
        className="overflow-hidden rounded-[14px] border border-md3-outline-variant/30 bg-md3-surface shadow-md3-4"
        style={{ height: 540 }}
      >
        {/* TitleBar —— 真实代码：h-11 / bg-dark-surface/80 / backdrop-blur-md / border-b */}
        <div className="flex h-11 items-center justify-between border-b border-md3-outline-variant/15 bg-md3-surface/80 px-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button className="grid h-7 w-7 place-items-center rounded-md3-sm text-md3-on-surface-variant hover:bg-md3-surface-container-high">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span className="rounded-md3-xs bg-md3-surface-container-high px-1.5 py-0.5 text-[10px] text-md3-on-surface-variant">v1.7.0</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-2 inline-flex h-7 items-center gap-1 rounded-md3-sm bg-md3-tertiary/15 px-2 text-md3-tertiary">
              <Sparkles size={13} />
              <span className="text-[11px] font-medium">VIBE</span>
            </span>
            <span className="mr-2 inline-flex items-center gap-1.5 rounded-md3-sm bg-md3-surface-container-high px-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-md3-primary" />
              <span className="text-[10px] text-md3-on-surface-variant">就绪</span>
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-md3-sm text-md3-on-surface-variant hover:bg-md3-surface-container-high">─</span>
            <span className="grid h-7 w-7 place-items-center rounded-md3-sm text-md3-on-surface-variant hover:bg-md3-surface-container-high">□</span>
            <span className="grid h-7 w-7 place-items-center rounded-md3-sm text-md3-on-surface-variant hover:bg-md3-error/20 hover:text-md3-error">✕</span>
          </div>
        </div>

        <div className="flex h-[calc(540px-44px)]">
          {/* Sidebar —— 真实代码：w-64 / bg-dark-surfaceDim / border-r */}
          <div className="flex w-56 flex-col border-r border-md3-outline-variant/15 bg-md3-surface-container/40">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-md3-sm bg-md3-primary-container text-md3-on-primary-container">
                <MessageSquare size={14} />
              </div>
              <span className="text-[13px] font-semibold tracking-wide text-md3-on-surface-variant">ClerkBox</span>
            </div>

            <div className="flex flex-col gap-1.5 px-3 pb-2">
              <button className="flex w-full items-center justify-center gap-1.5 rounded-md3-md bg-md3-surface-container-high px-3 py-1.5 text-[12px] transition-colors">
                新会话
              </button>
              <button className="flex w-full items-center justify-center gap-1.5 rounded-md3-md bg-md3-surface-container-high px-3 py-1.5 text-[12px] text-md3-on-surface-variant transition-colors">
                <Store size={13} /> 技能
              </button>
            </div>

            <div className="flex-1 overflow-hidden px-2">
              <div className="flex items-center gap-2 rounded-full bg-md3-secondary-container px-3 py-1.5 text-[11px] font-medium text-md3-on-secondary-container">
                <MessageSquare size={12} className="flex-none" />
                <span className="truncate">重构 utils</span>
              </div>
              <div className="mt-1 flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] text-md3-on-surface-variant">
                <MessageSquare size={12} className="flex-none" />
                <span className="truncate">依赖结构分析</span>
              </div>
              <div className="mt-1 flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] text-md3-on-surface-variant">
                <MessageSquare size={12} className="flex-none" />
                <span className="truncate">周报初稿</span>
              </div>
            </div>

            <div className="border-t border-md3-outline-variant/10 px-3 py-1.5">
              <button className="flex w-full items-center gap-2 rounded-md3-sm px-2 py-1.5 text-[12px] text-md3-on-surface-variant">
                <Globe size={14} /> 启动 WebUI
              </button>
              <button className="flex w-full items-center gap-2 rounded-md3-sm px-2 py-1.5 text-[12px] text-md3-on-surface-variant">
                <Settings size={14} /> 设置
              </button>
            </div>
          </div>

          {/* 主区 —— welcome 状态：图标 + 问候 + 输入框 + 底部波浪 */}
          <div className="relative flex min-w-0 flex-1 flex-col bg-md3-surface">
            <div className="flex flex-1 flex-col items-center justify-center px-4">
              <div className="w-full max-w-2xl">
                {/* 图标 + 问候语 —— 真实代码：w-14 h-14 + text-xl */}
                <div className="mb-4 flex items-center gap-3.5">
                  <div className="grid h-12 w-12 place-items-center rounded-md3-lg bg-md3-primary-container text-md3-on-primary-container">
                    <span className="text-2xl">📦</span>
                  </div>
                  <span className="text-[17px] font-medium text-md3-on-surface">Hi there! How can I help you?</span>
                </div>

                {/* 输入框（welcome 变体）—— 真实代码：rounded-[28px] / px-5 py-3.5 */}
                <div className="flex max-w-3xl flex-col gap-2 rounded-[28px] border border-md3-outline-variant/8 bg-md3-surface-container-high px-4 py-3 focus-within:border-md3-primary/30">
                  <textarea
                    className="min-h-[20px] w-full resize-none bg-transparent text-[13px] text-md3-on-surface outline-none"
                    defaultValue="输入指令…"
                    rows={1}
                  />
                  <div className="flex items-center gap-1">
                    <button className="grid h-7 w-7 place-items-center rounded-md3-sm text-md3-on-surface-variant hover:bg-md3-surface-container">
                      <FolderOpen size={14} />
                    </button>
                    <button className="inline-flex h-7 items-center gap-1 rounded-md3-sm bg-md3-warning/15 px-2 text-[11px] text-md3-warning">
                      <Hammer size={12} /> Craft
                    </button>
                    <button className="grid h-7 w-7 place-items-center rounded-md3-sm text-md3-on-surface-variant hover:bg-md3-surface-container">
                      <Brain size={14} />
                    </button>
                    <button className="grid h-7 w-7 place-items-center rounded-md3-sm text-md3-on-surface-variant hover:bg-md3-surface-container">
                      <Zap size={14} />
                    </button>
                    <button className="inline-flex h-7 items-center gap-1 rounded-md3-sm px-2 text-[11px] text-md3-on-surface-variant hover:bg-md3-surface-container">
                      deepseek-chat <ChevronDown size={11} />
                    </button>
                    <span className="flex-1" />
                    <button className="grid h-8 w-8 place-items-center rounded-full bg-md3-primary text-md3-on-primary hover:bg-md3-primary/90">
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部波浪（ThemeWaves 等价视觉）—— 三个不同主题色色块 */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex h-32 items-end overflow-hidden">
              <div className="h-20 w-full opacity-60" style={{ background: 'linear-gradient(to top, rgb(var(--md-primary-rgb) / 0.15), transparent)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
