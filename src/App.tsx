import { useRef, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import AppMockup from './components/AppMockup'
import Features from './components/Features'
import Vibe from './components/Vibe'
import JoulePlan from './components/JoulePlan'
import Download from './components/Download'
import Footer from './components/Footer'
import { useI18n } from './i18n'
export default function App() {
  const { t } = useI18n()
  const [scenario, setScenario] = useState<'work' | 'vibe' | 'recall'>('work')
  const [demoRevision, setDemoRevision] = useState(0)
  const demoRef = useRef<HTMLElement>(null)
  const explore = (next: 'vibe' | 'recall') => {
    setScenario(next)
    setDemoRevision(value => value + 1)
    demoRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    demoRef.current?.focus({ preventScroll: true })
  }
  return <><Header /><main id="main" tabIndex={-1}><Hero /><section className="workspace-section container" id="workspace" aria-labelledby="workspace-title" ref={demoRef} tabIndex={-1}><div className="workspace-caption"><h2 id="workspace-title">{t('hero.demoTitle')}</h2><p>{t('hero.demoNote')}</p></div><AppMockup scenario={scenario} requestRevision={demoRevision} /></section><div className="container facts-row">{[1, 2, 3].map(n => <div key={n}><span className="fact-mark" aria-hidden="true">{['↳', '✳', '⌘'][n - 1]}</span><div><h3>{t(`hero.fact${n}`)}</h3><p>{t(`hero.fact${n}sub`)}</p></div></div>)}</div><Features onRecall={() => explore('recall')} /><Vibe onExplore={() => explore('vibe')} /><JoulePlan /><Download /></main><Footer /></>
}
