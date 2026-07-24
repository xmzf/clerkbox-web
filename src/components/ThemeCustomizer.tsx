import { Sun, Moon, Monitor, Check, Palette } from 'lucide-react';
import { MACARON_PRESETS, schemeSwatches, DEFAULT_CUSTOM_SEED } from '../lib/theme-engine';
import { useReveal } from '../hooks/useReveal';
import { useMemo } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface Props {
  theme: ThemeMode;
  setTheme: (m: ThemeMode) => void;
  colorScheme: string;
  setColorScheme: (s: string) => void;
  customSeed: string;
  setCustomSeed: (s: string) => void;
}

const MODES: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: '浅色', icon: Sun },
  { id: 'dark', label: '深色', icon: Moon },
  { id: 'system', label: '跟随系统', icon: Monitor },
];

function Swatch({ seed, selected }: { seed: string; selected: boolean }) {
  const colors = useMemo(() => schemeSwatches(seed), [seed]);
  return (
    <span
      className="block h-10 w-10 rounded-full transition-transform duration-md3-short ease-md3-emphasized"
      style={{
        background: `conic-gradient(${colors.primary} 0% 33%, ${colors.secondary} 33% 66%, ${colors.tertiary} 66% 100%)`,
      }}
    >
      {selected && (
        <span className="grid h-full w-full place-items-center">
          <Check size={16} className="text-white drop-shadow-md" strokeWidth={3} />
        </span>
      )}
    </span>
  );
}

export function ThemeCustomizer({
  theme,
  setTheme,
  colorScheme,
  setColorScheme,
  customSeed,
  setCustomSeed,
}: Props) {
  const { ref, revealed } = useReveal<HTMLDivElement>(0.08);

  return (
    <section id="customize" className="px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div
          ref={ref}
          className={`card-elevated overflow-hidden p-8 transition-all duration-700 ease-md3-emphasized sm:p-10 lg:p-12 ${
            revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {/* 装饰性背景光晕 */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-md3-primary/8 blur-3xl" />

          {/* Header */}
          <div className="relative mb-8">
            <div className="section-label mb-2">Personalize</div>
            <h2 className="text-3xl font-black tracking-tight text-md3-on-surface sm:text-4xl">
              个性化配色
            </h2>
            <p className="mt-2 text-md3-on-surface-variant">
              MD3 动态色彩 — 选择种子色，整套界面配色由 HCT 算法实时生成
            </p>
          </div>

          {/* 主题模式 */}
          <div className="relative mb-8">
            <h3 className="mb-3 text-sm font-medium text-md3-on-surface-variant">主题模式</h3>
            <div className="flex flex-wrap gap-3">
              {MODES.map((m) => {
                const active = theme === m.id;
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setTheme(m.id)}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-all duration-md3-short ease-md3-emphasized ${
                      active
                        ? 'border-2 border-md3-primary/40 bg-md3-primary/10 text-md3-primary'
                        : 'border border-md3-outline-variant text-md3-on-surface-variant hover:bg-md3-surface-variant'
                    }`}
                  >
                    <Icon size={16} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 马卡龙色系 */}
          <div className="relative">
            <h3 className="mb-4 text-sm font-medium text-md3-on-surface-variant">马卡龙色系</h3>
            <div className="grid grid-cols-4 gap-x-4 gap-y-5 sm:grid-cols-8">
              {MACARON_PRESETS.map((p) => {
                const selected = colorScheme === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setColorScheme(p.id)}
                    className="group flex flex-col items-center gap-2"
                  >
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-full transition-all duration-md3-short ease-md3-emphasized group-hover:scale-110 ${
                        selected ? 'ring-2 ring-md3-primary ring-offset-2 ring-offset-md3-surface' : ''
                      }`}
                    >
                      <Swatch seed={p.seed} selected={selected} />
                    </span>
                    <span
                      className={`text-xs transition-colors ${
                        selected ? 'font-semibold text-md3-primary' : 'text-md3-on-surface-variant'
                      }`}
                    >
                      {p.label}
                    </span>
                  </button>
                );
              })}

              {/* 自定义 */}
              <label className="group flex cursor-pointer flex-col items-center gap-2">
                <span
                  className={`grid h-12 w-12 place-items-center rounded-full border-2 border-dashed transition-all duration-md3-short ease-md3-emphasized group-hover:scale-110 ${
                    colorScheme === 'custom'
                      ? 'border-md3-primary bg-md3-primary/10 ring-2 ring-md3-primary ring-offset-2 ring-offset-md3-surface'
                      : 'border-md3-outline text-md3-on-surface-variant hover:border-md3-primary/50'
                  }`}
                >
                  {colorScheme === 'custom' ? (
                    <Check size={16} className="text-md3-primary" strokeWidth={3} />
                  ) : (
                    <Palette size={18} className="text-md3-on-surface-variant" />
                  )}
                </span>
                {colorScheme === 'custom' && (
                  <span
                    className="h-3 w-8 rounded-full"
                    style={{ backgroundColor: customSeed || DEFAULT_CUSTOM_SEED }}
                  />
                )}
                <span
                  className={`text-xs transition-colors ${
                    colorScheme === 'custom' ? 'font-semibold text-md3-primary' : 'text-md3-on-surface-variant'
                  }`}
                >
                  自定义
                </span>
                <input
                  type="color"
                  className="absolute h-0 w-0 opacity-0"
                  value={customSeed || DEFAULT_CUSTOM_SEED}
                  onChange={(e) => {
                    setCustomSeed(e.target.value);
                    setColorScheme('custom');
                  }}
                />
              </label>
            </div>

            {/* 底部说明 */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-md3-outline-variant pt-6">
              <span className="chip !border-transparent bg-md3-surface-variant font-mono">
                seed: {colorScheme === 'custom' ? (customSeed || DEFAULT_CUSTOM_SEED).toUpperCase() : MACARON_PRESETS.find((p) => p.id === colorScheme)?.seed.toUpperCase()}
              </span>
              <span className="text-xs text-md3-on-surface-variant">
                选择即应用 · 配色偏好保存在本地浏览器
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
