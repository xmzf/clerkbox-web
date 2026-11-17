import { useI18n } from '../i18n'
import { Icon } from './Icons'
import { REPO } from './Header'
import '../styles/remote.css'

export const WEBUI_URL = 'https://webui.clerkbox.xmzf.space'

export default function Remote() {
  const { t, lang } = useI18n()
  const guide = `${REPO}/blob/main/${lang === 'zh' ? 'README.md#webui-远程访问' : 'README.en.md#webui-remote-access'}`
  return <section className="remote-section" id="remote" aria-labelledby="remote-title">
    <div className="container remote-layout">
      <div className="remote-heading">
        <p className="eyebrow">{t('remote.eyebrow')}</p>
        <h2 className="section-title" id="remote-title">{t('remote.title')}</h2>
        <p className="section-intro">{t('remote.intro')}</p>
        <div className="remote-actions"><a className="button button-light" href={WEBUI_URL} target="_blank" rel="noreferrer">{t('remote.open')}<Icon name="arrow-right" size={17} /></a><a className="text-link" href={guide} target="_blank" rel="noreferrer">{t('remote.guide')}<Icon name="arrow-right" size={16} /></a></div>
      </div>
      <div className="remote-route">
        <span>{t('remote.endpoint')}</span>
        <a className="remote-address mono" href={WEBUI_URL} target="_blank" rel="noreferrer"><Icon name="globe" size={20} /><span>webui.clerkbox.xmzf.space</span><Icon name="arrow-right" size={18} /></a>
        <ol className="remote-steps">{[1, 2, 3].map(step => <li key={step}><span className="mono">0{step}</span><div><h3>{t(`remote.step${step}Title`)}</h3><p>{t(`remote.step${step}Body`)}</p></div></li>)}</ol>
      </div>
      <div className="remote-boundaries">{['devices', 'invite', 'privacy'].map((key, index) => <article key={key}><span className="mono">0{index + 1}</span><h3>{t(`remote.${key}Title`)}</h3><p>{t(`remote.${key}Body`)}</p></article>)}</div>
      <p className="remote-note"><Icon name="shield-check" size={18} />{t('remote.note')}</p>
    </div>
  </section>
}
