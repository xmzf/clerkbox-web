import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '../i18n'
import { Icon } from './Icons'

export type DemoScenario = 'work' | 'vibe' | 'recall'
const SCENARIOS: DemoScenario[] = ['work', 'vibe', 'recall']
const PANELS = ['files', 'terminal', 'git'] as const
type Panel = typeof PANELS[number]
type DemoSession = 'homepage' | 'research'
interface SessionState {
  recalled: boolean
  filesRestored: boolean
  draft: string
  draftRestored: boolean
  localMessages: string[]
  notice: string
}
const emptySession = (): SessionState => ({ recalled: false, filesRestored: false, draft: '', draftRestored: false, localMessages: [], notice: '' })

/** A local demonstration: no model calls, uploads, or changes to real files. */
export default function AppMockup({ scenario, requestRevision }: { scenario?: DemoScenario; requestRevision?: number }) {
  const { t } = useI18n()
  const [mode, setMode] = useState<DemoScenario>(scenario ?? 'work')
  const [panel, setPanel] = useState<Panel>('files')
  const [drawer, setDrawer] = useState(false)
  const [customize, setCustomize] = useState(false)
  const [opacity, setOpacity] = useState(80)
  const [background, setBackground] = useState<'dusk' | 'forest'>('dusk')
  const [recalled, setRecalled] = useState(false)
  const [recallOpen, setRecallOpen] = useState(false)
  const [withFiles, setWithFiles] = useState(false)
  const [filesRestored, setFilesRestored] = useState(false)
  const [draft, setDraft] = useState('')
  const [draftRestored, setDraftRestored] = useState(false)
  const [localMessages, setLocalMessages] = useState<string[]>([])
  const [notice, setNotice] = useState('')
  const [session, setSession] = useState<DemoSession>('homepage')
  const sessionStates = useRef<Partial<Record<DemoSession, SessionState>>>({})
  const id = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const panelTabs = useRef<Array<HTMLButtonElement | null>>([])
  const customizeRef = useRef<HTMLButtonElement>(null)
  const customizePanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (scenario) setMode(scenario) }, [scenario, requestRevision])
  useEffect(() => { setCustomize(false); setDrawer(false); setRecallOpen(false) }, [mode])
  useEffect(() => {
    if (!recallOpen) return
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    return () => { dialog.close(); triggerRef.current?.focus({ preventScroll: true }) }
  }, [recallOpen])
  useEffect(() => {
    if (recalled && !recallOpen) textareaRef.current?.focus({ preventScroll: true })
  }, [recalled, recallOpen])
  useEffect(() => {
    if (!customize) return
    const outside = (event: PointerEvent) => {
      if (!customizePanelRef.current?.contains(event.target as Node) && !customizeRef.current?.contains(event.target as Node)) setCustomize(false)
    }
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape' || event.isComposing) return
      setCustomize(false); customizeRef.current?.focus({ preventScroll: true })
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [customize])

  function reset() {
    setRecalled(false); setWithFiles(false); setFilesRestored(false)
    setDraft(''); setDraftRestored(false); setNotice(''); setLocalMessages([])
  }
  function switchSession(next: DemoSession) {
    if (next !== session) {
      sessionStates.current[session] = { recalled, filesRestored, draft, draftRestored, localMessages, notice }
      const saved = sessionStates.current[next] ?? emptySession()
      setRecalled(saved.recalled); setFilesRestored(saved.filesRestored)
      setDraft(saved.draft); setDraftRestored(saved.draftRestored)
      setLocalMessages(saved.localMessages); setNotice(saved.notice)
      setWithFiles(false); setSession(next)
    }
    setDrawer(false)
  }
  function resetAll() {
    sessionStates.current = {}
    reset(); setSession('homepage'); setDrawer(false)
  }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number, kind: 'scenario' | 'panel') {
    const values = kind === 'scenario' ? SCENARIOS : PANELS
    const next = event.key === 'ArrowRight' ? (index + 1) % values.length : event.key === 'ArrowLeft' ? (index - 1 + values.length) % values.length : event.key === 'Home' ? 0 : event.key === 'End' ? values.length - 1 : -1
    if (next < 0 || event.nativeEvent.isComposing) return
    event.preventDefault()
    if (kind === 'scenario') { setMode(SCENARIOS[next]); tabs.current[next]?.focus() }
    else { setPanel(PANELS[next]); panelTabs.current[next]?.focus() }
  }
  function confirmRecall() {
    // The real desktop app protects an existing draft; the example must do the same.
    if (draft.trim() || draftRestored) return
    setRecalled(true); setFilesRestored(withFiles); setDraft(prompt); setDraftRestored(true); setLocalMessages([])
    setNotice(withFiles ? t('demo.recalledFilesNotice') : t('demo.recalledNotice')); setRecallOpen(false)
  }
  function sendLocalDraft() {
    if (!draft.trim()) return
    setLocalMessages((messages) => [...messages, draft.trim()]); setDraft(''); setDraftRestored(false); setNotice(t('demo.localSent'))
  }

  const isVibe = mode === 'vibe'
  const prompt = session === 'homepage' ? t('demo.prompt') : t('demo.researchPrompt')
  const title = session === 'homepage' ? t('demo.sessionTitle') : t('demo.researchTitle')
  const draftConflict = !!draft.trim() || draftRestored
  const fileContent = filesRestored ? 'export default function Home() {\n  return <main>Hello, world.</main>\n}' : 'export default function Home() {\n  return (\n    <main className="workspace">\n      <h1>Make room for your ideas.</h1>\n      <ProjectGallery />\n    </main>\n  )\n}'

  return (
    <div className="product-demo" data-scenario={mode}>
      <div className="product-demo-controls">
        <span className="product-demo-label"><span aria-hidden="true" />{t('demo.interactive')}</span>
        <div role="tablist" aria-label={t('demo.scenarios')} className="product-demo-scenarios">
          {SCENARIOS.map((value, index) => <button key={value} type="button" role="tab" id={`${id}-tab-${value}`} aria-controls={`${id}-preview`} aria-selected={mode === value} tabIndex={mode === value ? 0 : -1} ref={(element) => { tabs.current[index] = element }} onClick={() => setMode(value)} onKeyDown={(event) => tabKey(event, index, 'scenario')}><Icon name={value === 'work' ? 'grid' : value === 'vibe' ? 'sparkles' : 'rotate-cw'} size={15} />{t(`demo.${value}`)}</button>)}
        </div>
      </div>
      <div className={`product-demo-window ${isVibe ? `is-vibe atmosphere-${background}` : ''}`} id={`${id}-preview`} role="tabpanel" aria-labelledby={`${id}-tab-${mode}`} style={{ '--reading-opacity': opacity / 100 } as CSSProperties}>
        <div className="product-demo-titlebar">
          <div className="product-demo-brand"><img src="/clerkbox.png" alt="" width="21" height="21" /><span>ClerkBox</span><span className="product-demo-version">4.0</span></div>
          <span className="product-demo-title">{title}</span><span className="product-demo-window-dots" aria-hidden="true"><i /><i /><i /></span>
        </div>
        {isVibe && <div className="product-demo-vibe-toolbar">
          <button type="button" aria-label={t('demo.toggleSessions')} aria-expanded={drawer} aria-controls={`${id}-sessions`} onClick={() => setDrawer((value) => !value)}><Icon name="panel-left" size={16} /><span>{t('demo.sessions')}</span></button>
          <span className="product-demo-vibe-word"><Icon name="sparkles" size={13} /> VIBE</span>
          <button type="button" ref={customizeRef} aria-expanded={customize} aria-controls={`${id}-customize`} onClick={() => setCustomize((value) => !value)}><Icon name="settings" size={16} />{t('demo.atmosphere')}</button>
          {customize && <div ref={customizePanelRef} className="product-demo-customize" id={`${id}-customize`}>
            <div className="product-demo-customize-title">{t('demo.atmosphere')}<button type="button" aria-label={t('demo.close')} onClick={() => { setCustomize(false); customizeRef.current?.focus() }}><Icon name="x" /></button></div>
            <label htmlFor={`${id}-opacity`}>{t('demo.readingOpacity')}<output htmlFor={`${id}-opacity`}>{opacity}%</output></label>
            <input id={`${id}-opacity`} type="range" min="45" max="95" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} />
            <div className="product-demo-backdrops" role="group" aria-label={t('demo.background')}>{(['dusk', 'forest'] as const).map(value => <button key={value} type="button" className={`product-demo-swatch swatch-${value}`} aria-pressed={background === value} onClick={() => setBackground(value)}>{t(`demo.${value}`)}</button>)}</div>
            <p>{t('demo.atmosphereHint')}</p>
          </div>}
        </div>}
        <div className={`product-demo-body ${isVibe ? 'is-vibe' : ''}`}>
          <aside className={`product-demo-sidebar ${isVibe && !drawer ? 'is-hidden' : ''}`} id={`${id}-sessions`} aria-label={t('demo.sessions')}>
            <button type="button" className="product-demo-new" onClick={resetAll}><Icon name="plus" size={15} />{t('demo.newSession')}</button>
            <span className="product-demo-side-label">{t('demo.workspace')}</span><div className="product-demo-project"><Icon name="folder" size={14} />clerkbox-project</div>
            <button type="button" className={`product-demo-session ${session === 'homepage' ? 'active' : ''}`} aria-pressed={session === 'homepage'} onClick={() => switchSession('homepage')}><Icon name="message" size={14} />{t('demo.sessionTitle')}</button>
            <button type="button" className={`product-demo-session ${session === 'research' ? 'active' : ''}`} aria-pressed={session === 'research'} onClick={() => switchSession('research')}><Icon name="message" size={14} />{t('demo.researchTitle')}</button>
            <div className="product-demo-sidebar-bottom"><Icon name="lock" size={13} /><span>{t('demo.localExample')}</span></div>
          </aside>
          <div className="product-demo-conversation">
            <div className="product-demo-conversation-heading"><span>{title}</span><span className="product-demo-ready"><i />{t('demo.ready')}</span></div>
            <div className="product-demo-messages">
              {mode === 'recall' && <div className="product-demo-context"><Icon name="check" size={13} />{t('demo.earlierMessage')}</div>}
              {!recalled && <>
                <div className="product-demo-user"><div className="product-demo-message-tags"><span><Icon name="paperclip" size={12} />brief.md</span><span>Plan</span></div><p>{prompt}</p></div>
                {mode === 'recall' && <button ref={triggerRef} type="button" className="product-demo-recall-button" onClick={() => { setWithFiles(false); setRecallOpen(true) }}><Icon name="rotate-cw" size={13} />{t('demo.recallAction')}</button>}
                <div className="product-demo-assistant">
                  <div className="product-demo-agent"><img src="/clerkbox.png" alt="" width="22" height="22" /><strong>ClerkBox</strong></div>
                  <details className="product-demo-thought"><summary><Icon name="sparkles" size={13} />{t('demo.thought')}<Icon name="chevron-right" size={12} /></summary><p>{t('demo.thoughtBody')}</p></details>
                  <p>{session === 'homepage' ? t('demo.response') : t('demo.researchResponse')}</p>
                  <details className="product-demo-tool"><summary><Icon name="folder" size={14} /><span>{t('demo.toolRead')}</span><span className="product-demo-tool-count">3 {t('demo.filesUnit')}</span><Icon name="chevron-right" size={12} /></summary><ul><li>src/pages/Home.tsx</li><li>src/styles/global.css</li><li>package.json</li></ul></details>
                  <div className="product-demo-write"><Icon name="check" size={13} /><span>{t('demo.updatedFile')}</span><code>Home.tsx</code><em>+24 −8</em></div><p className="product-demo-result">{t('demo.result')}</p>
                </div>
                {mode === 'recall' && <div className="product-demo-followup"><span>{t('demo.followup')}</span><p>{t('demo.followupResponse')}</p></div>}
              </>}
              {recalled && <div className="product-demo-restored-state"><span className="product-demo-restored-icon"><Icon name="rotate-cw" size={22} /></span><h4>{t('demo.restoredTitle')}</h4><p>{t('demo.restoredBody')}</p><button type="button" onClick={reset}>{t('demo.reset')}<Icon name="rotate-cw" size={13} /></button></div>}
              {localMessages.map((message, index) => <div key={index} className="product-demo-user product-demo-local-message"><p>{message}</p><small>{t('demo.localMessage')}</small></div>)}
            </div>
            <div className="product-demo-composer-area"><div className="product-demo-notice" role="status">{notice}</div><div className="product-demo-composer">
              {draftRestored && <div className="product-demo-draft-tags"><span><Icon name="paperclip" size={12} />brief.md</span><span>Plan</span></div>}
              <textarea ref={textareaRef} aria-label={t('demo.inputLabel')} placeholder={t('demo.inputPlaceholder')} value={draft} rows={2} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.nativeEvent.keyCode !== 229) { event.preventDefault(); sendLocalDraft() } }} />
              <div className="product-demo-composer-footer"><span><Icon name="folder" size={12} />clerkbox-project</span><span className="product-demo-model">Joule · {t('demo.model')}</span><button type="button" aria-label={t('demo.sendLocal')} disabled={!draft.trim()} onClick={sendLocalDraft}><Icon name="arrow-up" size={16} /></button></div>
            </div></div>
          </div>
          <aside className="product-demo-workbench" aria-label={t('demo.workbench')}>
            <div className="product-demo-workbench-tabs" role="tablist" aria-label={t('demo.workbench')}>{PANELS.map((value, index) => <button key={value} type="button" role="tab" id={`${id}-panel-tab-${value}`} aria-controls={`${id}-workbench-panel`} aria-selected={panel === value} tabIndex={panel === value ? 0 : -1} ref={(element) => { panelTabs.current[index] = element }} onClick={() => setPanel(value)} onKeyDown={(event) => tabKey(event, index, 'panel')}>{t(`demo.${value}`)}</button>)}</div>
            <div className="product-demo-panel" role="tabpanel" id={`${id}-workbench-panel`} aria-labelledby={`${id}-panel-tab-${panel}`} tabIndex={0}>
              {panel === 'files' && <><div className="product-demo-filetree"><span><Icon name="folder" size={13} />src / pages</span><span className="active"><Icon name="file" size={13} />Home.tsx {!filesRestored && <em>M</em>}</span><span><Icon name="file" size={13} />global.css</span></div><div className="product-demo-file-title"><Icon name="code" size={13} />Home.tsx<span>TSX</span></div><pre className="product-demo-code"><code>{fileContent.split('\n').map((line, index) => <span key={index}><i>{index + 1}</i>{line}</span>)}</code></pre><div className="product-demo-file-status"><Icon name="check" size={12} />{filesRestored ? t('demo.fileRestored') : t('demo.fileKept')}</div></>}
              {panel === 'terminal' && <div className="product-demo-terminal"><p><span>~/clerkbox-project</span> main</p><p>❯ npm run build</p><p className="muted">vite · building for production…</p><p className="success">✓ 48 modules transformed.</p><p>dist/index.html <span>0.56 kB</span></p><p>dist/assets/index.css <span>8.24 kB</span></p><p className="success">✓ built in 1.2s</p><p className="product-demo-terminal-note">{t('demo.terminalNote')}</p></div>}
              {panel === 'git' && <div className="product-demo-git"><div><Icon name="code" size={14} /><strong>main</strong><span>{t('demo.gitReview')}</span></div><p>{filesRestored ? t('demo.gitClean') : t('demo.gitChanged')}</p>{filesRestored ? <div className="product-demo-git-clean"><Icon name="circle-check" size={22} /><p>{t('demo.gitRestored')}</p></div> : <><div className="product-demo-diff-file">src/pages/Home.tsx <em>+24 −8</em></div><pre><del>− &lt;main&gt;Hello, world.&lt;/main&gt;</del><ins>+ &lt;main className="workspace"&gt;</ins><ins>+   &lt;ProjectGallery /&gt;</ins><ins>+ &lt;/main&gt;</ins></pre></>}<small>{t('demo.gitNote')}</small></div>}
            </div>
          </aside>
        </div>
      </div>
      <div className="product-demo-caption"><span>{t(`demo.${mode}Caption`)}</span><small>{t('demo.disclaimer')}</small></div>
      {recallOpen && typeof document !== 'undefined' && createPortal(<dialog ref={dialogRef} className="product-demo-dialog" aria-labelledby={`${id}-recall-title`} aria-describedby={`${id}-recall-description`} onKeyDown={(event) => { if (event.key === 'Escape' && (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)) { event.preventDefault(); event.stopPropagation() } }} onCancel={(event) => { event.preventDefault(); setRecallOpen(false) }} onClick={(event) => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setRecallOpen(false) } }}>
        <div className="product-demo-dialog-header"><span><Icon name="rotate-cw" size={18} />{t('demo.recallTitle')}</span><button type="button" aria-label={t('demo.close')} onClick={() => setRecallOpen(false)}><Icon name="x" size={18} /></button></div>
        <div className="product-demo-dialog-body"><h3 id={`${id}-recall-title`}>{t('demo.recallHeading')}</h3><p id={`${id}-recall-description`}>{t('demo.recallDescription').replace('{count}', String(4 + localMessages.length))}</p><blockquote><span>brief.md · Plan</span>{prompt}</blockquote><label className="product-demo-file-toggle"><input type="checkbox" checked={withFiles} onChange={(event) => setWithFiles(event.target.checked)} /><span>{t('demo.withFiles')}<small>{t('demo.withFilesHint')}</small></span></label>{draftConflict && <p role="alert" className="product-demo-draft-conflict">{t('demo.draftConflict')}</p>}<p className="product-demo-dialog-note">{t('demo.recallWarning')}</p></div>
        <div className="product-demo-dialog-footer"><button type="button" autoFocus onClick={() => setRecallOpen(false)}>{t('demo.cancel')}</button><button type="button" className="confirm" disabled={draftConflict} onClick={confirmRecall}>{t('demo.confirm')}</button></div>
      </dialog>, document.body)}
    </div>
  )
}
