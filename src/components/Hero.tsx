import { useI18n } from '../i18n'
import { Icon } from './Icons'
export default function Hero() {
  const { t } = useI18n()
  return <section className="hero container" id="top" aria-labelledby="hero-title">
    <div className="hero-topline"><a className="release-label" href="#features"><span className="release-dot" />{t('hero.badge')}<Icon name="arrow-right" size={14} /></a><span className="hero-edition">A WORKSPACE OF YOUR OWN</span></div>
    <div className="hero-layout"><div><p className="eyebrow hero-eyebrow">{t('hero.eyebrow')}</p><h1 id="hero-title">{t('hero.line1')}<br /><span>{t('hero.line2')}</span><span className="hero-asterisk" aria-hidden="true">✳</span></h1></div><div className="hero-copy"><p>{t('hero.intro')}</p><div className="hero-actions"><a className="button button-primary" href="#download">{t('hero.download')}<Icon name="arrow-right" size={18} /></a><a className="text-link" href="#workspace">{t('hero.explore')}<Icon name="chevron-down" size={16} /></a></div><div className="hero-platforms">{t('hero.platforms')}<br />{t('hero.license')}</div></div></div>
    <div className="hero-bottom"><span className="mono">THINK IT. MAKE IT.</span><span>{t('hero.side')}</span><span className="hero-down" aria-hidden="true">↙</span></div>
  </section>
}
