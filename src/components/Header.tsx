import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { GithubIcon, Icon } from './Icons'
export const REPO = 'https://github.com/XMZF-vAI/clerkbox'
export const RELEASES = `${REPO}/releases`
export const JOULE = 'https://joule.xmzf.space'
export default function Header() {
  const { t, lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open) return
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !event.isComposing) { setOpen(false); toggleRef.current?.focus() } }
    const outside = (event: PointerEvent) => { if (!headerRef.current?.contains(event.target as Node)) setOpen(false) }
    const media = window.matchMedia('(min-width: 901px)')
    const resize = () => { if (media.matches) setOpen(false) }
    media.addEventListener('change', resize)
    document.addEventListener('keydown', escape)
    document.addEventListener('pointerdown', outside)
    return () => { media.removeEventListener('change', resize); document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside) }
  }, [open])
  const links = [['#workspace', 'product'], ['#features', 'features'], ['#vibe', 'vibe'], ['#start', 'start']]
  return <>
    <a className="skip-link" href="#main">{t('header.skip')}</a>
    <header className="site-header" ref={headerRef}><div className="container header-inner">
      <a className="brand" href="#top" aria-label="ClerkBox" onClick={() => setOpen(false)}><img src="/clerkbox.png" width="34" height="34" alt="" /><span>ClerkBox<span className="brand-period">.</span></span><span className="version-tag">4.0</span></a>
      <nav className="desktop-nav" aria-label={t('header.nav')}>{links.map(([href, key]) => <a href={href} key={key}>{t(`header.${key}`)}</a>)}</nav>
      <div className="header-actions"><div className="language-switch" role="group" aria-label={t('header.language')}><button type="button" aria-pressed={lang === 'zh'} onClick={() => setLang('zh')} lang="zh-CN">中</button><button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')} lang="en">EN</button></div>
        <a className="icon-button github-button" href={REPO} target="_blank" rel="noreferrer" aria-label={t('header.github')}><GithubIcon size={20} /></a>
        <a className="button button-small header-download" href="#download">{t('header.download')}<Icon name="arrow-right" size={16} /></a>
        <button className="icon-button menu-toggle" ref={toggleRef} type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={t(open ? 'header.close' : 'header.open')} onClick={() => setOpen(!open)}>{open ? <Icon name="x" size={22} /> : <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg>}</button>
      </div></div>
      {open && <nav className="mobile-nav container" id="mobile-navigation" aria-label={t('header.nav')}>{links.map(([href, key]) => <a href={href} key={key} onClick={() => setOpen(false)}>{t(`header.${key}`)}<Icon name="arrow-right" size={18} /></a>)}<a href="#download" onClick={() => setOpen(false)}>{t('header.download')}<Icon name="download" size={18} /></a></nav>}
    </header>
  </>
}
