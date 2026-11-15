import { useRef, useState, type KeyboardEvent } from 'react'
import { useI18n } from '../i18n'
import { Icon } from './Icons'
import { REPO } from './Header'
const WORKFLOWS = ['coding', 'research', 'automate'] as const
export default function Features({ onRecall }: { onRecall: () => void }) {
  const { t } = useI18n()
  const [workflow, setWorkflow] = useState(0)
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const handleKey = (event: KeyboardEvent, index: number) => {
    const next = event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : -1
    if (next >= 0) { event.preventDefault(); setWorkflow(next); refs.current[next]?.focus() }
  }
  return <section className="section container" id="features" aria-labelledby="features-title">
    <div className="section-heading"><div><p className="eyebrow">{t('features.eyebrow')}</p><h2 className="section-title" id="features-title">{t('features.title')}</h2></div><p className="section-intro">{t('features.intro')}</p></div>
    <div className="capabilities-grid"><article className="capability workspace-card"><div className="capability-heading"><span className="feature-icon"><Icon name="panel-right" size={22} /></span><span className="mono">THE WORKBENCH</span></div><h3>{t('features.workspace')}</h3><p>{t('features.workspaceDesc')}</p>
      <div className="workflow-tabs" role="tablist" aria-label={t('features.tabsLabel')}>{WORKFLOWS.map((key, index) => <button key={key} type="button" role="tab" id={`workflow-tab-${key}`} aria-selected={workflow === index} aria-controls={`workflow-panel-${key}`} tabIndex={workflow === index ? 0 : -1} ref={node => { refs.current[index] = node }} onClick={() => setWorkflow(index)} onKeyDown={event => handleKey(event, index)}>{t(`features.${key}`)}</button>)}</div>
      {WORKFLOWS.map((key, index) => <div className="workflow-panel" role="tabpanel" tabIndex={0} id={`workflow-panel-${key}`} aria-labelledby={`workflow-tab-${key}`} hidden={workflow !== index} key={key}><p className="workflow-prompt">{t(`features.${key}Prompt`)}</p><ol>{[1, 2, 3].map(step => <li key={step}><span className="workflow-check"><Icon name="check" size={13} /></span>{t(`features.${key}${step}`)}</li>)}</ol><span className="workflow-filename mono">{['workspace / src / app.tsx', 'workspace / research.md', 'workspace / weekly-report.md'][index]}</span></div>)}
    </article><article className="capability models-card"><div className="model-orbit" aria-hidden="true"><span className="model-center"><img src="/clerkbox.png" alt="" width="38" height="38" /></span><span className="model-chip mc1">Joule</span><span className="model-chip mc2">Claude</span><span className="model-chip mc3">DeepSeek</span><span className="model-chip mc4">Ollama</span></div><h3>{t('features.modelsTitle')}</h3><p>{t('features.modelsDesc')}</p><span className="capability-note">{t('features.modelsNote')}</span></article>
    {[['extensions', 'grid'], ['workflows', 'layers'], ['connect', 'globe']].map(([key, icon]) => <article className="capability compact-card" key={key}><span className="feature-icon"><Icon name={icon} size={22} /></span><h3>{t(`features.${key}Title`)}</h3><p>{t(`features.${key}Desc`)}</p></article>)}</div>
    <div className="safety-strip"><Icon name="shield-check" size={29} /><div><h3>{t('features.safetyTitle')}</h3><p>{t('features.safetyDesc')}</p></div><a className="text-link" href={REPO} target="_blank" rel="noreferrer">{t('features.source')}<Icon name="arrow-right" size={16} /></a></div>
    <div className="recall-feature"><div className="recall-art" aria-hidden="true"><div className="recall-art-line"><span>01</span><i /><b>✓</b></div><div className="recall-art-line"><span>02</span><i /><b>✓</b></div><div className="recall-art-line recall-art-faded"><span>03</span><i /></div><div className="recall-art-arrow">↶</div><span className="recall-art-label mono">A FRESH START.</span></div><div><p className="eyebrow">{t('features.recallLabel')}</p><h2 className="section-title small">{t('features.recallTitle')}</h2><p className="section-intro">{t('features.recallDesc')}</p><ul className="check-list">{[1, 2, 3].map(n => <li key={n}><Icon name="check" size={16} />{t(`features.recall${n}`)}</li>)}</ul><button className="text-link" type="button" onClick={onRecall}>{t('features.recallTry')}<Icon name="arrow-right" size={16} /></button></div></div>
  </section>
}
