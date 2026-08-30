import { useI18n } from '../i18n'
import { LUNORA } from './Header'
import { Icon } from './Icons'

interface PriceRow {
  model: string
  official: [string, string]
  lunora: [string, string]
  hl?: boolean
  tag?: boolean
}

/** 价格示例取自 uselunora.com 首页公开对照表（美元 / 1M tokens） */
const ROWS: PriceRow[] = [
  { model: 'gpt-5.6-sol', official: ['$5.00', '$30.00'], lunora: ['$0.225', '$1.35'], hl: true, tag: true },
  { model: 'gpt-5.6-luna', official: ['$0.200', '$1.20'], lunora: ['$0.0090', '$0.054'] },
  { model: 'gpt-5.6-terra', official: ['$2.00', '$12.00'], lunora: ['$0.090', '$0.540'] },
]

export default function LunoraPlan() {
  const { t } = useI18n()
  return (
    <section className="section" id="lunora">
      <div className="container">
        <div className="sec-label">
          <img src="/lunora-logo.svg" alt="" style={{ width: 18, height: 18, borderRadius: 5 }} />
          {t('lunora.label')}
        </div>
        <h2 className="sec-title">{t('lunora.title')}</h2>
        <p className="sec-sub">{t('lunora.sub')}</p>

        <div className="lunora-cards">
          <div className="ln-card">
            <div className="ic">$</div>
            <h3>{t('lunora.c1t')}</h3>
            <p>{t('lunora.c1d')}</p>
          </div>
          <div className="ln-card">
            <div className="ic">%</div>
            <h3>{t('lunora.c2t')}</h3>
            <p>{t('lunora.c2d')}</p>
          </div>
          <div className="ln-card">
            <div className="ic">✓</div>
            <h3>{t('lunora.c3t')}</h3>
            <p>{t('lunora.c3d')}</p>
          </div>
        </div>

        <div className="price-card">
          <div className="price-head">
            <span className="t">
              <img src="/lunora-logo.svg" alt="" />
              {t('lunora.tableTitle')}
            </span>
            <span className="u">{t('lunora.tableUnit')}</span>
          </div>
          <table className="price-table">
            <thead>
              <tr>
                <th>{t('lunora.colModel')}</th>
                <th>{t('lunora.colOfficial')}</th>
                <th>{t('lunora.colLunora')}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.model} className={r.hl ? 'hl' : ''}>
                  <td>
                    <span className="model">
                      {r.model}
                      {r.tag && <span className="tag">{t('lunora.rowSolTag')}</span>}
                    </span>
                  </td>
                  <td>
                    <span className="mono">
                      {t('lunora.rowIn')} {r.official[0]} / {t('lunora.rowOut')} {r.official[1]}
                    </span>
                  </td>
                  <td>
                    <span className="mono">
                      {t('lunora.rowIn')} <b>{r.lunora[0]}</b> / {t('lunora.rowOut')} <b>{r.lunora[1]}</b>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="price-foot">{t('lunora.tableNote')}</div>
        </div>

        <div className="steps-row">
          <div className="step-card">
            <span className="no">01</span>
            <span>
              <span className="t">{t('lunora.s1t')}</span>
              <br />
              <span className="d">{t('lunora.s1d')}</span>
            </span>
          </div>
          <div className="step-card">
            <span className="no">02</span>
            <span>
              <span className="t">{t('lunora.s2t')}</span>
              <br />
              <span className="d">{t('lunora.s2d')}</span>
            </span>
          </div>
          <div className="step-card">
            <span className="no">03</span>
            <span>
              <span className="t">{t('lunora.s3t')}</span>
              <br />
              <span className="d">{t('lunora.s3d')}</span>
            </span>
          </div>
        </div>

        <div className="lunora-cta">
          <a className="btn" href={LUNORA} target="_blank" rel="noreferrer">
            <img src="/lunora-logo.svg" alt="" />
            {t('lunora.cta')}
            <Icon name="arrow-right" size={16} />
          </a>
          <span className="note">{t('lunora.ctaNote')}</span>
        </div>
      </div>
    </section>
  )
}
