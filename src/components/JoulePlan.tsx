import { useI18n } from '../i18n'
import { JOULE } from './Header'
import { Icon } from './Icons'

interface PlanRow {
  name: string
  price: string
  credit: string
  popular?: boolean
}

/**
 * 档位与倍数照抄 joule.xmzf.space 公开订阅区（美元 / 月）。
 * 这是营销数字，改 Joule 价目时两处必须同步；不要在这里推导或换算。
 */
const PLANS: PlanRow[] = [
  { name: 'plan1', price: 'plan1p', credit: 'plan1c' },
  { name: 'plan2', price: 'plan2p', credit: 'plan2c', popular: true },
  { name: 'plan3', price: 'plan3p', credit: 'plan3c' },
]

const STEPS = [
  { t: 's1t', d: 's1d' },
  { t: 's2t', d: 's2d' },
  { t: 's3t', d: 's3d' },
]

const CARDS = [
  { key: 'c1', icon: 'lock' },
  { key: 'c2', icon: 'calendar-clock' },
  { key: 'c3', icon: 'sparkles' },
]

export default function JoulePlan() {
  const { t } = useI18n()
  return (
    <section className="section" id="joule">
      <div className="container">
        <div className="sec-label">
          <img src="/joule-mark.png" alt="" className="sec-mark" />
          {t('joule.label')}
          <span className="promo-badge">{t('joule.badge')}</span>
        </div>
        <h2 className="sec-title">{t('joule.title')}</h2>
        <p className="sec-sub">{t('joule.sub')}</p>

        <div className="joule-cards">
          {CARDS.map((c) => (
            <div className="jn-card" key={c.key}>
              <div className="ic">
                <Icon name={c.icon} size={18} />
              </div>
              <h3>{t(`joule.${c.key}t`)}</h3>
              <p>{t(`joule.${c.key}d`)}</p>
            </div>
          ))}
        </div>

        <div className="plan-card">
          <div className="price-head">
            <span className="t">
              <img src="/joule-mark.png" alt="" />
              {t('joule.planTitle')}
            </span>
            <span className="u">{t('joule.planUnit')}</span>
          </div>
          <div className="plan-grid">
            {PLANS.map((p) => (
              <div className={`plan-item${p.popular ? ' popular' : ''}`} key={p.name}>
                {p.popular && <span className="plan-tag">{t('joule.planTag')}</span>}
                <span className="pn">{t(`joule.${p.name}`)}</span>
                <span className="pp">
                  {t(`joule.${p.price}`)}
                  <em>{t('joule.planPer')}</em>
                </span>
                <span className="pc">{t(`joule.${p.credit}`)}</span>
              </div>
            ))}
          </div>
          <div className="price-foot">{t('joule.planNote')}</div>
        </div>

        <div className="steps-row">
          {STEPS.map((s, i) => (
            <div className="step-card" key={s.t}>
              <span className="no">{`0${i + 1}`}</span>
              <span>
                <span className="t">{t(`joule.${s.t}`)}</span>
                <br />
                <span className="d">{t(`joule.${s.d}`)}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="joule-cta">
          <a className="btn" href={JOULE} target="_blank" rel="noreferrer">
            <img src="/joule-mark.png" alt="" />
            {t('joule.cta')}
            <Icon name="arrow-right" size={16} />
          </a>
          <span className="note">{t('joule.ctaNote')}</span>
        </div>
      </div>
    </section>
  )
}
