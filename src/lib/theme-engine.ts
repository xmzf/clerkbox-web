import {
  Hct,
  SchemeTonalSpot,
  hexFromArgb,
  argbFromHex,
  MaterialDynamicColors,
} from '@material/material-color-utilities'

export interface MacaronPreset {
  id: string
  label: string
  seed: string
}

/** 马卡龙色系预设 — 与 ClerkBox 桌面端保持一致 */
export const MACARON_PRESETS: MacaronPreset[] = [
  { id: 'classic',  label: '经典灰',    seed: '#5F6368' },
  { id: 'sakura',   label: '樱花粉',    seed: '#F4A7B9' },
  { id: 'mint',     label: '薄荷绿',    seed: '#98D8C8' },
  { id: 'lavender', label: '薰衣草紫',  seed: '#B4A7D6' },
  { id: 'sky',      label: '天空蓝',    seed: '#A7C7E7' },
  { id: 'peach',    label: '蜜桃橙',    seed: '#FFB59E' },
  { id: 'cream',    label: '奶油黄',    seed: '#F0D9A8' },
]

export const DEFAULT_CUSTOM_SEED = '#F4A7B9'

export function resolveSeed(colorScheme: string, customSeedColor: string): string {
  if (colorScheme === 'custom') return customSeedColor || DEFAULT_CUSTOM_SEED
  return MACARON_PRESETS.find((p) => p.id === colorScheme)?.seed ?? MACARON_PRESETS[0].seed
}

function rgbComponents(argb: number): string {
  const r = (argb >> 16) & 255
  const g = (argb >> 8) & 255
  const b = argb & 255
  return `${r} ${g} ${b}`
}

/** 核心：基于种子色 + 亮暗模式，用 MD3 HCT 算法生成完整调色板并写入 CSS 变量 */
export function applyColorScheme(seedHex: string, dark: boolean): void {
  const scheme = new SchemeTonalSpot(Hct.fromInt(argbFromHex(seedHex)), dark, 0)
  const c = MaterialDynamicColors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const argb = (color: any) => color.getArgb(scheme)
  const root = document.documentElement

  const entries: Array<[string, number]> = [
    ['--md-primary-rgb',                 argb(c.primary)],
    ['--md-onPrimary-rgb',               argb(c.onPrimary)],
    ['--md-primaryContainer-rgb',        argb(c.primaryContainer)],
    ['--md-onPrimaryContainer-rgb',      argb(c.onPrimaryContainer)],
    ['--md-secondary-rgb',               argb(c.secondary)],
    ['--md-onSecondary-rgb',             argb(c.onSecondary)],
    ['--md-secondaryContainer-rgb',      argb(c.secondaryContainer)],
    ['--md-onSecondaryContainer-rgb',    argb(c.onSecondaryContainer)],
    ['--md-tertiary-rgb',                argb(c.tertiary)],
    ['--md-onTertiary-rgb',              argb(c.onTertiary)],
    ['--md-tertiaryContainer-rgb',       argb(c.tertiaryContainer)],
    ['--md-onTertiaryContainer-rgb',     argb(c.onTertiaryContainer)],
    ['--md-surface-rgb',                 argb(c.surface)],
    ['--md-surfaceContainer-rgb',        argb(c.surfaceContainer)],
    ['--md-surfaceContainerHigh-rgb',    argb(c.surfaceContainerHigh)],
    ['--md-onSurface-rgb',               argb(c.onSurface)],
    ['--md-onSurfaceVariant-rgb',        argb(c.onSurfaceVariant)],
    ['--md-outline-rgb',                 argb(c.outline)],
    ['--md-outlineVariant-rgb',          argb(c.outlineVariant)],
    ['--md-error-rgb',                   argb(c.error)],
    ['--md-onError-rgb',                 argb(c.onError)],
    ['--md-errorContainer-rgb',          argb(c.errorContainer)],
    ['--md-onErrorContainer-rgb',        argb(c.onErrorContainer)],
    ['--md-inverseSurface-rgb',          argb(c.inverseSurface)],
    ['--md-onInverseSurface-rgb',        argb(c.inverseOnSurface)],
  ]

  for (const [name, value] of entries) {
    root.style.setProperty(name, rgbComponents(value))
  }
}

/** 生成三色预览（用于色卡的 conic-gradient） */
export function schemeSwatches(seedHex: string): {
  primary: string
  secondary: string
  tertiary: string
} {
  const scheme = new SchemeTonalSpot(Hct.fromInt(argbFromHex(seedHex)), false, 0)
  const c = MaterialDynamicColors
  return {
    primary: hexFromArgb(c.primary.getArgb(scheme)),
    secondary: hexFromArgb(c.secondaryContainer.getArgb(scheme)),
    tertiary: hexFromArgb(c.tertiaryContainer.getArgb(scheme)),
  }
}
