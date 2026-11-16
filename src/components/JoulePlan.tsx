import { useI18n } from '../i18n'
import { Icon } from './Icons'
import { JOULE, REPO } from './Header'
export default function JoulePlan() {
  const { t, lang } = useI18n()
  return <section className="section container getting-started" id="start" aria-labelledby="start-title">
    <div className="section-heading"><div><p className="eyebrow">{t('joule.eyebrow')}</p><h2 className="section-title" id="start-title">{t('joule.title')}</h2></div><p className="section-intro">{t('joule.intro')}</p></div>
    <ol className="setup-steps">{[1, 2, 3].map(n => <li key={n}><span className="step-number mono">0{n}</span><div><h3>{t(`joule.step${n}`)}</h3><p>{t(`joule.desc${n}`)}</p></div></li>)}</ol>
    <div className="joule-panel" id="joule"><div className="joule-logo-block"><img src="/joule-mark.png" alt="" width="48" height="48" loading="lazy" /><span>Joule</span><span className="joule-plus" aria-hidden="true">×</span><img src="/clerkbox-mark.webp" alt="ClerkBox" width="44" height="44" loading="lazy" /></div><div><h3>{t('joule.account')}</h3><p>{t('joule.accountDesc')}</p><div className="joule-links"><a className="text-link" href={JOULE} target="_blank" rel="noreferrer">{t('joule.jouleLink')}<Icon name="arrow-right" size={16} /></a><a className="text-link muted-link" href={`${REPO}/blob/main/${lang === 'zh' ? 'README.md#快速开始' : 'README.en.md#quick-start'}`} target="_blank" rel="noreferrer">{t('joule.manual')}<Icon name="arrow-right" size={16} /></a></div><small>{t('joule.optional')}</small></div></div>
    <div className="faq-layout"><h3>{t('joule.faqTitle')}</h3><div className="faq-list">{[1, 2, 3, 4].map(n => <details key={n}><summary>{t(`joule.q${n}`)}<span aria-hidden="true">+</span></summary><p>{t(`joule.a${n}`)}</p></details>)}</div></div>
  </section>
}
