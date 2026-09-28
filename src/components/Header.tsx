import { useI18n } from '../i18n'
import { GithubIcon, Icon } from './Icons'

export const REPO = 'https://github.com/XMZF-vAI/clerkbox'
export const RELEASES = `${REPO}/releases/latest`
/**
 * v3.0.0 安装包直链（gitproxy 加速）。
 * 资产名与 release.yml 的 electron-builder 配置一致：Windows NSIS 出 ClerkBox-Setup-<v>.exe，
 * macOS 出 x64 / arm64 两个 dmg，Linux 出 AppImage。
 */
const DL = 'https://api.gitproxy.dev/github.com/XMZF-vAI/clerkbox/releases/download/v3.0.0'
export const SETUP_URL = `${DL}/ClerkBox-Setup-3.0.0.exe`
export const MACOS_INTEL_URL = `${DL}/ClerkBox-3.0.0.dmg`
export const MACOS_ARM_URL = `${DL}/ClerkBox-3.0.0-arm64.dmg`
export const LINUX_URL = `${DL}/ClerkBox-3.0.0.AppImage`
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
