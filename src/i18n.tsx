import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { siteCopy } from './content/site'
import { demoCopy } from './content/demo'
import { downloadCopy } from './content/download'
import { storyCopy } from './content/story'
import { remoteCopy } from './content/remote'

export type Lang = 'zh' | 'en'
const dictionaries = {
  zh: { ...siteCopy.zh, demo: demoCopy.zh, download: downloadCopy.zh, story: storyCopy.zh, remote: remoteCopy.zh },
  en: { ...siteCopy.en, demo: demoCopy.en, download: downloadCopy.en, story: storyCopy.en, remote: remoteCopy.en },
}
function resolve(source: unknown, key: string): string {
  let value = source
  for (const segment of key.split('.')) {
    if (!value || typeof value !== 'object' || !(segment in value)) return key
    value = (value as Record<string, unknown>)[segment]
  }
  return typeof value === 'string' ? value : key
}
interface I18nContext { lang: Lang; setLang: (lang: Lang) => void; t: (key: string) => string }
const Context = createContext<I18nContext | null>(null)
const LANGUAGE_KEY = 'clerkbox-site-lang'
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLanguage] = useState<Lang>(() => {
    try { return localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'zh' } catch { return 'zh' }
  })
  const setLang = useCallback((language: Lang) => {
    setLanguage(language)
    try { localStorage.setItem(LANGUAGE_KEY, language) } catch { /* The page works without storage. */ }
  }, [])
  const t = useCallback((key: string) => resolve(dictionaries[lang], key), [lang])
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    document.title = t('meta.title')
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) document.querySelector(selector)?.setAttribute('content', t('meta.description'))
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) document.querySelector(selector)?.setAttribute('content', t('meta.title'))
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'zh' ? 'zh_CN' : 'en_US')
  }, [lang, t])
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <Context.Provider value={value}>{children}</Context.Provider>
}
export function useI18n() {
  const context = useContext(Context)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
