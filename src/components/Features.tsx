import { useRef, useState, type KeyboardEvent } from 'react'
import { useI18n } from '../i18n'
import { Icon } from './Icons'
import { REPO } from './Header'

const WORKFLOWS = ['coding', 'research', 'automate'] as const

export default function Features({ onRecall }: { onRecall: () => void }) {
  const { t, lang } = useI18n()
  const [workflow, setWorkflow] = useState(0)
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const handleKey = (event: KeyboardEvent, index: number) => {
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % 3
        : event.key === 'ArrowLeft'
          ? (index + 2) % 3
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? 2
              : -1
    if (next >= 0) {
      event.preventDefault()
      setWorkflow(next)
      refs.current[next]?.focus()
    }
  }
  return (
    <section
      className="section container"
      id="features"
      aria-labelledby="features-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('features.eyebrow')}</p>
          <h2 className="section-title" id="features-title">
            {t('features.title')}
          </h2>
        </div>
        <p className="section-intro">{t('features.intro')}</p>
      </div>
      <div className="workflow-editorial">
        <div className="workflow-summary">
          <span className="mono">01 / THE WORKBENCH</span>
          <h3>{t('features.workspace')}</h3>
          <p>{t('features.workspaceDesc')}</p>
          <div
            className="workflow-tabs"
            role="tablist"
            aria-label={t('features.tabsLabel')}
          >
            {WORKFLOWS.map((key, index) => (
              <button
                key={key}
                type="button"
                role="tab"
                id={`workflow-tab-${key}`}
                aria-selected={workflow === index}
                aria-controls={`workflow-panel-${key}`}
                tabIndex={workflow === index ? 0 : -1}
                ref={(node) => {
                  refs.current[index] = node
                }}
                onClick={() => setWorkflow(index)}
                onKeyDown={(event) => handleKey(event, index)}
              >
                {t(`features.${key}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="workflow-pages">
          {WORKFLOWS.map((key, index) => (
            <div
              className="workflow-panel"
              role="tabpanel"
              tabIndex={0}
              id={`workflow-panel-${key}`}
              aria-labelledby={`workflow-tab-${key}`}
              hidden={workflow !== index}
              key={key}
            >
              <span className="workflow-page-index mono">
                {t('features.workflowExample')} / 0{index + 1}
              </span>
              <h4 className="workflow-prompt">{t(`features.${key}Prompt`)}</h4>
              <ol>
                {[1, 2, 3].map((step) => (
                  <li key={step}>
                    <span className="mono">0{step}</span>
                    <span>{t(`features.${key}${step}`)}</span>
                    <Icon name="check" size={16} />
                  </li>
                ))}
              </ol>
              <span className="workflow-filename mono">
                {
                  [
                    'workspace / src / app.tsx',
                    'workspace / research.md',
                    'workspace / weekly-report.md',
                  ][index]
                }
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="tool-index">
        {[
          ['models', 'brain'],
          ['extensions', 'grid'],
          ['workflows', 'layers'],
          ['connect', 'globe'],
        ].map(([key, icon], index) => (
          <article className="tool-row" key={key}>
            <span className="tool-number mono">0{index + 2}</span>
            <Icon name={icon} size={22} />
            <h3>{t(`features.${key}Title`)}</h3>
            <p>{t(`features.${key}Desc`)}</p>
          </article>
        ))}
      </div>
      <div className="safety-strip">
        <Icon name="shield-check" size={29} />
        <div>
          <h3>{t('features.safetyTitle')}</h3>
          <p>{t('features.safetyDesc')}</p>
        </div>
        <a className="text-link" href={REPO} target="_blank" rel="noreferrer">
          {t('features.source')}
          <Icon name="arrow-right" size={16} />
        </a>
      </div>
      <div className="recall-feature">
        <div className="recall-copy">
          <p className="eyebrow">{t('features.recallLabel')}</p>
          <h2 className="section-title small">{t('features.recallTitle')}</h2>
          <p className="section-intro">{t('features.recallDesc')}</p>
          <ul className="check-list">
            {[1, 2, 3].map((n) => (
              <li key={n}>
                <Icon name="check" size={16} />
                {t(`features.recall${n}`)}
              </li>
            ))}
          </ul>
          <button className="text-link" type="button" onClick={onRecall}>
            {t('features.recallTry')}
            <Icon name="arrow-right" size={16} />
          </button>
        </div>
        <figure className="recall-capture">
          <img
            src={`/product/recall-${lang}.webp?model=deepseek-v4-1-flash`}
            width="1400"
            height="900"
            loading="lazy"
            decoding="async"
            alt={t('features.recallImage')}
          />
          <figcaption className="mono">
            CLERKBOX 4.1.1 / MESSAGE RECALL
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
