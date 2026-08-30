import { useI18n } from '../i18n'
import { REPO, SETUP_URL } from './Header'
import { Icon } from './Icons'

export default function Download() {
  const { t } = useI18n()
  return (
    <section className="section" id="download">
      <div className="container">
        <h2 className="sec-title">{t('download.title')}</h2>
        <p className="sec-sub">{t('download.sub')}</p>

        <div className="dl-grid">
          <div className="dl-col">
            <h3>
              <Icon name="square" size={15} />
              {t('download.winTitle')}
            </h3>
            <a className="dl-row" href={SETUP_URL} download>
              <span className="nm">{t('download.winRow1')}</span>
              <span className="ext">.exe</span>
              <span className="ver">{t('download.getVersion')}</span>
              <span className="arr">→</span>
            </a>
            <a className="dl-row" href={`${REPO}/releases`} target="_blank" rel="noreferrer">
              <span className="nm">{t('download.winRow2')}</span>
              <span className="arr">→</span>
            </a>
          </div>

          <div className="dl-col">
            <h3>
              <Icon name="code" size={15} />
              {t('download.srcTitle')}
            </h3>
            <a className="dl-row mono" href={REPO} target="_blank" rel="noreferrer">
              <span className="nm">{t('download.srcRow1')}</span>
              <span className="arr">→</span>
            </a>
            <a className="dl-row mono" href={`${REPO}#从源码构建`} target="_blank" rel="noreferrer">
              <span className="nm">{t('download.srcRow2')}</span>
              <span className="arr">→</span>
            </a>
          </div>

          <div className="dl-col">
            <h3>
              <Icon name="globe" size={15} />
              {t('download.webuiTitle')}
              <span className="beta">BETA</span>
            </h3>
            <div className="dl-row desc">{t('download.webuiDesc')}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
