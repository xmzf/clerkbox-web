import { useI18n } from '../i18n'
import { SETUP_URL } from './Header'
import AppMockup from './AppMockup'
import { WindowsLogo } from './Icons'

export default function Hero() {
  const { t } = useI18n()
  return (
    <section className="hero" id="top">
      <div className="container hero-in">
        <div className="ann-pill">{t('ann')}</div>
        <h1>
          {t('hero.h1a')}
          <span className="accent">{t('hero.h1b')}</span>
        </h1>
        <p className="hero-sub">{t('hero.sub')}</p>
        <div>
          <a className="hero-cta" href={SETUP_URL} download>
            <WindowsLogo />
            <span>
              <span className="t">{t('hero.cta')}</span>
              <br />
              <span className="f">{t('hero.ctaFor')}</span>
            </span>
          </a>
        </div>
        <div>
          <a className="hero-link" href="#download">
            {t('hero.allDownloads')} ↓
          </a>
        </div>
      </div>
      <AppMockup />
    </section>
  )
}
