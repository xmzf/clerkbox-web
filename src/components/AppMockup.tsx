// Adapted from ClerkBox desktop UI, Copyright 2026 XMZF Studio, Apache-2.0.
// Website changes: isolated fixture state, native web dialogs and scoped styles.
// Full upstream license: public/licenses/ClerkBox.txt.
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  type SyntheticEvent,
  useLayoutEffect,
} from 'react'
import { useI18n } from '../i18n'
import { DesktopIcon as I } from './DesktopIcon'
import DesktopThemeWaves from './DesktopThemeWaves'
import '../styles/desktop-utilities.css'

export type DemoScenario = 'work' | 'vibe' | 'recall'
const SCENARIOS: DemoScenario[] = ['work', 'vibe', 'recall']
type DemoSession = 'homepage' | 'research' | 'new'
interface ChatFixture {
  draft: string
  attachment: boolean
  plan: boolean
  removed: boolean
  messages: Array<{ content: string; attachment: boolean; plan: boolean }>
}
const fresh = (): ChatFixture => ({
  draft: '',
  attachment: false,
  plan: false,
  removed: false,
  messages: [],
})

function usePreviewDialog(
  open: boolean,
  ref: RefObject<HTMLDialogElement | null>,
) {
  useEffect(() => {
    if (!open || !ref.current) return
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const dialog = ref.current
    dialog.showModal()
    return () => {
      dialog.close()
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [open, ref])
}

/**
 * A service-free fixture of ClerkBox 4.1.1's real UI. The JSX class lists below
 * come from App, Sidebar, TitleBar, ChatInput, MessageItem, MessageList,
 * AssistantTurnStream, VibeControls and RewindDialog in the desktop checkout.
 * sync-desktop-demo.mjs generates their actual Tailwind rules, i18n and icons.
 * Model, filesystem, shell and account operations are deliberately not bound.
 */
export default function AppMockup({
  scenario,
  requestRevision,
}: {
  scenario?: DemoScenario
  requestRevision?: number
}) {
  const { t } = useI18n()
  const d = (key: string, values?: Record<string, string | number>) => {
    let value = t(`demo.desktop.${key}`)
    for (const [name, replacement] of Object.entries(values || {}))
      value = value.replaceAll(`{{${name}}}`, String(replacement))
    return value
  }
  const [mode, setMode] = useState<DemoScenario>(scenario ?? 'work')
  const [session, setSession] = useState<DemoSession>('homepage')
  const [chats, setChats] = useState<Record<DemoSession, ChatFixture>>({
    homepage: fresh(),
    research: fresh(),
    new: fresh(),
  })
  const [collapsed, setCollapsed] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [groupOpen, setGroupOpen] = useState(true)
  const [workbench, setWorkbench] = useState(false)
  const [customize, setCustomize] = useState(false)
  const [more, setMore] = useState(false)
  const [opacity, setOpacity] = useState(60)
  const [reading, setReading] = useState<'single' | 'slideshow' | 'glass'>(
    'single',
  )
  const [recallOpen, setRecallOpen] = useState(false)
  const [withFiles, setWithFiles] = useState(false)
  const [filesRestored, setFilesRestored] = useState(false)
  const [notice, setNotice] = useState('')
  const [copied, setCopied] = useState(false)
  const [approval, setApproval] = useState(false)
  const [general, setGeneral] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchIndex, setSearchIndex] = useState(0)
  const [deleted, setDeleted] = useState<DemoSession[]>([])
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)
  const [backgroundFailed, setBackgroundFailed] = useState(false)
  const id = useId()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recallRef = useRef<HTMLDialogElement>(null)
  const customizeRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLDialogElement>(null)
  const moreRef = useRef<HTMLDialogElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const composing = useRef(false)
  const focusComposer = useRef(false)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const fixture = chats[session]
  const isVibe = mode === 'vibe'
  const empty =
    (session === 'new' || fixture.removed) && fixture.messages.length === 0
  const searchMatches = (['homepage', 'research'] as const)
    .filter((value) => !deleted.includes(value))
    .filter((value) =>
      t(`demo.${value === 'homepage' ? 'sessionTitle' : 'researchTitle'}`)
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
  const title = empty
    ? d('sidebar.newChat')
    : session === 'research'
      ? t('demo.researchTitle')
      : t('demo.sessionTitle')
  const prompt =
    session === 'research' ? t('demo.researchPrompt') : t('demo.prompt')
  const assistantText = [
    t(session === 'research' ? 'demo.researchResponse' : 'demo.response'),
    '',
    ...['stepOne', 'stepTwo', 'stepThree'].map(
      (key, index) => String(index + 1) + '. ' + t('demo.' + key),
    ),
  ].join('\n')
  const setChat = (update: Partial<ChatFixture>) =>
    setChats((current) => ({
      ...current,
      [session]: { ...current[session], ...update },
    }))

  useEffect(() => {
    if (scenario) setMode(scenario)
  }, [scenario, requestRevision])
  useEffect(() => {
    setDrawer(false)
    setCustomize(false)
    setRecallOpen(false)
    setSearchOpen(false)
    setMore(false)
  }, [mode])
  usePreviewDialog(recallOpen, recallRef)
  usePreviewDialog(customize, customizeRef)
  usePreviewDialog(searchOpen, searchRef)
  usePreviewDialog(more, moreRef)
  useEffect(() => {
    if (!more || !moreRef.current) return
    const rect = frameRef.current?.getBoundingClientRect()
    const toolbar = frameRef.current
      ?.querySelector('.vibe-toolbar')
      ?.getBoundingClientRect()
    if (rect && toolbar) {
      moreRef.current.style.top = `${toolbar.bottom + 8}px`
      moreRef.current.style.right = `${Math.max(8, window.innerWidth - rect.right + 16)}px`
    }
  }, [more])
  useEffect(() => {
    if (!drawer) return
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && !event.isComposing && !composing.current)
        setDrawer(false)
    }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [drawer])
  const cancelDialog = (
    event: SyntheticEvent<HTMLDialogElement>,
    close: () => void,
  ) => {
    event.preventDefault()
    if (!composing.current) close()
  }

  // Match the app's measured density selection, including translated labels.
  useLayoutEffect(() => {
    const toolbar = toolbarRef.current
    const parent = toolbar?.parentElement
    if (!toolbar || !parent) return
    let frame = 0
    const measure = () => {
      frame = 0
      if (!toolbar.isConnected || !toolbar.clientWidth) return
      const copy = toolbar.cloneNode(true) as HTMLDivElement
      copy.setAttribute('aria-hidden', 'true')
      copy.inert = true
      copy.style.cssText =
        'position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;width:max-content;max-width:none;flex-wrap:nowrap;z-index:-1;'
      for (const child of Array.from(copy.children))
        (child as HTMLElement).style.flexGrow = '0'
      parent.appendChild(copy)
      const widths = []
      for (let density = 0; density < 4; density++) {
        copy.dataset.composerDensity = String(density)
        const children = Array.from(copy.children) as HTMLElement[]
        const gap = parseFloat(getComputedStyle(copy).columnGap) || 0
        widths.push(
          children.reduce(
            (sum, child) => sum + child.getBoundingClientRect().width,
            0,
          ) +
            Math.max(0, children.length - 1) * gap,
        )
      }
      copy.remove()
      const density = widths.findIndex(
        (width) => width <= toolbar.clientWidth + 1,
      )
      toolbar.dataset.composerDensity = String(density < 0 ? 3 : density)
    }
    const observer = new ResizeObserver(() => {
      if (!frame) frame = requestAnimationFrame(measure)
    })
    observer.observe(toolbar)
    measure()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [empty, isVibe, t])

  useLayoutEffect(() => {
    if (focusComposer.current) {
      focusComposer.current = false
      inputRef.current?.focus({ preventScroll: true })
    }
  }, [session, empty])

  const localOnly = () => setNotice(t('demo.desktopOnly'))
  const newChat = () => {
    focusComposer.current = true
    setSession('new')
    setDrawer(false)
    setNotice('')
    requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true }),
    )
  }
  const switchChat = (next: DemoSession) => {
    setSession(next)
    setDrawer(false)
    setSearchOpen(false)
    setNotice('')
  }
  const send = () => {
    if (!fixture.draft.trim()) return
    setChat({
      messages: [
        ...fixture.messages,
        {
          content: fixture.draft.trim(),
          attachment: fixture.attachment,
          plan: fixture.plan,
        },
      ],
      draft: '',
      attachment: false,
      plan: false,
    })
    setNotice(t('demo.localSent'))
  }
  const recall = () => {
    if (fixture.draft.trim() || fixture.attachment || fixture.plan) return
    focusComposer.current = true
    setChat({
      removed: true,
      draft: prompt,
      attachment: true,
      plan: true,
      messages: [],
    })
    setFilesRestored(withFiles)
    setRecallOpen(false)
    setNotice(
      withFiles ? t('demo.recalledFilesNotice') : t('demo.recalledNotice'),
    )
    requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true }),
    )
  }
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setNotice(t('demo.copyUnavailable'))
    }
  }
  const tabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.nativeEvent.isComposing) return
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
    if (next < 0) return
    event.preventDefault()
    setMode(SCENARIOS[next])
    tabs.current[next]?.focus()
  }
  const iconButton = (
    icon: Parameters<typeof I>[0]['name'],
    label: string,
    action: () => void,
    size = 16,
    pressed?: boolean,
  ) => (
    <button
      type="button"
      onClick={action}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={`md-focus ${isVibe ? 'vibe-icon-button' : 'w-8 h-8 max-md:w-11 max-md:h-11 flex shrink-0 items-center justify-center rounded-md3-sm hover:bg-dark-surfaceContainerHigh text-dark-onSurfaceVariant transition-colors'}`}
    >
      <I name={icon} size={size} />
    </button>
  )
  const actionButton = (
    icon: Parameters<typeof I>[0]['name'],
    label: string,
    action: () => void,
    ref?: Ref<HTMLButtonElement>,
  ) => (
    <button
      ref={ref}
      type="button"
      onClick={action}
      aria-label={label}
      title={label}
      className={`md-focus w-6 h-6 max-md:w-11 max-md:h-11 flex items-center justify-center rounded-md3-xs transition-colors ${isVibe ? 'hover:bg-white/15 text-white/55 hover:text-white/85' : 'hover:bg-dark-surfaceContainerHigh text-dark-onSurfaceVariant/55 hover:text-dark-onSurfaceVariant'}`}
    >
      <I name={icon} size={12} />
    </button>
  )
  const navButton = (
    icon: Parameters<typeof I>[0]['name'],
    label: string,
    action = localOnly,
    compact = false,
  ) => (
    <button
      type="button"
      onClick={action}
      className={`md-focus w-full flex ${compact ? 'min-h-9' : 'min-h-10'} items-center gap-2.5 px-3 py-2 max-md:min-h-11 rounded-md3-sm hover:bg-dark-surfaceContainerHigh transition-colors text-ui-sm text-dark-onSurfaceVariant`}
    >
      <I name={icon} size={16} />
      <span>{label}</span>
    </button>
  )
  const sidebar = (
    <aside
      aria-label={d('shell.workspace')}
      className={`${collapsed && !drawer ? 'w-14 items-center py-3' : 'w-64'} h-full min-h-0 shrink-0 flex flex-col overflow-y-auto bg-dark-surfaceDim border-r border-dark-onSurfaceVariant/10`}
    >
      {collapsed && !drawer ? (
        <>
          <img
            src="/clerkbox-mark.webp"
            alt="ClerkBox"
            width="32"
            height="32"
            className="w-8 h-8 rounded-md3-sm mb-3 object-contain"
          />
          {iconButton('plus', d('sidebar.newChatAria'), newChat)}
          {iconButton('search', d('shell.search'), () => setSearchOpen(true))}
          <div className="flex-1" />
          {iconButton('settings', d('sidebar.settings'), localOnly)}
          {iconButton('user', d('sidebar.notLoggedIn'), localOnly)}
        </>
      ) : (
        <>
          <div className="flex shrink-0 items-center justify-between gap-2 px-4 pt-5 pb-4 max-md:pt-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <img
                src="/clerkbox-mark.webp"
                alt=""
                width="32"
                height="32"
                className="w-8 h-8 rounded-md3-sm shrink-0"
              />
              <div className="min-w-0">
                <span className="text-ui-sm font-semibold text-dark-onSurface">
                  ClerkBox
                </span>
                <p className="text-ui-xs text-dark-onSurfaceVariant/60">
                  {d('shell.workspace')}
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label={d('common.close')}
              onClick={() => setDrawer(false)}
              className="md-focus hidden max-md:flex w-11 h-11 -mr-1 shrink-0 items-center justify-center rounded-md3-sm hover:bg-dark-surfaceContainerHigh transition-colors text-dark-onSurfaceVariant"
            >
              <I name="x" size={18} />
            </button>
          </div>
          <nav
            aria-label={d('shell.workspace')}
            className="shrink-0 px-3 pb-4 flex flex-col gap-1"
          >
            <button
              type="button"
              onClick={newChat}
              className="md-focus w-full flex min-h-10 items-center gap-2.5 px-3 py-2 max-md:min-h-11 rounded-md3-md bg-md-primary text-md-onPrimary hover:bg-md-primary/90 transition-colors text-ui-sm font-medium"
            >
              <I name="plus" size={16} />
              <span className="flex-1 text-left">{d('sidebar.newChat')}</span>
              <kbd
                className="text-ui-xs font-normal opacity-60 max-md:hidden"
                aria-hidden="true"
              >
                Ctrl+N
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="md-focus mt-2 mb-3 w-full min-h-10 flex items-center gap-2.5 rounded-md3-sm border border-dark-onSurfaceVariant/15 bg-dark-surface/60 px-3 py-2 text-ui-xs text-dark-onSurfaceVariant hover:border-dark-onSurfaceVariant/30 hover:bg-dark-surfaceContainer transition-colors max-md:min-h-11"
            >
              <I name="search" size={15} />
              <span className="min-w-0 flex-1 truncate text-left">
                {d('shell.search')}
              </span>
              <kbd
                className="shrink-0 font-sans text-dark-onSurfaceVariant/60 max-md:hidden"
                aria-hidden="true"
              >
                Ctrl+K
              </kbd>
            </button>
            <div
              role="radiogroup"
              aria-label={d('interfaceMode.toggleAria')}
              className="mb-2 grid grid-cols-2 gap-1 rounded-md3-md border border-dark-onSurfaceVariant/10 bg-dark-surfaceContainer/50 p-1"
            >
              {[false, true].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  role="radio"
                  aria-checked={general === value}
                  tabIndex={general === value ? 0 : -1}
                  onClick={() => setGeneral(value)}
                  onKeyDown={(event) => {
                    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
                      event.preventDefault()
                      setGeneral(!value)
                      ;(
                        event.currentTarget.parentElement?.children[
                          value ? 0 : 1
                        ] as HTMLElement
                      )?.focus()
                    }
                  }}
                  className={`md-focus flex min-h-8 items-center justify-center gap-2 rounded-md3-sm border px-2 py-1 max-md:min-h-11 transition-colors duration-200 ${general === value ? 'border-dark-onSurfaceVariant/10 bg-dark-surfaceBright text-dark-onSurface shadow-elevation-1' : 'border-transparent text-dark-onSurfaceVariant hover:bg-dark-surfaceContainerHigh hover:text-dark-onSurface'}`}
                >
                  <I name={value ? 'briefcase' : 'square-terminal'} size={14} />
                  <span className="text-ui-xs font-medium whitespace-nowrap">
                    {d(`interfaceMode.${value ? 'general' : 'coding'}`)}
                  </span>
                </button>
              ))}
            </div>
            {navButton('store', d('sidebar.skills'))}
            {navButton('calendar-clock', d('scheduledTasks.title'))}
          </nav>
          <div className="mx-3 shrink-0 border-t border-dark-onSurfaceVariant/10 pt-3 pb-2 pl-2 flex items-center justify-between gap-2">
            <span className="text-ui-xs font-medium text-dark-onSurfaceVariant/60">
              {d('sidebar.taskList')}
            </span>
            <button
              type="button"
              onClick={() => setGroupOpen(!groupOpen)}
              aria-label={d(
                groupOpen ? 'sidebar.collapseAll' : 'sidebar.expandAll',
              )}
              className="md-focus w-7 h-7 max-md:w-11 max-md:h-11 flex items-center justify-center rounded-md3-sm text-dark-onSurfaceVariant/60 hover:bg-dark-surfaceContainer"
            >
              <I name="chevrons-down-up" size={13} />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3">
            <button
              type="button"
              onClick={() => setGroupOpen(!groupOpen)}
              aria-expanded={groupOpen}
              className="md-focus w-full flex min-h-8 items-center gap-2 px-2 py-1.5 max-md:min-h-11 rounded-md3-sm text-ui-xs text-dark-onSurfaceVariant hover:bg-dark-surfaceContainer"
            >
              <I name={groupOpen ? 'folder-open' : 'folder-closed'} size={13} />
              <span className="truncate flex-1 text-left">clerkbox</span>
              <span className="text-ui-xs text-dark-onSurfaceVariant/60 tabular-nums">
                {2 - deleted.length}
              </span>
              <I
                name="chevron-down"
                size={12}
                className={groupOpen ? '' : '-rotate-90'}
              />
            </button>
            {groupOpen && (
              <div className="flex flex-col gap-1 pt-1">
                {(['homepage', 'research'] as const)
                  .filter((value) => !deleted.includes(value))
                  .map((value) => (
                    <div
                      key={value}
                      className={`sidebar-session-row relative flex items-center gap-1 rounded-md3-sm border transition-colors ${session === value ? 'border-dark-onSurfaceVariant/10 bg-dark-surfaceBright text-dark-onSurface' : 'border-transparent text-dark-onSurfaceVariant hover:bg-dark-surfaceContainer'}`}
                    >
                      <button
                        type="button"
                        onClick={() => switchChat(value)}
                        aria-current={session === value ? 'page' : undefined}
                        className="md-focus min-h-9 flex-1 flex items-center gap-2.5 py-2 pl-3 text-ui-sm text-left min-w-0 rounded-md3-sm max-md:min-h-11"
                      >
                        <I
                          name="message-square"
                          size={14}
                          className="text-dark-onSurfaceVariant/60"
                        />
                        <span className="min-w-0 flex-1 truncate">
                          {t(
                            `demo.${value === 'homepage' ? 'sessionTitle' : 'researchTitle'}`,
                          )}
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label={d('sidebar.deleteSessionAria')}
                        onClick={() => {
                          setDeleted((current) => [...current, value])
                          if (session === value) newChat()
                        }}
                        className="sidebar-session-delete md-focus mr-1 w-7 h-8 max-md:w-11 max-md:h-11 flex items-center justify-center rounded-md3-sm text-dark-onSurfaceVariant/60 hover:bg-md-error/15 hover:text-md-error"
                      >
                        <I name="trash-2" size={13} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="shrink-0 border-t border-dark-onSurfaceVariant/10 px-3 py-3 flex flex-col gap-1">
            {navButton('globe', d('sidebar.remoteAccess'), localOnly, true)}
            {navButton('settings', d('sidebar.settings'), localOnly, true)}
            {navButton('user', d('sidebar.notLoggedIn'))}
          </div>
        </>
      )}
    </aside>
  )

  const userMessage = (
    content: string,
    original = false,
    attached = false,
    plan = false,
  ): ReactNode => (
    <div className="message-action-scope flex justify-end">
      <div className="flex flex-col gap-1 items-end max-w-[85%] max-md:max-w-[92%]">
        {(original || attached) && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md3-md text-xs ${isVibe ? 'bg-white/10 border border-white/20 text-white/90' : 'bg-md-primaryContainer text-md-onPrimaryContainer'}`}
          >
            <I name="file-text" size={12} />
            <span className="truncate max-w-[200px]">brief.md</span>
          </div>
        )}
        <div
          className={`relative min-w-0 break-words text-sm leading-relaxed px-4 py-2.5 rounded-md3-md ${isVibe ? 'liquid-glass text-white' : 'bg-md-primaryContainer text-md-onPrimaryContainer'}`}
        >
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            {(original || plan) && (
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-md3-sm px-2 py-0.5 text-[11px] font-medium ${isVibe ? 'bg-white/15 text-white/90' : 'bg-md-primary/15 text-md-primary'}`}
              >
                <I name="git-branch" size={11} />
                <span>Plan</span>
              </span>
            )}
            <span className="min-w-0 whitespace-pre-wrap break-words">
              {content}
            </span>
          </div>
        </div>
        <div
          className={`message-action-bar flex items-center gap-1 mt-0.5 transition-opacity px-1 ${isVibe ? 'text-white/60' : 'text-dark-onSurfaceVariant/55'}`}
        >
          {actionButton(
            copied ? 'check' : 'copy',
            d('common.copy'),
            () => void copy(content),
          )}
          {original && (
            <>
              {actionButton('pencil', d('chat.rewind.edit'), localOnly)}
              {actionButton(
                'rotate-ccw',
                d('chat.rewind.recall'),
                () => {
                  setWithFiles(false)
                  setRecallOpen(true)
                },
                triggerRef,
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )

  const composerButton = (
    icon: Parameters<typeof I>[0]['name'],
    label: string,
    action: () => void,
    size = 16,
  ) => (
    <button
      type="button"
      onClick={action}
      aria-label={label}
      title={label}
      className={`h-8 max-md:h-11 max-md:px-3 flex items-center gap-1 px-2 flex-shrink-0 rounded-md3-sm transition-colors disabled:opacity-40 ${isVibe ? 'hover:bg-white/15 text-white/70' : 'hover:bg-dark-surfaceContainer text-dark-onSurfaceVariant'}`}
    >
      <I name={icon} size={size} />
    </button>
  )

  const composer = (
    <div
      className={
        empty && !isVibe
          ? 'shrink-0 px-0 py-2'
          : isVibe
            ? 'vibe-composer shrink-0 px-4 pb-4 pt-2 max-md:px-3 bg-transparent'
            : 'shrink-0 px-5 pb-4 pt-2 max-md:px-3 bg-dark-surface'
      }
    >
      <div
        className={`mb-2 px-1 max-w-5xl mx-auto min-w-0 ${isVibe ? 'text-white/70' : 'text-dark-onSurfaceVariant'}`}
      >
        <div className={`flex items-center gap-1.5 min-w-0 ${empty ? 'min-h-8' : ''}`}>
          <I name="layers" size={12} className="opacity-70" />
          <span className="text-ui-xs font-medium shrink-0">
            {d('chat.harnessDefault')}
          </span>
          {!empty && <I name="lock" size={10} className="opacity-50" />}
          <span
            className={`text-ui-xs truncate min-w-0 ${isVibe ? 'text-white/65' : 'text-dark-onSurfaceVariant/80'}`}
          >
            · {d('chat.harnessDefaultDesc')}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mb-2 px-1 max-w-5xl mx-auto">
        <I
          name="folder-open"
          size={12}
          className={isVibe ? 'text-white/50' : 'text-dark-onSurfaceVariant/50'}
        />
        <span
          className={`text-[11px] truncate max-w-[400px] ${isVibe ? 'text-white/50' : 'text-dark-onSurfaceVariant/50'}`}
        >
          D:\Projects\clerkbox
        </span>
        <span className="ml-auto inline-flex" />
      </div>
      <div
        className={`chat-input-box relative flex flex-col ${empty && !isVibe ? 'max-w-3xl' : 'max-w-5xl'} mx-auto rounded-md3-md px-4 py-3 gap-3 ${isVibe ? 'liquid-glass focus-within:border-white/40 transition-colors' : 'bg-dark-surfaceBright border border-dark-onSurfaceVariant/15 shadow-elevation-1 focus-within:border-md-primary/40 transition-[border-color,box-shadow]'}`}
      >
        {fixture.attachment && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              aria-label={d('chat.attachRemove')}
              onClick={() => setChat({ attachment: false })}
              className={`flex items-center gap-1 px-2 py-1 rounded-md3-sm text-[11px] ${isVibe ? 'bg-white/10 text-white/80' : 'bg-dark-surfaceContainerHighest text-dark-onSurfaceVariant'}`}
            >
              <I name="file-text" size={11} />
              brief.md
              <I name="x" size={10} />
            </button>
          </div>
        )}
        <div className="flex min-w-0 flex-nowrap items-start gap-2 overflow-x-auto chat-input-chip-row">
          {fixture.plan && (
            <button
              type="button"
              title={d('chat.taskChipRemove')}
              onClick={() => setChat({ plan: false })}
              className={`flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md3-sm text-sm font-medium shrink-0 ${isVibe ? 'bg-white/15 text-white/90' : 'bg-md-primary/15 text-md-primary'}`}
            >
              <I name="git-branch" size={14} />
              Plan
              <I name="x" size={11} className="opacity-50" />
            </button>
          )}
          <textarea
            ref={inputRef}
            aria-label={d('chat.messageInputAria')}
            placeholder={
              fixture.plan
                ? d('chat.taskPlaceholder')
                : isVibe
                  ? d('chat.placeholderVibe')
                  : d('chat.placeholderWorkDir', { name: 'clerkbox' })
            }
            rows={1}
            value={fixture.draft}
            onChange={(event) => setChat({ draft: event.target.value })}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing &&
                event.nativeEvent.keyCode !== 229
              ) {
                event.preventDefault()
                send()
              }
            }}
            className={`min-w-[96px] flex-1 bg-transparent text-ui-sm max-md:text-ui-base leading-relaxed resize-none outline-none min-h-12 max-h-[200px] py-1 ${isVibe ? 'text-white/90 placeholder-white/50' : 'text-dark-onSurface placeholder-dark-onSurfaceVariant/60'}`}
          />
        </div>
        <div
          ref={toolbarRef}
          className={`chat-input-toolbar flex min-w-0 items-center gap-1 flex-nowrap overflow-visible border-t pt-2 ${isVibe ? 'border-white/10' : 'border-dark-onSurfaceVariant/10'}`}
        >
          {composerButton('paperclip', d('chat.attachAria'), localOnly)}
          {composerButton('slash', d('chat.commandMenuAria'), localOnly, 15)}
          {composerButton('folder-open', d('chat.selectFolderAria'), () =>
            setWorkbench(!workbench),
          )}
          <button
            type="button"
            aria-label={d('chat.approvalAria')}
            onClick={() => setApproval(!approval)}
            className={`h-8 flex items-center gap-1.5 px-2.5 shrink-0 rounded-md3-sm ${isVibe ? 'bg-white/10 text-white/80 hover:bg-white/15' : 'bg-dark-surfaceContainerHighest/70 text-dark-onSurface hover:bg-dark-surfaceContainerHighest'}`}
          >
            <I name="shield-check" size={14} />
            <span className="chat-toolbar-label text-ui-xs font-medium">
              {d(
                approval
                  ? 'chat.approvalManualTitle'
                  : 'chat.approvalAutoTitle',
              )}
            </span>
            <I name="chevron-down" size={12} />
          </button>
          <button
            type="button"
            aria-label={d('chat.thinkingUnsupported')}
            title={d('chat.thinkingUnsupported')}
            disabled
            className={`h-8 flex items-center gap-1 px-2 shrink-0 rounded-md3-sm disabled:opacity-30 ${isVibe ? 'text-white/70' : 'text-dark-onSurfaceVariant'}`}
          >
            <I name="brain" size={16} />
          </button>
          <button
            type="button"
            onClick={localOnly}
            className={`h-8 flex items-center gap-1.5 px-2 shrink-0 rounded-md3-sm ${isVibe ? 'text-white/70 hover:bg-white/15' : 'text-dark-onSurfaceVariant hover:bg-dark-surfaceContainer'}`}
          >
            <span className="chat-toolbar-model-label max-w-40 truncate text-ui-xs">
              {t('demo.model')}
            </span>
            <I name="chevron-down" size={12} />
          </button>
          <div className="flex-1" />
          <button
            type="button"
            disabled={!fixture.draft.trim()}
            onClick={send}
            aria-label={d('chat.sendMessageAria')}
            title={d('chat.sendMessageAria')}
            className={`chat-toolbar-send md-focus h-9 w-9 max-md:h-11 max-md:w-11 shrink-0 flex items-center justify-center rounded-md3-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${isVibe ? 'bg-white/25 text-white hover:bg-white/35' : 'bg-md-primary text-md-onPrimary hover:bg-md-primary/90'}`}
          >
            <I name="send" size={16} />
          </button>
        </div>
      </div>
      {!(empty && !isVibe) && (
        <div className="text-center mt-1.5 max-w-5xl mx-auto">
          <span
            className={`text-ui-xs ${isVibe ? 'text-white/60' : 'text-dark-onSurfaceVariant/60'}`}
          >
            {d('chat.disclaimer')}
          </span>
        </div>
      )}
    </div>
  )

  return (
    <div
      className="product-demo"
      data-scenario={mode}
      data-source="ClerkBox 4.1.1"
      data-ready={!isVibe || backgroundLoaded || backgroundFailed}
      onCompositionStart={() => {
        composing.current = true
      }}
      onCompositionEnd={() => {
        composing.current = false
      }}
    >
      <div className="product-demo-controls">
        <span className="product-demo-label">{t('demo.interactive')}</span>
        <div
          role="tablist"
          aria-label={t('demo.scenarios')}
          className="product-demo-scenarios"
        >
          {SCENARIOS.map((value, index) => (
            <button
              key={value}
              type="button"
              role="tab"
              id={`${id}-tab-${value}`}
              aria-controls={`${id}-preview`}
              aria-selected={mode === value}
              tabIndex={mode === value ? 0 : -1}
              ref={(element) => {
                tabs.current[index] = element
              }}
              onClick={() => setMode(value)}
              onKeyDown={(event) => tabKey(event, index)}
            >
              {t(`demo.${value}`)}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={frameRef}
        className="product-demo-window"
        id={`${id}-preview`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${mode}`}
        style={{ '--vibe-reading-opacity': opacity / 100 } as CSSProperties}
      >
        <div
          className={`desktop-replica app-window relative flex h-full w-full overflow-hidden rounded-xl border border-dark-onSurfaceVariant/20 ${isVibe ? 'vibe-shell text-white' : 'bg-dark-surface text-dark-onSurface'}`}
        >
          {isVibe && (
            <div className="desktop-vibe-background" aria-hidden="true">
              <img
                src="/product/vibe-background.jpg"
                alt=""
                onLoad={() => setBackgroundLoaded(true)}
                onError={() => setBackgroundFailed(true)}
              />
            </div>
          )}
          {!isVibe && <div className="desktop-sidebar">{sidebar}</div>}
          <div className="workspace-shell relative z-10 flex flex-1 flex-col min-h-0 min-w-0">
            {isVibe ? (
              <header className="vibe-toolbar liquid-glass-strong">
                <div className="vibe-toolbar-main">
                  {iconButton(
                    'panel-left',
                    d('vibe.sessions'),
                    () => setDrawer(!drawer),
                    17,
                    drawer,
                  )}
                  {iconButton('plus', d('sidebar.newChatAria'), newChat, 18)}
                  {iconButton('search', d('shell.search'), () =>
                    setSearchOpen(true),
                  )}
                  <span
                    className="mx-1 h-5 border-l border-white/15"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-ui-xs font-medium tracking-widest text-white/50">
                      <I name="sparkles" size={11} />
                      VIBE
                    </div>
                    <h3 className="truncate text-ui-sm font-medium text-white/90">
                      {title}
                    </h3>
                  </div>
                </div>
                <div className="vibe-toolbar-actions">
                  {iconButton('music-2', d('vibe.music'), localOnly, 17)}
                  {iconButton(
                    'panel-right',
                    d('titlebar.toggleWorkbench'),
                    () => setWorkbench(!workbench),
                    17,
                    workbench,
                  )}
                  {iconButton(
                    'settings-2',
                    d('vibe.customize'),
                    () => setCustomize(true),
                    17,
                  )}
                  {iconButton(
                    'ellipsis',
                    d('vibe.moreActions'),
                    () => setMore(!more),
                    18,
                  )}
                  <div className="ml-1 flex items-center border-l border-white/15 pl-1 desktop-window-controls">
                    {iconButton(
                      'minus',
                      d('titlebar.windowMinimize'),
                      localOnly,
                    )}
                    {iconButton(
                      'square',
                      d('titlebar.windowMaximize'),
                      localOnly,
                      14,
                    )}
                    {iconButton('x', d('titlebar.windowClose'), localOnly, 17)}
                  </div>
                </div>
              </header>
            ) : (
              <div
                data-source-part="TitleBar"
                className="relative z-30 h-11 shrink-0 max-md:h-14 flex items-center justify-between gap-3 px-3 max-md:gap-1 max-md:px-2 bg-dark-surface/90 border-b border-dark-onSurfaceVariant/10 select-none"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  {iconButton(
                    'panel-left',
                    d('titlebar.toggleSidebar'),
                    () =>
                      (frameRef.current?.clientWidth ?? window.innerWidth) < 768
                        ? setDrawer(!drawer)
                        : setCollapsed(!collapsed),
                    16,
                    !collapsed,
                  )}
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="truncate text-ui-xs font-medium text-dark-onSurface">
                      {title}
                    </span>
                    <span className="hidden xl:flex min-w-0 max-w-52 items-center gap-1.5 border-l border-dark-onSurfaceVariant/15 pl-2.5 text-ui-xs text-dark-onSurfaceVariant/60">
                      <I name="folder-open" size={13} />
                      <span className="truncate">clerkbox</span>
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <span className="mr-1 hidden md:block rounded-md3-xs bg-dark-surfaceContainerHigh px-1.5 py-0.5 text-xs text-dark-onSurfaceVariant">
                    v4.1.1
                  </span>
                  <button
                    type="button"
                    aria-label={d('titlebar.vibeToggleAria')}
                    onClick={() => setMode('vibe')}
                    className="md-focus h-8 max-md:h-11 max-md:w-11 flex shrink-0 items-center justify-center gap-1.5 px-2 rounded-md3-sm text-dark-onSurfaceVariant hover:bg-dark-surfaceContainerHigh transition-colors"
                  >
                    <I name="sparkles" size={15} />
                    <span className="hidden lg:inline text-ui-xs font-medium whitespace-nowrap">
                      {d('titlebar.vibeCompact')}
                    </span>
                  </button>
                  <div className="relative mr-2 desktop-context">
                    <button
                      type="button"
                      aria-label={d('chat.contextUsageTitle')}
                      onClick={localOnly}
                      className="w-8 h-8 max-md:w-10 max-md:h-10 flex items-center justify-center rounded-md3-sm hover:bg-dark-surfaceContainerHigh transition-colors"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        className="-rotate-90"
                      >
                        <circle
                          cx="9"
                          cy="9"
                          r="7.25"
                          fill="none"
                          strokeWidth="2"
                          className="stroke-dark-onSurfaceVariant/25"
                          strokeDasharray={2 * Math.PI * 7.25}
                        />
                      </svg>
                    </button>
                  </div>
                  {iconButton(
                    'panel-right',
                    d('titlebar.toggleWorkbench'),
                    () => setWorkbench(!workbench),
                    16,
                    workbench,
                  )}
                  <div className="desktop-window-controls flex items-center gap-1">
                    {iconButton(
                      'minus',
                      d('titlebar.windowMinimize'),
                      localOnly,
                    )}
                    {iconButton(
                      'square',
                      d('titlebar.windowMaximize'),
                      localOnly,
                      14,
                    )}
                    {iconButton('x', d('titlebar.windowClose'), localOnly)}
                  </div>
                </div>
              </div>
            )}
            <div
              className={`workspace-main relative flex flex-1 min-h-0 min-w-0 overflow-hidden ${isVibe ? 'vibe-workspace' : ''}`}
            >
              <div
                className={`workspace-chat min-h-0 min-w-0 flex-1 overflow-hidden ${isVibe ? 'vibe-reading-surface' : ''}`}
              >
                <div
                  className={`relative flex min-h-0 flex-col h-full overflow-hidden ${isVibe ? 'bg-transparent' : 'bg-dark-surface'}`}
                >
                  {empty ? (
                    <div
                      className={`relative z-10 flex-1 min-h-0 overflow-y-auto ${isVibe ? 'vibe-empty-layout' : ''}`}
                    >
                      <div
                        className={`flex min-h-full flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 ${isVibe ? 'vibe-empty-inner' : ''}`}
                      >
                        <div
                          className={`w-full max-w-3xl ${isVibe ? 'vibe-empty-content' : ''}`}
                        >
                          <div
                            className={isVibe ? 'vibe-empty-intro' : undefined}
                          >
                            <header
                              className={
                                isVibe ? 'vibe-welcome' : 'mb-7 sm:mb-8'
                              }
                            >
                              {isVibe ? (
                                <>
                                  <span className="text-ui-xs font-medium tracking-widest text-white/50">
                                    ClerkBox · VIBE
                                  </span>
                                  <h3 className="mt-4 text-ui-2xl font-medium tracking-tight text-white/90">
                                    {d('vibe.welcomeTitle')}
                                  </h3>
                                  <p className="mt-3 max-w-md text-ui-sm leading-relaxed text-white/60">
                                    {d('vibe.welcomeDescription')}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <div className="mb-4 flex items-center gap-2.5">
                                    <img
                                      src="/product/new-chat-icon.webp"
                                      alt=""
                                      className="w-9 h-9 rounded-md3-md object-cover"
                                    />
                                    <span className="text-ui-xs font-medium text-dark-onSurfaceVariant/60">
                                      {d('shell.welcomeEyebrow')}
                                    </span>
                                  </div>
                                  <h3 className="text-ui-2xl font-semibold tracking-tight text-dark-onSurface">
                                    {d(
                                      general
                                        ? 'chat.emptyWelcomeGeneral'
                                        : 'chat.emptyWelcome',
                                    )}
                                  </h3>
                                  <p className="mt-3 max-w-xl text-ui-sm leading-relaxed text-dark-onSurfaceVariant">
                                    {d('shell.welcomeDescription')}
                                  </p>
                                </>
                              )}
                            </header>
                          </div>
                          {composer}
                          {!isVibe && (
                            <>
                              <div className="mt-5 flex flex-wrap gap-3">
                                {(['browseSkills', 'viewHistory'] as const).map(
                                  (key, index) => (
                                    <button
                                      type="button"
                                      key={key}
                                      onClick={
                                        index
                                          ? () => setSearchOpen(true)
                                          : localOnly
                                      }
                                      className="md-focus group flex min-w-0 flex-1 basis-64 items-start gap-3 rounded-md3-md border border-dark-onSurfaceVariant/10 bg-dark-surface/60 p-4 text-left hover:bg-dark-surfaceContainer/60 hover:border-dark-onSurfaceVariant/20 transition-colors"
                                    >
                                      <I
                                        name={index ? 'search' : 'store'}
                                        size={17}
                                        className="mt-0.5 shrink-0 text-dark-onSurfaceVariant"
                                      />
                                      <span className="min-w-0 flex-1">
                                        <span className="block text-ui-sm font-medium text-dark-onSurface">
                                          {d(`shell.${key}`)}
                                        </span>
                                        <span className="mt-1 block text-ui-xs leading-relaxed text-dark-onSurfaceVariant">
                                          {d(`shell.${key}Description`)}
                                        </span>
                                      </span>
                                      <I
                                        name="arrow-up-right"
                                        size={14}
                                        className="mt-0.5 shrink-0 text-dark-onSurfaceVariant/40 group-hover:text-dark-onSurfaceVariant"
                                      />
                                    </button>
                                  ),
                                )}
                              </div>
                              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-ui-xs text-dark-onSurfaceVariant/60">
                                <span className="min-w-0 max-w-full truncate">
                                  {d('shell.modelConfigured')} ·{' '}
                                  {t('demo.model')}
                                </span>
                                <span className="flex min-w-0 max-w-full items-center gap-1.5">
                                  <I
                                    name="folder-open"
                                    size={13}
                                    className="shrink-0"
                                  />
                                  <span className="truncate">clerkbox</span>
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative flex-1 min-h-0 flex flex-col overflow-clip">
                        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 pb-6">
                          {!fixture.removed && session !== 'new' && (
                            <div className="pt-6">
                              <div className="flex flex-col gap-4">
                                {userMessage(prompt, true)}
                                <div className="message-action-scope flex w-full min-w-0 flex-col gap-4">
                                  <div
                                    className={`min-w-0 break-words py-1 text-ui-sm leading-relaxed ${isVibe ? 'text-white/90' : 'text-dark-onSurface'}`}
                                  >
                                    <div className="markdown-body">
                                      <p>
                                        {t(
                                          session === 'research'
                                            ? 'demo.researchResponse'
                                            : 'demo.response',
                                        )}
                                      </p>
                                      <ol>
                                        <li>{t('demo.stepOne')}</li>
                                        <li>{t('demo.stepTwo')}</li>
                                        <li>{t('demo.stepThree')}</li>
                                      </ol>
                                    </div>
                                  </div>
                                  <div className="message-action-bar flex items-center gap-1 mt-0.5 pl-0.5">
                                    {actionButton(
                                      'copy',
                                      d('common.copy'),
                                      () => void copy(assistantText),
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {fixture.messages.map((message, index) => (
                            <div className="pt-6" key={index}>
                              {userMessage(
                                message.content,
                                false,
                                message.attachment,
                                message.plan,
                              )}
                            </div>
                          ))}
                          <div className="pt-6" />
                        </div>
                      </div>
                      {composer}
                    </>
                  )}
                  {empty && !isVibe && <DesktopThemeWaves />}
                </div>
              </div>
              {workbench && (
                <aside
                  aria-label={d('workbench.panelAria')}
                  className={`workbench-panel flex flex-col desktop-workbench ${isVibe ? 'vibe-workbench-panel liquid-glass-strong border-white/15 text-white' : 'border-l border-dark-onSurfaceVariant/10 bg-dark-surfaceDim'}`}
                >
                  <div
                    className={`relative z-10 flex min-h-12 shrink-0 items-center gap-1 px-2 py-1.5 ${isVibe ? '' : 'bg-dark-surfaceContainer/40'}`}
                  >
                    <div
                      role="tablist"
                      aria-label={d('workbench.panelAria')}
                      className="flex min-w-0 flex-1 items-center gap-1"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected="true"
                        className={`md-focus flex h-9 min-w-0 items-center gap-2 rounded-md3-sm border px-2.5 text-ui-xs ${isVibe ? 'border-white/15 bg-white/15 text-white' : 'border-dark-onSurfaceVariant/10 bg-dark-surface text-dark-onSurface'}`}
                      >
                        <I name="folder-open" size={14} />
                        {d('workbench.tabFiles')}
                      </button>
                    </div>
                    {iconButton('plus', d('workbench.addMenu'), localOnly, 15)}
                    {iconButton(
                      'panel-right',
                      d('titlebar.toggleWorkbench'),
                      () => setWorkbench(false),
                      15,
                    )}
                  </div>
                  <div className="flex h-full min-h-0">
                    <div className="h-full w-[36%] min-w-[128px] max-w-64 overflow-y-auto border-r border-dark-onSurfaceVariant/10">
                      <div className="py-1">
                        <div className="flex items-center justify-between px-2 mb-2">
                          <span className="text-xs text-dark-onSurfaceVariant/50 truncate flex-1">
                            D:\Projects\clerkbox
                          </span>
                        </div>
                        <div className="flex items-center gap-1 py-1 px-2 text-xs">
                          <I name="chevron-down" size={12} />
                          <I name="folder-open" size={14} />
                          <span>clerkbox</span>
                        </div>
                        <button
                          type="button"
                          onClick={localOnly}
                          className="flex items-center gap-2 py-1 pl-7 text-xs text-dark-onSurfaceVariant"
                        >
                          <I name="file-text" size={14} />
                          brief.md
                        </button>
                      </div>
                    </div>
                    <div className="relative flex h-full min-w-0 flex-1 flex-col">
                      <div className="flex min-h-11 items-center gap-2 border-b border-dark-onSurfaceVariant/10 px-2 py-1 text-ui-xs">
                        {iconButton(
                          'panel-left-close',
                          d('workbench.hideFileList'),
                          localOnly,
                          14,
                        )}
                      </div>
                      <div className="flex h-full flex-col items-center justify-center gap-3 px-5 py-6 text-ui-sm text-center text-dark-onSurfaceVariant">
                        <I name="file" size={28} className="opacity-60" />
                        <span className="leading-relaxed">
                          {d('workbench.previewEmpty')}
                        </span>
                      </div>
                    </div>
                  </div>
                </aside>
              )}
            </div>
          </div>
          {drawer && (
            <div className="desktop-drawer">
              <button
                type="button"
                className="desktop-drawer-backdrop"
                aria-label={d('common.close')}
                onClick={() => setDrawer(false)}
              />
              <div className="desktop-drawer-panel">{sidebar}</div>
            </div>
          )}
        </div>
        {more && (
          <dialog
            ref={moreRef}
            aria-label={d('vibe.moreActions')}
            className="desktop-more vibe-popover vibe-more liquid-glass-strong"
            onCancel={(event) => cancelDialog(event, () => setMore(false))}
            onClick={(event) => {
              if (event.target === event.currentTarget) setMore(false)
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMore(false)
                localOnly()
              }}
            >
              <I name="settings" size={16} />
              {d('sidebar.settings')}
            </button>
            <button
              type="button"
              onClick={() => {
                setMore(false)
                localOnly()
              }}
            >
              <I name="maximize" size={16} />
              {d('vibe.fullscreen')}
            </button>
            <button type="button" onClick={() => setMode('work')}>
              <I name="log-out" size={16} />
              {d('vibe.exit')}
            </button>
          </dialog>
        )}
        {searchOpen && (
          <dialog
            ref={searchRef}
            aria-label={d('commands.palette')}
            className={`desktop-search flex max-h-[78dvh] w-full max-w-xl flex-col overflow-hidden rounded-md3-lg border shadow-elevation-3 outline-none ${isVibe ? 'liquid-glass-strong text-white' : 'border-dark-onSurfaceVariant/15 bg-dark-surface text-dark-onSurface'}`}
            onCancel={(event) =>
              cancelDialog(event, () => setSearchOpen(false))
            }
            onClick={(event) => {
              if (event.target === event.currentTarget) setSearchOpen(false)
            }}
          >
            <div
              className={`flex shrink-0 items-center gap-3 border-b px-4 ${isVibe ? 'border-white/15' : 'border-dark-onSurfaceVariant/10'}`}
            >
              <I
                name="search"
                size={16}
                className="shrink-0 text-dark-onSurfaceVariant/60"
              />
              <input
                autoFocus
                role="combobox"
                aria-label={d('commandPalette.placeholder')}
                aria-autocomplete="list"
                aria-expanded="true"
                aria-controls={`${id}-search-list`}
                aria-activedescendant={
                  searchMatches.length
                    ? `${id}-search-${Math.min(searchIndex, searchMatches.length - 1)}`
                    : undefined
                }
                placeholder={d('commandPalette.placeholder')}
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setSearchIndex(0)
                }}
                onKeyDown={(event) => {
                  if (
                    event.nativeEvent.isComposing ||
                    event.nativeEvent.keyCode === 229
                  )
                    return
                  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                    event.preventDefault()
                    setSearchIndex(
                      (index) =>
                        (index +
                          (event.key === 'ArrowDown' ? 1 : -1) +
                          Math.max(1, searchMatches.length)) %
                        Math.max(1, searchMatches.length),
                    )
                  } else if (event.key === 'Enter' && searchMatches.length) {
                    event.preventDefault()
                    switchChat(
                      searchMatches[
                        Math.min(searchIndex, searchMatches.length - 1)
                      ],
                    )
                  }
                }}
                className={`h-14 min-w-0 flex-1 bg-transparent text-ui-base outline-none ${isVibe ? 'placeholder:text-white/50' : 'placeholder:text-dark-onSurfaceVariant/60'}`}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label={d('common.close')}
                className="md-focus flex h-9 w-9 shrink-0 items-center justify-center rounded-md3-sm text-dark-onSurfaceVariant hover:bg-dark-surfaceContainer"
              >
                <I name="x" size={17} />
              </button>
            </div>
            <div
              id={`${id}-search-list`}
              role="listbox"
              aria-label={d('commands.palette')}
              className="min-h-0 overflow-y-auto overscroll-contain p-2"
            >
              {searchMatches.length === 0 ? (
                <p className="px-4 py-10 text-center text-ui-sm opacity-60">
                  {d('commandPalette.noResults')}
                </p>
              ) : (
                <p
                  role="presentation"
                  className="px-3 pb-2 pt-3 text-ui-xs font-medium opacity-60"
                >
                  {d(
                    search.trim()
                      ? 'commandPalette.sessions'
                      : 'commandPalette.recentSessions',
                  )}
                </p>
              )}
              {searchMatches.map((value, index) => (
                <button
                  key={value}
                  id={`${id}-search-${index}`}
                  type="button"
                  role="option"
                  aria-selected={
                    index === Math.min(searchIndex, searchMatches.length - 1)
                  }
                  tabIndex={-1}
                  onMouseEnter={() => setSearchIndex(index)}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-md3-sm px-3 py-2.5 text-left text-ui-sm transition-colors ${index === searchIndex ? (isVibe ? 'bg-white/15 text-white' : 'bg-dark-surfaceContainerHigh text-dark-onSurface') : isVibe ? 'text-white/75' : 'text-dark-onSurfaceVariant'}`}
                  onClick={() => switchChat(value)}
                >
                  <I
                    name="message-square"
                    size={15}
                    className="shrink-0 opacity-60"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">
                      {t(
                        `demo.${value === 'homepage' ? 'sessionTitle' : 'researchTitle'}`,
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-ui-xs opacity-60">
                      clerkbox
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <div
              className={`flex shrink-0 items-center gap-4 border-t px-4 py-3 text-ui-xs ${isVibe ? 'border-white/15 text-white/60' : 'border-dark-onSurfaceVariant/10 text-dark-onSurfaceVariant/60'}`}
            >
              <span className="inline-flex items-center gap-1">
                <I name="arrow-up" size={12} />
                <I name="arrow-down" size={12} />
                {d('commandPalette.navigate')}
              </span>
              <span className="inline-flex items-center gap-1">
                <I name="corner-down-left" size={13} />
                {d('commandPalette.execute')}
              </span>
              <span className="ml-auto tabular-nums" role="status">
                {d('commandPalette.resultCount', {
                  count: searchMatches.length,
                })}
              </span>
            </div>
          </dialog>
        )}

        {recallOpen && (
          <dialog
            ref={recallRef}
            className="desktop-rewind"
            aria-labelledby={`${id}-rewind-title`}
            aria-describedby={`${id}-rewind-description`}
            onCancel={(event) =>
              cancelDialog(event, () => setRecallOpen(false))
            }
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing && event.key === 'Escape')
                event.preventDefault()
              if (
                event.key === 'Enter' &&
                (event.ctrlKey || event.metaKey) &&
                !event.nativeEvent.isComposing
              )
                recall()
            }}
          >
            <div className="shrink-0 px-5 py-4 border-b border-dark-onSurfaceVariant/10 flex items-center gap-2">
              <h2
                id={`${id}-rewind-title`}
                className="flex-1 text-sm font-semibold"
              >
                {d('chat.rewind.recallTitle')}
              </h2>
              <button
                type="button"
                onClick={() => setRecallOpen(false)}
                aria-label={d('common.close')}
                className="md-focus flex h-9 w-9 shrink-0 items-center justify-center rounded-md3-sm text-dark-onSurfaceVariant hover:bg-dark-surfaceContainerHigh"
              >
                <I name="x" size={15} />
              </button>
            </div>
            <div className="min-h-0 px-5 py-4 overflow-y-auto space-y-4 text-ui-sm leading-relaxed">
              <p
                id={`${id}-rewind-description`}
                className="text-dark-onSurfaceVariant"
              >
                {d('chat.rewind.willRemove', {
                  count: 2 + fixture.messages.length,
                })}
              </p>
              <section className="min-w-0 rounded-md3-md border border-dark-onSurfaceVariant/10 bg-dark-surfaceContainer/60 px-3 py-3">
                <h3 className="mb-2 text-ui-xs font-medium text-dark-onSurfaceVariant">
                  {d('chat.rewind.selectedMessage')}
                </h3>
                <p className="text-ui-sm whitespace-pre-wrap">{prompt}</p>
                <div className="mt-2 flex min-w-0 flex-wrap gap-1.5 text-ui-xs text-dark-onSurfaceVariant">
                  <span className="rounded-md3-xs bg-md-primary/10 px-2 py-1 text-md-primary">
                    {d('chat.rewind.selectedTaskMode', { mode: 'Plan' })}
                  </span>
                  <span className="rounded-md3-xs bg-dark-surfaceContainerHigh px-2 py-1">
                    brief.md
                  </span>
                </div>
              </section>
              <p className="text-dark-onSurfaceVariant/75">
                {d('chat.rewind.restoreDraft')}
              </p>
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={withFiles}
                  onChange={(event) => setWithFiles(event.target.checked)}
                />
                <span className="text-dark-onSurfaceVariant">
                  {d('chat.rewind.withFiles')}
                </span>
              </label>
              {!withFiles && (
                <p className="text-[11px] text-dark-onSurfaceVariant/70">
                  {d('chat.rewind.filesKept')}
                </p>
              )}
              <div>
                <div className="text-[11px] font-medium mb-1 text-dark-onSurfaceVariant">
                  {d(
                    withFiles
                      ? 'chat.rewind.willRestore'
                      : 'chat.rewind.affectedFiles',
                    { count: 1 },
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-dark-onSurfaceVariant/85">
                  <span>…/src/App.tsx</span>
                  <span className="opacity-70">428 B</span>
                </div>
              </div>
              {(fixture.draft.trim() || fixture.attachment || fixture.plan) && (
                <p role="alert" className="text-ui-xs text-md-error">
                  {d('chat.rewind.draftConflict')}
                </p>
              )}
            </div>
            <div className="shrink-0 flex flex-wrap items-center justify-end gap-2 px-5 py-4 border-t border-dark-onSurfaceVariant/10 bg-dark-surfaceContainer/40">
              <button
                type="button"
                autoFocus
                onClick={() => setRecallOpen(false)}
                className="md-focus min-h-10 max-md:min-h-11 px-4 py-2 rounded-md3-sm text-sm text-dark-onSurfaceVariant hover:bg-dark-surfaceContainerHigh"
              >
                {d('chat.rewind.cancel')}
              </button>
              <button
                type="button"
                disabled={
                  !!fixture.draft.trim() || fixture.attachment || fixture.plan
                }
                onClick={recall}
                className="md-focus min-h-10 max-md:min-h-11 px-4 py-2 rounded-md3-sm text-sm font-medium bg-md-error text-white hover:bg-md-error/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {d('chat.rewind.confirm')}
              </button>
            </div>
          </dialog>
        )}
        {customize && (
          <dialog
            ref={customizeRef}
            className="desktop-customize liquid-glass-strong"
            aria-labelledby={`${id}-customize-title`}
            onCancel={(event) => cancelDialog(event, () => setCustomize(false))}
          >
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 p-5">
              <div className="min-w-0">
                <h2
                  id={`${id}-customize-title`}
                  className="text-ui-lg font-semibold"
                >
                  {d('vibe.customizeTitle')}
                </h2>
                <p className="mt-1 text-ui-xs leading-relaxed text-white/60">
                  {d('vibe.settingsDescription')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCustomize(false)}
                aria-label={d('common.close')}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md3-sm text-white/70 hover:bg-white/10"
              >
                <I name="x" size={18} />
              </button>
            </header>
            <div className="mx-5 mt-4 flex shrink-0 gap-1 rounded-md3-md bg-black/20 p-1">
              <button
                type="button"
                className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md3-sm px-3 py-2 text-ui-xs bg-white/10 font-medium text-white"
              >
                <I name="image" size={15} />
                {d('vibe.tabBackground')}
              </button>
              <button
                type="button"
                onClick={localOnly}
                className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md3-sm px-3 py-2 text-ui-xs text-white/60"
              >
                <I name="music-2" size={15} />
                {d('vibe.tabAudio')}
              </button>
            </div>
            <div className="p-5 space-y-5">
              <fieldset>
                <legend className="mb-2 text-ui-xs font-medium text-white/80">
                  {d('vibe.backgroundSource')}
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {(['single', 'slideshow', 'glass'] as const).map((value) => (
                    <label
                      key={value}
                      className={`flex cursor-pointer min-h-10 items-center justify-center gap-2 rounded-md3-sm border px-3 py-2 text-ui-xs ${reading === value ? 'border-white/40 bg-white/10' : 'border-white/15'}`}
                    >
                      <input
                        type="radio"
                        name={`${id}-background`}
                        checked={reading === value}
                        onChange={() => {
                          if (value === 'single') setReading(value)
                          else localOnly()
                        }}
                        className="accent-white"
                      />
                      {d(
                        `vibe.${value === 'single' ? 'bgModeSingle' : value === 'slideshow' ? 'bgModeSlideshow' : 'bgModeGlass'}`,
                      )}
                    </label>
                  ))}
                </div>
              </fieldset>
              <p className="text-ui-xs text-white/60">
                {t('demo.vibeBackgroundNote')}
              </p>
              <div className="rounded-md3-md border border-white/10 bg-black/10 p-3 text-ui-xs text-white/60">
                {d('vibe.backgroundReady')}
              </div>
              <div className="space-y-2 border-t border-white/10 pt-4">
                <label className="block space-y-2 text-ui-xs text-white/80">
                  <span className="flex justify-between gap-3">
                    <span>{d('vibe.readingOpacity')}</span>
                    <output>{opacity}%</output>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={opacity}
                    aria-label={d('vibe.readingOpacity')}
                    onChange={(event) => setOpacity(Number(event.target.value))}
                    className="h-8 w-full cursor-pointer accent-white"
                  />
                </label>
                <p className="text-ui-xs leading-relaxed text-white/50">
                  {d('vibe.readingOpacityHint')}
                </p>
              </div>
            </div>
          </dialog>
        )}
      </div>
      <div className="product-demo-caption">
        <span>{t(`demo.${mode}Caption`)}</span>
        <small>
          {t('demo.disclaimer')}{' '}
          <button
            type="button"
            onClick={() => {
              setChats({ homepage: fresh(), research: fresh(), new: fresh() })
              setDeleted([])
              setSession('homepage')
              setFilesRestored(false)
              setNotice(t('demo.resetNotice'))
            }}
          >
            {t('demo.reset')}
          </button>
        </small>
      </div>
      <div className="product-demo-notice" role="status">
        {notice || (filesRestored ? t('demo.fileRestored') : '')}
      </div>
    </div>
  )
}
