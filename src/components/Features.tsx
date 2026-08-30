import { useI18n } from '../i18n'

/** 六张能力卡，每张的视觉区用纯 CSS 绘制（无图片依赖） */
export default function Features() {
  const { t } = useI18n()
  const cards: Array<{ key: string; visual: React.ReactNode }> = [
    {
      key: 'f1',
      visual: (
        <div className="chip-row">
          <span className="mini-chip hl">Lunora</span>
          <span className="mini-chip">OpenAI</span>
          <span className="mini-chip">Anthropic</span>
          <span className="mini-chip">Gemini</span>
          <span className="mini-chip">DeepSeek</span>
          <span className="mini-chip">GLM</span>
          <span className="mini-chip">Qwen</span>
          <span className="mini-chip">Kimi</span>
          <span className="mini-chip">Ollama</span>
        </div>
      ),
    },
    {
      key: 'f2',
      visual: (
        <div className="react-wrap">
          <div className="react-ring" />
          <span className="react-node n1">{t('features.f2t').split(' ')[0]}</span>
          <span className="react-node n2">Tool</span>
          <span className="react-node n3">Obs</span>
          <span className="react-arrow a1">↘</span>
          <span className="react-arrow a2">↑</span>
          <span className="react-arrow a3">↗</span>
        </div>
      ),
    },
    {
      key: 'f3',
      visual: (
        <div className="subagent-tree">
          <span className="sa-root">Main Agent</span>
          <span className="sa-stem" />
          <span className="sa-branch" />
          <div className="sa-row">
            <div className="sa-card">
              <div className="n">
                <span className="dot run" />
                explore
              </div>
              <div className="d">read-only</div>
            </div>
            <div className="sa-card">
              <div className="n">
                <span className="dot ok" />
                general
              </div>
              <div className="d">all-tools</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'f4',
      visual: (
        <div className="skill-stack">
          <div className="skill-card sc1">
            <span className="f">SKILL.md · code-review</span>
            <span className="badge ok">✓</span>
          </div>
          <div className="skill-card sc2">
            <span className="f">SKILL.md · doc-writer</span>
            <span className="badge add">+</span>
          </div>
        </div>
      ),
    },
    {
      key: 'f5',
      visual: (
        <div className="vibe-blob">
          <div className="vibe-pill">
            <span className="disc">♪</span>
            <span>
              Lo-fi Beats · 02:34
              <br />
              <span style={{ opacity: 0.6, fontSize: 11 }}>liquid glass</span>
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'f6',
      visual: (
        <div className="md3-demo">
          <div className="seed-row">
            <span className="s" style={{ background: '#7c5cfc' }} />
            <span className="s" style={{ background: '#f4a7b9' }} />
            <span className="s" style={{ background: '#98d8c8' }} />
            <span className="s" style={{ background: '#a7c7e7' }} />
            <span className="s sel" style={{ background: '#b4a7d6' }} />
          </div>
          <div className="tonal-strip">
            <span className="tv" style={{ background: '#493f77' }} />
            <span className="tv" style={{ background: '#7c5cfc' }} />
            <span className="tv" style={{ background: '#cabeff' }} />
            <span className="tv" style={{ background: '#e6deff' }} />
            <span className="tv" style={{ background: '#2b292f' }} />
            <span className="tv" style={{ background: '#c9c4d0' }} />
          </div>
        </div>
      ),
    },
  ]

  return (
    <section className="section" id="features">
      <div className="container">
        <div className="sec-label">{t('features.label')}</div>
        <h2 className="sec-title">{t('features.title')}</h2>
        <p className="sec-sub">{t('features.sub')}</p>
        <div className="feat-grid">
          {cards.map((c) => (
            <article className="feat-card" key={c.key}>
              <div className="feat-visual">{c.visual}</div>
              <div className="feat-body">
                <h3>{t(`features.${c.key}t`)}</h3>
                <p>{t(`features.${c.key}d`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
