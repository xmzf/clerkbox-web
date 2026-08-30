import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { Icon } from './Icons'

type TabKind = 'files' | 'terminal' | 'browser' | 'subagent'
const TAB_ORDER: TabKind[] = ['files', 'terminal', 'browser', 'subagent']
const TAB_ICON: Record<TabKind, string> = {
  files: 'folder',
  terminal: 'terminal',
  browser: 'globe',
  subagent: 'bot',
}

const REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** AgentStatusIndicator 的 3×3 像素网格节拍（chevron 波形；null = 常暗格） */
const STATUS_DELAYS: Array<number | null> = [0, 60, 120, 180, 240, 300, 240, 180, null]

/**
 * ClerkBox 主工作台复刻。
 * 结构 / 配色 / 文案逐项对照真实组件：
 * TitleBar.tsx · Sidebar.tsx · MessageItem.tsx · GoalBanner.tsx · ChatInput.tsx · WorkbenchPanel.tsx
 */
export default function AppMockup() {
  const { t, lang } = useI18n()

  // 工作台 tab：自动轮播，点击后固定 9 秒
  const [tab, setTab] = useState<TabKind>('files')
  const pinUntil = useRef(0)
  useEffect(() => {
    if (REDUCED_MOTION) return
    const id = setInterval(() => {
      if (Date.now() < pinUntil.current) return
      setTab((cur) => TAB_ORDER[(TAB_ORDER.indexOf(cur) + 1) % TAB_ORDER.length])
    }, 3400)
    return () => clearInterval(id)
  }, [])
  const pickTab = (k: TabKind) => {
    setTab(k)
    pinUntil.current = Date.now() + 9000
  }

  // 流式消息打字机
  const streamText = t('mock.stream')
  const [streamLen, setStreamLen] = useState(REDUCED_MOTION ? streamText.length : 0)
  useEffect(() => {
    if (REDUCED_MOTION) {
      setStreamLen(streamText.length)
      return
    }
    setStreamLen(0)
    let i = 0
    let resetTimer: ReturnType<typeof setTimeout> | undefined
    const id = setInterval(() => {
      i += 1
      setStreamLen(i)
      if (i >= streamText.length) {
        clearInterval(id)
        resetTimer = setTimeout(() => setStreamLen(0), 4200)
      }
    }, 58)
    return () => {
      clearInterval(id)
      if (resetTimer) clearTimeout(resetTimer)
    }
  }, [streamText])

  // 终端逐行输出，循环播放
  const TERM_LINES = 7
  const [termN, setTermN] = useState(REDUCED_MOTION ? TERM_LINES : 2)
  useEffect(() => {
    if (REDUCED_MOTION) return
    let n = 2
    const id = setInterval(() => {
      n = n >= TERM_LINES ? 2 : n + 1
      setTermN(n)
    }, 760)
    return () => clearInterval(id)
  }, [])

  // AgentStatusIndicator 计时（真实组件 100ms 粒度）
  const [ds, setDs] = useState(REDUCED_MOTION ? 324 : 0)
  useEffect(() => {
    if (REDUCED_MOTION) return
    const id = setInterval(() => setDs((d) => d + 1), 100)
    return () => clearInterval(id)
  }, [])
  const totalSec = ds / 10
  const elapsed = totalSec < 60 ? `${totalSec.toFixed(1)}s` : `${Math.floor(totalSec / 60)}m ${(totalSec % 60).toFixed(1)}s`

  const streamShown = streamText.slice(0, streamLen)

  // write_file 行标签：真实组件是「写入 N 行」（按写入内容行数计数）
  const writeLabel = (n: number) => (lang === 'zh' ? `写入 ${n} 行` : `Wrote ${n} lines`)

  // 消息列表：真实应用流式时自动滚到底（用户上翻则不打扰）
  const msgsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = msgsRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    if (nearBottom) el.scrollTop = el.scrollHeight
  }, [streamLen])

  // 输入框：可真实输入，发送后平滑滚动到下载区（官网演示的引导行为）
  const [draft, setDraft] = useState('')
  const sendDraft = () => {
    setDraft('')
    document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="mock-outer">
      <div className="mock-glow" />
      {/* 结构对照 App.tsx：Sidebar 全高贴顶；TitleBar 只盖右侧列，其下才是 对话+工作台 */}
      <div className="mock">
        {/* ── Sidebar：对照 Sidebar.tsx（新会话 / 插件市场 / 按工作目录分组的任务列表 / 底部入口） ── */}
        <aside className="m-side">
          <div className="m-side-head">
            <img src="/clerkbox.png" alt="" />
            <span className="nm">ClerkBox</span>
          </div>
          <div className="m-side-btns">
            <span className="m-side-btn">
              <Icon name="plus" size={15} />
              {t('mock.newChat')}
            </span>
            <span className="m-side-btn">
              <Icon name="store" size={15} />
              {t('mock.skills')}
            </span>
          </div>
          <div className="m-tasklabel">
            <span>{t('mock.taskList')}</span>
            <Icon name="chevron-down" size={12} />
          </div>
          <div className="m-groups">
            <div className="m-grp">
              <div className="m-grp-head">
                <Icon name="folder-open" size={13} />
                <span>{t('mock.groupA')}</span>
                <span className="cnt">2</span>
                <Icon name="chevron-down" size={11} />
              </div>
              <div className="m-task active" title={t('mock.working')}>
                <span className="ic">
                  <Icon name="message" size={13} />
                </span>
                <span className="tt">{t('mock.t1')}</span>
                <span className="m-spin" />
              </div>
              <div className="m-task">
                <span className="ic">
                  <Icon name="message" size={13} />
                </span>
                <span className="tt">{t('mock.t2')}</span>
              </div>
            </div>
            <div className="m-grp">
              <div className="m-grp-head">
                <Icon name="folder-open" size={13} />
                <span>{t('mock.groupB')}</span>
                <span className="cnt">1</span>
                <Icon name="chevron-down" size={11} />
              </div>
              <div className="m-task">
                <span className="ic">
                  <Icon name="message" size={13} />
                </span>
                <span className="tt">{t('mock.t3')}</span>
              </div>
            </div>
            <div className="m-grp">
              <div className="m-grp-head">
                <Icon name="folder-open" size={13} />
                <span>{t('mock.groupC')}</span>
                <span className="cnt">1</span>
                <Icon name="chevron-down" size={11} />
              </div>
              <div className="m-task">
                <span className="ic">
                  <Icon name="message" size={13} />
                </span>
                <span className="tt">{t('mock.t4')}</span>
              </div>
            </div>
          </div>
          <div className="m-side-foot">
            <span className="m-foot-row">
              <Icon name="globe" size={15} />
              {t('mock.webui')}
            </span>
            <span className="m-foot-row">
              <Icon name="settings" size={15} />
              {t('mock.settings')}
            </span>
            <span className="m-foot-row">
              <span className="avatar">X</span>
              {t('mock.signedOut')}
            </span>
          </div>
        </aside>

        {/* ── 右列：TitleBar + （对话 + 工作台），对照 App.tsx 的 flex-col ── */}
        <div className="m-right">
          <div className="m-titlebar">
            <div className="m-tb-left">
              <span className="m-row-btn">
                <Icon name="panel-left" size={16} />
              </span>
              <span className="m-ver">v2.1.0</span>
            </div>
            <div className="m-tb-right">
              <span className="m-vibe">
                <Icon name="sparkles" size={13} />
                {lang === 'zh' ? '氛围' : 'VIBE'}
              </span>
              {/* ContextUsageIndicator：18px 裸环（白色 18% 轨道 + 弧线），无数字 */}
              <span className="m-ctx" title="22%">
                <svg width="18" height="18" viewBox="0 0 18 18" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="9" cy="9" r="7.25" fill="none" strokeWidth="2" stroke="#ffffff" strokeOpacity={0.18} />
                  <circle
                    cx="9"
                    cy="9"
                    r="7.25"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    stroke="#89b4fa"
                    strokeDasharray={`${2 * Math.PI * 7.25 * 0.22} ${2 * Math.PI * 7.25}`}
                  />
                </svg>
              </span>
              <span className="m-row-btn active">
                <Icon name="panel-right" size={16} />
              </span>
              <span className="m-row-btn">
                <Icon name="minus" size={15} />
              </span>
              <span className="m-row-btn">
                <Icon name="square" size={13} />
              </span>
              <span className="m-row-btn close">
                <Icon name="x" size={15} />
              </span>
            </div>
          </div>

          <div className="m-mainrow">
            {/* ── Chat：对照 ChatPage/MessageItem/GoalBanner/ChatInput ── */}
            <main className="m-chat">
              <div className="m-msgs" ref={msgsRef}>
                {/* 用户消息：右对齐 primaryContainer 气泡 + Goal 芯片 + 时间戳 */}
                <div className="m-user">
                  <div className="m-user-col">
                    <div className="m-user-bubble">
                      <span className="m-chip-goal">
                        <Icon name="target" size={10} />
                        Goal
                      </span>
                      {t('mock.user1')}
                    </div>
                    <span className="m-time">{t('mock.timeAt')}</span>
                  </div>
                </div>

                {/* 助手过程消息：思考折叠头 + 气泡 + 平铺工具行（可展开） */}
                <div>
                  <ThoughtRow text={t('mock.thought')} body={t('mock.thinkBody')} />
                  <div className="m-ai-bubble">{t('mock.msgA')}</div>
                  <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <ToolRow icon="terminal" name={t('mock.toolS')} path="亮点速览" params={'{\n  "pattern": "亮点速览",\n  "path": "README.md"\n}'} />
                    <ToolRow icon="file" name={writeLabel(96)} path="index.html" add={96} params={'{\n  "path": "index.html",\n  "content": "<!doctype html>…"\n}'} />
                    <ToolRow icon="file" name={writeLabel(208)} path="src/styles/home.css" add={208} params={'{\n  "path": "src/styles/home.css",\n  "content": ":root { --md-primary: … }"\n}'} />
                    <ToolRow icon="file" name={writeLabel(143)} path="src/pages/Home.tsx" add={143} params={'{\n  "path": "src/pages/Home.tsx",\n  "content": "export default function Home() …"\n}'} />
                    <ToolRow icon="terminal" name={t('mock.toolC')} path="npm run build" params={'{\n  "command": "npm run build"\n}'} />
                  </div>
                </div>

                {/* 助手最终回复：打字机流式 */}
                <div>
                  <div className="m-ai-bubble">
                    {streamShown}
                    <span className="m-caret" />
                  </div>
                </div>

                {/* AgentStatusIndicator：3×3 像素网格 + 阶段文案 + 计时 */}
                <div className="m-status">
                  <span className="m-status-grid" aria-hidden>
                    {STATUS_DELAYS.map((d, i) => (
                      <span
                        key={i}
                        className="cell"
                        style={d === null ? { opacity: 0.12 } : { opacity: 0.2, animation: `pixel-on 650ms ease-in-out ${d}ms infinite` }}
                      />
                    ))}
                  </span>
                  <span className="m-status-label">{t('mock.agentPhase')}</span>
                  <span className="m-status-time">{elapsed}</span>
                </div>
              </div>

              {/* GoalBanner：钉在输入框上方（真实行为） */}
              <div className="m-goal">
                <span style={{ color: 'var(--app-tertiary)', marginTop: 1, display: 'flex' }}>
                  <Icon name="target" size={15} />
                </span>
                <div className="gt-body">
                  <div className="gt-head">
                    {t('mock.goalTitle')}
                    <span className="pill">{t('mock.goalPill')}</span>
                  </div>
                  <div className="cond">{t('mock.goalCond')}</div>
                  <div className="meta">{t('mock.goalMeta')}</div>
                  <div className="hint">
                    <span className="m-spin" />
                    {t('mock.goalHint')}
                  </div>
                </div>
                <span className="m-row-btn" style={{ width: 24, height: 24 }}>
                  <Icon name="x" size={13} />
                </span>
              </div>

              {/* 输入区：工作目录行 + 28px 圆角输入盒 + 工具栏 + 免责声明（对照 ChatInput.tsx） */}
              <div className="m-inputwrap">
                <div className="m-workdir">
                  <Icon name="folder-open" size={12} />
                  {t('mock.workdir')}
                </div>
                <div className="m-input">
                  <input
                    className="m-realinput"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') sendDraft()
                    }}
                    placeholder={t('mock.inputPh')}
                    aria-label={t('mock.inputPh')}
                  />
                  <div className="m-toolbar">
                    <span className="m-tbtn" title={t('mock.attachAria')}>
                      <Icon name="paperclip" size={15} />
                    </span>
                    <span className="m-tbtn" title={t('mock.cmdMenuAria')}>
                      <Icon name="slash" size={14} />
                    </span>
                    <span className="m-tbtn" title={t('mock.workdir')}>
                      <Icon name="folder-open" size={15} />
                    </span>
                    <span className="sep" />
                    {/* 审批模式：默认 auto（ShieldCheck + 自动） */}
                    <span className="m-tbtn wide">
                      <Icon name="shield-check" size={13} />
                      {t('mock.approval')}
                      <span className="m-chev">▼</span>
                    </span>
                    <span className="m-think">
                      <span className="m-tbtn">
                        <Icon name="brain" size={14} />
                      </span>
                      <span className="lvl">
                        {t('mock.tier')}
                        <span className="m-chev">▼</span>
                      </span>
                    </span>
                    <span className="m-model">
                      <span className="lb">{t('mock.model')}</span>
                      <span className="m-chev">▼</span>
                    </span>
                    <button type="button" className="m-send" onClick={sendDraft} aria-label={t('mock.sendAria')}>
                      <Icon name="send" size={14} />
                    </button>
                  </div>
                </div>
                <div className="m-disclaimer">{t('mock.disclaimer')}</div>
              </div>
            </main>

            {/* ── Workbench：对照 WorkbenchPanel.tsx（标签栏 + 内容区） ── */}
            <aside className="m-wb">
              <div className="m-wb-tabs">
                {TAB_ORDER.map((k) => (
                  <span
                    key={k}
                    className={`m-wb-tab${tab === k ? ' on' : ''}`}
                    onClick={() => pickTab(k)}
                  >
                    <Icon name={TAB_ICON[k]} size={12} />
                    {t(`mock.tab${k.charAt(0).toUpperCase()}${k.slice(1)}`)}
                  </span>
                ))}
                <span className="m-wb-add">
                  <Icon name="plus" size={13} />
                </span>
              </div>
              <div className="m-wb-body">
                {tab === 'files' && <FilesTab />}
                {tab === 'terminal' && <TerminalTab shown={termN} />}
                {tab === 'browser' && <BrowserTab />}
                {tab === 'subagent' && <SubAgentTab />}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToolRow({ icon, name, path, add, del, params }: { icon: string; name: string; path: string; add?: number; del?: number; params: string }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  return (
    <div className="m-tool-wrap">
      <button type="button" className="m-tool" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="st">
          <Icon name={icon} size={13} />
        </span>
        <span className="nm">{name}</span>
        <span className="path">{path}</span>
        {add !== undefined && add > 0 && <span className="cnt-add">+{add}</span>}
        {del !== undefined && del > 0 && <span className="cnt-del">−{del}</span>}
      </button>
      {open && (
        <div className="m-tool-detail">
          <div className="lb">{t('mock.paramsLabel')}</div>
          <pre>{params}</pre>
        </div>
      )}
    </div>
  )
}

/** 思考折叠头（对照 ThinkingHeader：点击展开思考内容块） */
function ThoughtRow({ text, body }: { text: string; body: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button type="button" className="m-thought" onClick={() => setOpen(!open)} aria-expanded={open}>
        {text}
        <span className="chev" style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }}>
          <Icon name="chevron-down" size={11} />
        </span>
      </button>
      {open && <div className="m-think-detail">{body}</div>}
    </div>
  )
}

function FilesTab() {
  return (
    <div className="m-files">
      {/* 左：FileTree（文件夹蓝色 info 图标 + 文件行）——与对话中写入的文件一致 */}
      <div className="m-tree-pane">
        <div className="m-ft-row folder">
          <span className="tw">▼</span>
          <span className="fic">
            <Icon name="folder-open" size={13} />
          </span>
          <span className="nm">clerkbox-website</span>
        </div>
        <div className="m-ft-row folder" style={{ paddingLeft: 20 }}>
          <span className="tw">▼</span>
          <span className="fic">
            <Icon name="folder-open" size={13} />
          </span>
          <span className="nm">src</span>
        </div>
        <div className="m-ft-row folder" style={{ paddingLeft: 34 }}>
          <span className="tw">▼</span>
          <span className="fic">
            <Icon name="folder-open" size={13} />
          </span>
          <span className="nm">pages</span>
        </div>
        <div className="m-ft-row file sel" style={{ paddingLeft: 48 }}>
          <span className="fic">
            <Icon name="file" size={12} />
          </span>
          <span className="nm">Home.tsx</span>
        </div>
        <div className="m-ft-row folder" style={{ paddingLeft: 34 }}>
          <span className="tw">▼</span>
          <span className="fic">
            <Icon name="folder-open" size={13} />
          </span>
          <span className="nm">styles</span>
        </div>
        <div className="m-ft-row file" style={{ paddingLeft: 48 }}>
          <span className="fic">
            <Icon name="file" size={12} />
          </span>
          <span className="nm">home.css</span>
        </div>
        <div className="m-ft-row file" style={{ paddingLeft: 20 }}>
          <span className="fic">
            <Icon name="file" size={12} />
          </span>
          <span className="nm">index.html</span>
        </div>
        <div className="m-ft-row file" style={{ paddingLeft: 20 }}>
          <span className="fic">
            <Icon name="file" size={12} />
          </span>
          <span className="nm">package.json</span>
        </div>
      </div>
      {/* 右：预览（工具栏 + 文本预览） */}
      <div className="m-preview">
        <div className="m-pv-toolbar">
          <span style={{ display: 'flex' }}>
            <Icon name="panel-left-close" size={13} />
          </span>
          <span className="fn">Home.tsx</span>
          <span className="x">
            <Icon name="x" size={11} />
          </span>
        </div>
        <div className="m-pv-body">
          <div><span className="no">1</span><span className="kw">export default function</span> <span className="fn2">Home</span>() {'{'}</div>
          <div><span className="no">2</span>  <span className="kw">return</span> (</div>
          <div><span className="no">3</span>    &lt;<span className="kw">section</span> className=<span className="str">"hero"</span>&gt;</div>
          <div><span className="no">4</span>      &lt;<span className="kw">h1</span>&gt;{'{'}t('hero.title'){'}'}&lt;/<span className="kw">h1</span>&gt;</div>
          <div><span className="no">5</span>      &lt;<span className="kw">DownloadCta</span> /&gt;</div>
          <div><span className="no">6</span>    &lt;/<span className="kw">section</span>&gt;</div>
          <div><span className="no">7</span>  )</div>
          <div><span className="no">8</span>{'}'}</div>
        </div>
      </div>
    </div>
  )
}

function TerminalTab({ shown }: { shown: number }) {
  // 对照 TerminalPanel：裸 xterm（Consolas 12px，前景 #e6e6e6，光标 #4d8ef7），无卡片外壳
  const lines: Array<{ cls?: string; node: React.ReactNode }> = [
    { node: (<><span>PS D:\www\clerkbox-website&gt;</span> <span>npm run build</span></>) },
    { cls: 'out', node: <span>&gt; tsc --noEmit &amp;&amp; vite build</span> },
    { cls: 'out', node: <span>vite v5.4.21 building for production...</span> },
    { cls: 'ok', node: <span>✓ 42 modules transformed in 1.42s</span> },
    { cls: 'out', node: <span>dist/index.html 3.84 kB │ gzip: 1.62 kB</span> },
    { cls: 'ok', node: <span>✓ built in 1.98s</span> },
    { node: (<><span>PS D:\www\clerkbox-website&gt;</span> <span className="cur" /></>) },
  ]
  return (
    <div className="m-term">
      {lines.slice(0, shown).map((l, i) => (
        <div className={`ln ${l.cls ?? ''}`} key={i}>
          {l.node}
        </div>
      ))}
    </div>
  )
}

function BrowserTab() {
  return (
    <div className="m-brw">
      {/* 导航工具栏：后退 / 前进 / 刷新 + 地址栏（对照 BrowserPanel.tsx） */}
      <div className="m-brw-h">
        <span className="m-brw-btn">
          <Icon name="arrow-left" size={14} />
        </span>
        <span className="m-brw-btn">
          <Icon name="arrow-right" size={14} />
        </span>
        <span className="m-brw-btn">
          <Icon name="rotate-cw" size={13} />
        </span>
        <span className="m-brw-url">
          <span className="gl">
            <Icon name="globe" size={12} />
          </span>
          localhost:5180
        </span>
      </div>
      {/* webview 渲染中的页面 */}
      <div className="m-brw-b">
        <div className="m-brw-hero" />
        <div className="m-bar w60" />
        <div className="m-bar w85" />
        <div className="m-bar w40" />
      </div>
    </div>
  )
}

function SubAgentTab() {
  const { t } = useI18n()
  return (
    <div className="m-sub">
      {/* 思考过程折叠块（bg tertiary/5） */}
      <div className="m-sub-think">
        <div className="h">
          <Icon name="brain" size={11} />
          {t('mock.thinkingProcess')}
        </div>
        <div className="b">{t('mock.exploreDesc')}…</div>
      </div>
      {/* 工具调用卡片（Wrench + 名称 + 参数预览 + 状态） */}
      <div className="m-sub-card">
        <div className="h">
          <span className="wic done">
            <Icon name="wrench" size={11} />
          </span>
          <span className="nm">search_content</span>
          <span className="arg">className*=token</span>
          <span className="st done">
            <Icon name="circle-check" size={12} />
          </span>
        </div>
        <div className="detail">
          <div className="lb">{t('mock.paramsLabel')}</div>
          <pre>{`{
  "pattern": "surfaceContainer",
  "glob": "*.css"
}`}</pre>
        </div>
      </div>
      <div className="m-sub-card">
        <div className="h">
          <span className="wic run">
            <Icon name="wrench" size={11} />
          </span>
          <span className="nm">read_file</span>
          <span className="arg">src/index.css</span>
          <span className="st run">
            <span className="m-spin" />
          </span>
        </div>
      </div>
      <div className="m-sub-running">
        <span className="m-spin" />
        {t('mock.subWorking')}…
      </div>
      <div className="m-sub-reply">· {t('mock.generalDesc')}</div>
    </div>
  )
}
