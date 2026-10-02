import { useI18n } from '../i18n'
import { Icon } from './Icons'

/**
 * 十五张能力卡，顺序即卖点优先级：开源与数据安全打头，v3.2 的界面模式 / Git / 桌面操控 /
 * Agent 浏览器 / 撤回回滚紧随，其余是通用 Agent 能力。每张的视觉区用纯 CSS 绘制（无图片依赖）。
 */
export default function Features() {
  const { t } = useI18n()
  const cards: Array<{ key: string; visual: React.ReactNode }> = [
    {
      key: 'f1',
      visual: (
        <div className="mini-list">
          <div className="ml-row">
            <Icon name="code" size={13} />
            <span>Apache-2.0</span>
            <span className="val ok">公开</span>
          </div>
          <div className="ml-row">
            <Icon name="folder" size={13} />
            <span>{t('features.f1row2')}</span>
            <span className="val ok">100%</span>
          </div>
          <div className="ml-row">
            <Icon name="wrench" size={13} />
            <span>{t('features.f1row3')}</span>
            <span className="val ok">
              <Icon name="check" size={11} />
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'f2',
      visual: (
        <div className="mini-list">
          <div className="ml-row">
            <Icon name="harddrive" size={13} />
            <span>{t('features.f2row1')}</span>
            <span className="val ok">
              <Icon name="check" size={11} />
            </span>
          </div>
          <div className="ml-row">
            <Icon name="lock" size={13} />
            <span>{t('features.f2row2')}</span>
            <span className="val ok">
              <Icon name="check" size={11} />
            </span>
          </div>
          <div className="ml-row">
            <Icon name="terminal" size={13} />
            <span>{t('features.f2row3')}</span>
            <span className="val warn">{t('features.f2wait')}</span>
          </div>
          <div className="ml-row">
            <Icon name="globe" size={13} />
            <span>{t('features.f2row4')}</span>
            <span className="val ok">{t('features.f2local')}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'f13',
      visual: (
        <div className="harness-mini">
          <div className="hm-row on">
            <Icon name="terminal" size={12} />
            <span>{t('features.f13row1')}</span>
            <i>✓</i>
          </div>
          <div className="hm-row">
            <Icon name="grid" size={12} />
            <span>{t('features.f13row2')}</span>
            <em>Ctrl+Shift+U</em>
          </div>
          <div className="hm-row" style={{ justifyContent: 'flex-start', opacity: 0.6, fontSize: 10.5 }}>
            <span>{t('features.f13foot')}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'f14',
      visual: (
        <div className="mini-list">
          <div className="ml-row">
            <Icon name="code" size={13} />
            <span>{t('features.f14row1')}</span>
            <span className="val ok">↑2</span>
          </div>
          <div className="ml-row">
            <Icon name="file" size={13} />
            <span>{t('features.f14row2')}</span>
            <span className="val ok">+186</span>
          </div>
          <div className="ml-row">
            <Icon name="folder" size={13} />
            <span>{t('features.f14row3')}</span>
            <span className="val ok">+214</span>
          </div>
          <div className="ml-foot">{t('features.f14foot')}</div>
        </div>
      ),
    },
    {
      key: 'f15',
      visual: (
        <div className="mini-list">
          <div className="ml-row">
            <Icon name="hand" size={13} />
            <span>{t('features.f15row1')}</span>
            <span className="val ok">
              <Icon name="check" size={11} />
            </span>
          </div>
          <div className="ml-row">
            <Icon name="hand" size={13} />
            <span>{t('features.f15row2')}</span>
            <span className="val ok">
              <Icon name="check" size={11} />
            </span>
          </div>
          <div className="ml-row">
            <Icon name="shield" size={13} />
            <span>{t('features.f15row3')}</span>
            <span className="val warn">{t('features.f15wait')}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'f16',
      visual: (
        <div className="mini-list">
          <div className="ml-row">
            <Icon name="globe" size={13} />
            <span>{t('features.f16row1')}</span>
            <span className="val ok">
              <Icon name="check" size={11} />
            </span>
          </div>
          <div className="ml-row">
            <Icon name="hand" size={13} />
            <span>{t('features.f16row2')}</span>
            <span className="val ok">
              <Icon name="check" size={11} />
            </span>
          </div>
          <div className="ml-row">
            <Icon name="file" size={13} />
            <span>{t('features.f16row3')}</span>
            <span className="val ok">
              <Icon name="check" size={11} />
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'f17',
      visual: (
        <div className="mini-list">
          <div className="ml-row">
            <Icon name="undo" size={13} />
            <span>{t('features.f17row1')}</span>
            <span className="val ok">
              <Icon name="check" size={11} />
            </span>
          </div>
          <div className="ml-row">
            <Icon name="file" size={13} />
            <span>{t('features.f17row2')}</span>
            <span className="val ok">
              <Icon name="check" size={11} />
            </span>
          </div>
          <div className="ml-row">
            <Icon name="shield" size={13} />
            <span>{t('features.f17row3')}</span>
            <span className="val warn">{t('features.f17wait')}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'f3',
      visual: (
        <div className="harness-mini">
          <div className="hm-row on">
            <span>{t('mock.harnessName')}</span>
            <i>✓</i>
          </div>
          <div className="hm-row">
            <span>Codex</span>
            <em>compat</em>
          </div>
          <div className="hm-row">
            <span>Grok Build</span>
            <em>compat</em>
          </div>
          <div className="hm-row">
            <span>dsh</span>
            <em>compat</em>
          </div>
          <div className="hm-row">
            <span>ZCode</span>
            <em>compat</em>
          </div>
        </div>
      ),
    },
    {
      key: 'f4',
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
      key: 'f5',
      visual: (
        <div className="mini-list">
          <div className="ml-row">
            <Icon name="calendar-clock" size={13} />
            <span>{t('features.f5meta')}</span>
            <span className="val ok">{t('features.f5ok')}</span>
          </div>
          <div className="ml-row">
            <Icon name="calendar-clock" size={13} />
            <span>{t('features.f5row2')}</span>
            <span className="val ok">{t('features.f5ok')}</span>
          </div>
          <div className="ml-row">
            <Icon name="calendar-clock" size={13} />
            <span>{t('features.f5row3')}</span>
            <span className="val ok">{t('features.f5ok')}</span>
          </div>
          <div className="ml-foot">{t('features.f5next')}</div>
        </div>
      ),
    },
    {
      key: 'f6',
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
      key: 'f7',
      visual: (
        <div className="react-wrap">
          <div className="react-ring" />
          <span className="react-node n1">{t('features.f7t').split(' ')[0]}</span>
          <span className="react-node n2">Tool</span>
          <span className="react-node n3">Obs</span>
          <span className="react-arrow a1">↘</span>
          <span className="react-arrow a2">↑</span>
          <span className="react-arrow a3">↗</span>
        </div>
      ),
    },
    {
      key: 'f8',
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
      key: 'f9',
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
      key: 'f10',
      visual: (
        <div className="goal-mini">
          <div className="gm-head">
            <span className="dot" />
            <span>{t('mock.goalTitle')}</span>
            <span className="pill">{t('mock.goalPill')}</span>
          </div>
          <div className="gm-cond">{t('mock.goalCond')}</div>
          <div className="gm-meta">{t('features.f10meta')}</div>
        </div>
      ),
    },
    {
      key: 'f11',
      visual: (
        <div className="persist-mini">
          <div className="pm-row">
            <span>{t('features.f11act1')}</span>
            <i>
              <Icon name="check" size={11} />
            </i>
          </div>
          <div className="pm-row">
            <span>{t('features.f11act2')}</span>
            <i>
              <Icon name="check" size={11} />
            </i>
          </div>
          <div className="pm-run">
            <span className="dot run" />
            <span>{t('mock.working')}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'f12',
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
