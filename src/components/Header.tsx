import { useI18n } from '../i18n'
import { GithubIcon, Icon } from './Icons'

export const REPO = 'https://github.com/XMZF-vAI/clerkbox'
export const RELEASES = `${REPO}/releases/latest`
/** v2.5.0 安装包直链（gitproxy 加速） */
export const SETUP_URL =
  'https://api.gitproxy.dev/github.com/XMZF-vAI/clerkbox/releases/download/v2.5.0/ClerkBox-Setup-2.5.0.exe'
/** Lunora 注册链接（带邀请码） */
export const LUNORA = 'https://www.uselunora.com/register?aff=CGNEDZYS9KB7'

export default function Header() {
  const { t, lang, setLang } = useI18n()
  return (
    <header className="hdr">
      <div className="container hdr-in">
        <a className="hdr-logo" href="#top">
          <img src="/clerkbox.png" alt="ClerkBox" />
          <span>ClerkBox</span>
        </a>
        <nav className="hdr-nav">
          <a href="#features">{t('header.navFeatures')}</a>
          <a href="#lunora">{t('header.navLunora')}</a>
          <a href="#download">{t('header.navDownload')}</a>
        </nav>
        <div className="hdr-actions">
          <div className="lang-switch" role="group" aria-label="Language">
            <button className={lang === 'zh' ? 'on' : ''} onClick={() => setLang('zh')}>
              中
            </button>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
              EN
            </button>
          </div>
          <a className="hdr-gh" href={REPO} target="_blank" rel="noreferrer" title={t('header.github')} aria-label={t('header.github')}>
            <GithubIcon />
          </a>
          <a className="hdr-cta" href={SETUP_URL} download>
            <Icon name="arrow-up" size={13} />
            {t('header.cta')}
          </a>
        </div>
      </div>
    </header>
  )
}
