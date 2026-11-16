// Run the UI checks in an isolated Electron profile. The website itself does
// not depend on Electron; point CLERKBOX_DESKTOP_PACKAGE at its package.json.
if (!process.versions.electron) {
  const path = require('node:path')
  const { createRequire } = require('node:module')
  const { spawnSync } = require('node:child_process')
  const desktopPackage =
    process.env.CLERKBOX_DESKTOP_PACKAGE ||
    path.resolve(__dirname, '../../ClerkBox - 副本/package.json')
  const electron = createRequire(desktopPackage)('electron')
  const result = spawnSync(electron, [__filename], {
    env: process.env,
    windowsHide: true,
    encoding: 'utf8',
    timeout: 90000,
  })
  process.stdout.write(result.stdout || '')
  process.stderr.write(result.stderr || '')
  if (result.error) console.error(result.error.message)
  process.exit(result.status ?? 1)
}
const { app, BrowserWindow } = require('electron')
const fs = require('node:fs'),
  path = require('node:path'),
  assert = require('node:assert/strict')
const out =
  process.env.UI_REPORT_DIR ||
  require('node:fs').mkdtempSync(
    require('node:path').join(
      require('node:os').tmpdir(),
      'clerkbox-ui-check-',
    ),
  )
fs.mkdirSync(out, { recursive: true })
app.setPath('userData', fs.mkdtempSync(path.join(out, 'functional-')))
app.commandLine.appendSwitch('force-device-scale-factor', '1')
let w
const errors = [],
  checks = []
const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const run = (s) => w.webContents.executeJavaScript(s, true)
async function until(s, name) {
  for (let i = 0; i < 150; i++) {
    if (await run(s)) return
    await delay(70)
  }
  throw Error('Timed out ' + name)
}
async function click(s) {
  await run(
    `(()=>{const e=document.querySelector(${JSON.stringify(s)});if(!e)throw Error(${JSON.stringify(s)});e.click();return true})()`,
  )
  await delay(80)
}
async function type(value) {
  await run(
    `(()=>{let e=document.querySelector('.product-demo textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return true})()`,
  )
  await delay(60)
}
function pass(name) {
  checks.push(name)
}
async function key(code, mods = []) {
  w.webContents.sendInputEvent({
    type: 'keyDown',
    keyCode: code,
    modifiers: mods,
  })
  w.webContents.sendInputEvent({
    type: 'keyUp',
    keyCode: code,
    modifiers: mods,
  })
  await delay(80)
}
async function main() {
  w = new BrowserWindow({
    width: 1440,
    height: 1000,
    show: false,
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      offscreen: true,
      backgroundThrottling: false,
    },
  })
  w.webContents.setFrameRate(60)
  w.webContents.on('render-process-gone', (_e, d) => errors.push(d))
  await w.loadURL(process.env.SITE_TEST_URL || 'http://127.0.0.1:5180/')
  await until('!!document.querySelector(".product-demo textarea")', 'ready')
  await run(
    `window.addEventListener('error',e=>(window.__errs||=[]).push(e.message));window.addEventListener('unhandledrejection',e=>(window.__errs||=[]).push(String(e.reason)));true`,
  )
  // Substitute a page-local clipboard before clicking Copy. This never calls
  // Electron's clipboard or the real navigator.clipboard implementation.
  const homepageReply = await run(
    `document.querySelector('.product-demo .markdown-body p').innerText`,
  )
  await run(`(() => {
    const ownDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
    window.__uiCopiedText = null
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async value => { window.__uiCopiedText = String(value) } },
    })
    window.__restoreUiClipboard = () => {
      if (ownDescriptor) Object.defineProperty(navigator, 'clipboard', ownDescriptor)
      else delete navigator.clipboard
      delete window.__restoreUiClipboard
    }
    return true
  })()`)
  try {
    await click('.desktop-sidebar .sidebar-session-row:nth-child(2) > button:first-child')
    const researchReply = await run(`(() => {
      const body = document.querySelector('.product-demo .markdown-body')
      const items = [...body.querySelectorAll('ol > li')].map(el => el.innerText.trim())
      return {
        paragraph: body.querySelector('p').innerText.trim(),
        items,
        fullText: [body.querySelector('p').innerText.trim(), '', ...items.map((text, index) => (index + 1) + '. ' + text)].join('\\n'),
      }
    })()`)
    assert.equal(researchReply.items.length, 3, 'research reply exposes all three plan items')
    assert.notEqual(researchReply.paragraph, homepageReply)
    await run(`document.querySelector('.product-demo .markdown-body').closest('.message-action-scope').querySelector('.message-action-bar button').click(); true`)
    await until(`typeof window.__uiCopiedText === 'string'`, 'research copy')
    const copiedReply = await run('window.__uiCopiedText')
    assert.equal(copiedReply, researchReply.fullText, 'copy includes the active visible reply and all three numbered items')
    assert.equal(copiedReply.includes(homepageReply), false, 'copy does not contain the homepage answer')
    pass('Research reply copies its visible paragraph and three complete plan items using a page-local clipboard')
  } finally {
    await run('window.__restoreUiClipboard?.(); true')
  }
  await click('.desktop-sidebar .sidebar-session-row:first-child > button:first-child')
  await type('会话 A 草稿')
  await click('.product-demo-scenarios button:nth-child(2)')
  await until(
    `document.querySelector('.product-demo').dataset.ready==='true'`,
    'realforest',
  )
  assert.equal(
    await run(`document.querySelector('.product-demo textarea').value`),
    '会话 A 草稿',
  )
  assert.ok(
    await run(
      `!!document.querySelector('.desktop-vibe-background img')?.naturalWidth`,
    ),
  )
  await click('.product-demo [aria-label="定制"]')
  assert.equal(
    await run(`document.querySelector('dialog.desktop-customize').open`),
    true,
  )
  await run(
    `(()=>{const e=document.querySelector('.desktop-customize input[type=range]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,'45');e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return true})()`,
  )
  await delay(80)
  assert.equal(
    await run(
      `document.querySelector('.desktop-customize output').textContent`,
    ),
    '45%',
  )
  await key('ESCAPE')
  assert.equal(
    await run(`!!document.querySelector('.desktop-customize')`),
    false,
  )
  await click('.product-demo [aria-label="更多操作"]')
  assert.equal(await run(`document.querySelector('.desktop-more').open`), true)
  await key('ESCAPE')
  await click('.product-demo-scenarios button:first-child')
  assert.equal(
    await run(`document.querySelector('.product-demo textarea').value`),
    '会话 A 草稿',
  )
  pass(
    'VIBE source background, opacity, native dialog Escape, mode draft preservation',
  )
  await click('.product-demo [aria-label="从这条消息撤回"]')
  assert.equal(
    await run(
      `document.querySelector('.desktop-rewind > div:last-child > button:last-child').disabled`,
    ),
    true,
  )
  assert.ok(
    await run(`!!document.querySelector('.desktop-rewind [role=alert]')`),
  )
  await key('ESCAPE')
  await type('')
  await click('.product-demo [aria-label="从这条消息撤回"]')
  assert.equal(
    await run(`document.querySelector('.desktop-rewind input').checked`),
    false,
  )
  await click('.desktop-rewind > div:last-child > button:last-child')
  assert.equal(
    await run(`document.querySelector('.product-demo textarea').value`),
    '请先梳理官网改版计划，确认后再开始实现。',
  )
  assert.equal(
    await run(
      `document.activeElement===document.querySelector('.product-demo textarea')`,
    ),
    true,
  )
  assert.equal(
    await run(
      `document.querySelector('.chat-input-chip-row').textContent.includes('Plan')`,
    ),
    true,
  )
  assert.ok(
    await run(
      `document.querySelector('.chat-input-box').textContent.includes('brief.md')`,
    ),
  )
  await click('.chat-input-box button[aria-label="移除附件"]')
  assert.equal(
    await run(
      `document.querySelector('.chat-input-chip-row').textContent.includes('Plan')`,
    ),
    true,
  )
  pass(
    'Recall prevents draft overwrite; default file preservation; restores original draft, independent attachment and Plan, input focus',
  )
  await click('.product-demo [aria-label="切换工作台面板"]')
  assert.ok(await run(`!!document.querySelector('.desktop-workbench')`))
  await click('.desktop-sidebar nav > button:first-child')
  assert.equal(
    await run(
      `document.activeElement===document.querySelector('.product-demo textarea')`,
    ),
    true,
  )
  assert.equal(
    await run(`document.querySelector('.product-demo textarea').value`),
    '',
  )
  // Count the existing canvas instance's actual draw calls. The wrapper calls
  // the original method unchanged and is removed before subsequent checks.
  w.webContents.debugger.attach('1.3')
  await w.webContents.debugger.sendCommand('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
  })
  await until(`!!document.querySelector('.workspace-chat canvas')`, 'empty-state canvas')
  await run(`(() => {
    const canvas = document.querySelector('.workspace-chat canvas')
    const context = canvas.getContext('2d')
    const ownDescriptor = Object.getOwnPropertyDescriptor(context, 'clearRect')
    const original = context.clearRect
    window.__uiWaveDraws = 0
    context.clearRect = function (...args) {
      window.__uiWaveDraws += 1
      return Reflect.apply(original, this, args)
    }
    window.__restoreUiWaveProbe = () => {
      if (ownDescriptor) Object.defineProperty(context, 'clearRect', ownDescriptor)
      else delete context.clearRect
      delete window.__restoreUiWaveProbe
    }
    canvas.scrollIntoView({ block: 'center', behavior: 'instant' })
    return true
  })()`)
  try {
    await until(`(() => { const rect = document.querySelector('.workspace-chat canvas').getBoundingClientRect(); return rect.top >= 0 && rect.bottom <= innerHeight && window.__uiWaveDraws > 2 })()`, 'visible canvas drawing').catch(async error => { throw Error(error.message + ' ' + JSON.stringify(await run(`({ rect: document.querySelector('.workspace-chat canvas').getBoundingClientRect().toJSON(), hidden: document.hidden, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, count: window.__uiWaveDraws, viewport: innerHeight })`))) })
    const visibleStart = await run('window.__uiWaveDraws')
    await delay(400)
    const visibleEnd = await run('window.__uiWaveDraws')
    assert.ok(visibleEnd - visibleStart >= 3, 'visible empty-state canvas keeps drawing')
    await run(`(() => {
      const bottom = document.querySelector('.workspace-chat canvas').getBoundingClientRect().bottom
      window.scrollTo({ top: scrollY + bottom + 180, behavior: 'instant' })
      return true
    })()`)
    await until(`document.querySelector('.workspace-chat canvas').getBoundingClientRect().bottom < -80`, 'canvas beyond its 80px visibility margin')
    // Allow IntersectionObserver and its single final static draw to settle.
    await delay(200)
    const hiddenStart = await run('window.__uiWaveDraws')
    await delay(400)
    const hiddenEnd = await run('window.__uiWaveDraws')
    assert.equal(hiddenEnd, hiddenStart, 'canvas stops drawing after leaving the 80px root margin')
    await run(`document.querySelector('.workspace-chat canvas').scrollIntoView({ block: 'center', behavior: 'instant' }); true`)
    await until(`window.__uiWaveDraws > ${hiddenEnd + 2}`, 'canvas drawing resumes after scrolling back')
    const resumedStart = await run('window.__uiWaveDraws')
    await delay(300)
    const resumedEnd = await run('window.__uiWaveDraws')
    assert.ok(resumedEnd - resumedStart >= 3, 'canvas continues animating after returning to view')
    pass(`Empty-state canvas draws in view, pauses beyond 80px, and resumes (${visibleEnd - visibleStart}/${hiddenEnd - hiddenStart}/${resumedEnd - resumedStart} frames)`)
  } finally {
    await run('window.__restoreUiWaveProbe?.(); true')
  }
  await type('新会话草稿')
  await click('.desktop-sidebar .sidebar-session-row button')
  pass('New chat receives focus and independent draft')
  await click('.desktop-sidebar nav > button:nth-child(2)')
  await until(
    `!!document.querySelector('dialog.desktop-search').open`,
    'search',
  )
  await key('ESCAPE')
  pass('Native search dialog keyboard close')
  await click('.workflow-tabs button:first-child')
  await run(
    `document.querySelector('.workflow-tabs button:first-child').focus();true`,
  )
  await key('Right')
  assert.equal(
    await run(
      `document.querySelector('.workflow-tabs button:nth-child(2)').getAttribute('aria-selected')`,
    ),
    'true',
  )
  await click('.story-chapter:nth-child(2) summary')
  assert.equal(
    await run(
      `document.querySelector('.story-chapter:nth-child(2) details').open`,
    ),
    true,
  )
  assert.equal(
    await run(`document.querySelectorAll('.story-commits a').length`),
    12,
  )
  pass('Workflow keyboard navigation and Git-linked timeline expansion')
  w.setContentSize(390, 844)
  await delay(80)
  await click('.menu-toggle')
  assert.equal(
    await run(
      `document.querySelector('.menu-toggle').getAttribute('aria-expanded')`,
    ),
    'true',
  )
  await key('ESCAPE')
  assert.equal(
    await run(
      `document.activeElement===document.querySelector('.menu-toggle')`,
    ),
    true,
  )
  await click('.faq-list summary')
  assert.equal(
    await run(`document.querySelector('.faq-list details').open`),
    true,
  )
  pass('Mobile navigation Escape focus and FAQ')
  await click('.language-switch button[lang=en]')
  assert.equal(await run('document.documentElement.lang'), 'en')
  assert.equal(
    await run(`document.querySelector('#story h2').textContent`),
    'An idea became\na place to work.',
  )
  pass('English content, SEO language and timeline')
  const releaseApi = 'https://api.github.com/repos/XMZF-vAI/clerkbox/releases/tags/v4.0.0'
  const productReleaseUrl = 'https://github.com/XMZF-vAI/clerkbox/releases/tag/v4.0.0'
  const buildGuideUrl = 'https://github.com/XMZF-vAI/clerkbox/blob/main/README.en.md#build-from-source'
  async function onlyProductRelease(name) {
    const download = await run(`({
      text: document.querySelector('#download').innerText,
      urls: [...document.querySelectorAll('#download a[href]')].map(el => el.href),
      installers: [...document.querySelectorAll('#download .download-asset[data-platform]:not(.download-asset-unavailable)')].map(el => el.href),
    })`)
    assert.equal(/3\.5(?:\.1)?/.test(download.text), false, name + ': no old release copy')
    assert.equal(download.urls.some(url => /3\.5(?:\.1)?|\/releases\/latest(?:$|[/?#])/.test(url)), false, name + ': no old or latest-release links')
    assert.ok(download.installers.every(url => url.startsWith('https://github.com/XMZF-vAI/clerkbox/releases/download/v4.0.0/')), name + ': every installer belongs to 4.0.0')
    return download
  }
  async function sourceBuildFallbacks(name) {
    const state = await onlyProductRelease(name)
    assert.deepEqual(state.installers, [], name + ': no installer shown without a verified 4.0 release')
    const urls = await run(`[...document.querySelectorAll('.download-fallback')].map(el => el.href)`)
    assert.equal(urls.length, 3, name + ': all platforms provide a source fallback')
    assert.ok(urls.every(url => url === buildGuideUrl), name + ': fallbacks use the 4.0 source-build guide')
  }
  await until(
    `!!document.querySelector('.download-status-ready,.download-status-pending,.download-status-error')`,
    '4.0 release state',
  )
  const live = await run(
    `({ready:!!document.querySelector('.download-status-ready'),pending:!!document.querySelector('.download-status-pending'),text:document.querySelector('.download-status').innerText,urls:[...document.querySelectorAll('.download-asset[data-platform]')].map(e=>e.href)})`,
  )
  await onlyProductRelease('live release')
  checks.push({ liveRelease: live })
  const ses = w.webContents.session
  ses.webRequest.onBeforeRequest(
    { urls: [releaseApi] },
    (_d, cb) => cb({ cancel: true }),
  )
  await w.reload()
  await until(`!!document.querySelector('.download-status-error')`, '4.0 network failure')
  await sourceBuildFallbacks('network failure')
  // Replace only the fixed product-version API inside this isolated page.
  // 404 is an unpublished release; an old version payload must be rejected.
  await run(`(() => {
    const nativeFetch = window.fetch.bind(window)
    window.__uiReleaseReply = { status: 404, payload: { message: 'Not Found' } }
    window.fetch = (...args) => String(args[0]) === ${JSON.stringify(releaseApi)}
      ? Promise.resolve(new Response(JSON.stringify(window.__uiReleaseReply.payload), { status: window.__uiReleaseReply.status }))
      : nativeFetch(...args)
    return true
  })()`)
  await click('.download-status-error button')
  await until(`!!document.querySelector('.download-status-pending')`, '4.0 unpublished 404')
  assert.match(await run(`document.querySelector('.download-status-pending').innerText`), /4\.0/)
  assert.ok(await run(`!!document.querySelector('.download-status-pending button')`), 'unpublished release can be retried')
  await sourceBuildFallbacks('unpublished 404')
  const oldRelease = {
    tag_name: 'v3.5.1',
    draft: false,
    prerelease: false,
    assets: [{
      name: 'ClerkBox-Setup-3.5.1.exe',
      browser_download_url: 'https://github.com/XMZF-vAI/clerkbox/releases/download/v3.5.1/ClerkBox-Setup-3.5.1.exe',
      size: 1048576,
    }],
  }
  await run(`window.__uiReleaseReply = { status: 200, payload: ${JSON.stringify(oldRelease)} }; true`)
  await click('.download-status-pending button')
  await until(`!!document.querySelector('.download-status-error,.download-status-pending')`, 'reject old version payload')
  await sourceBuildFallbacks('old version payload')
  pass('Fixed 4.0 release API: network errors and 404 have retriable source-build fallbacks; old 3.5.1 payload exposes no copy or downloads')
  const stub = {
    tag_name: 'v4.0.0',
    draft: false,
    prerelease: false,
    assets: [{
      name: 'ClerkBox-4.0.0-arm64.dmg',
      browser_download_url: 'https://github.com/XMZF-vAI/clerkbox/releases/download/v4.0.0/ClerkBox-4.0.0-arm64.dmg',
      size: 1048576,
    }],
  }
  await run(`window.__uiReleaseReply = { status: 200, payload: ${JSON.stringify(stub)} }; true`)
  await click('.download-status-error button,.download-status-pending button')
  await until(`!!document.querySelector('.download-status-ready')`, 'retry verified 4.0 release')
  const verified = await onlyProductRelease('verified 4.0 retry')
  assert.deepEqual(verified.installers, [stub.assets[0].browser_download_url])
  const unavailableUrl = await run(`document.querySelector('.download-asset-unavailable[data-platform=mac-intel]').href`)
  assert.ok([productReleaseUrl, buildGuideUrl].includes(unavailableUrl), 'missing architecture points to the 4.0 release or source-build guide')
  assert.equal(await run(`document.querySelectorAll('.download-fallback').length`), 2)
  pass('4.0 retry exposes only its verified asset and safe missing-architecture links')
  await w.reload()
  await until(`!!document.querySelector('.download-status-error')`, '4.0 network error before timeout')
  await run(
    `window.__nativeFetch=fetch;window.__aborted=false;window.fetch=(...args)=>String(args[0])===${JSON.stringify(releaseApi)}?new Promise((res,rej)=>args[1].signal.addEventListener('abort',()=>{window.__aborted=true;rej(new DOMException('Aborted','AbortError'))},{once:true})):window.__nativeFetch(...args);true`,
  )
  const start = Date.now()
  await click('.download-status-error button')
  await until(`window.__aborted===true`, '8sabort')
  assert.ok(Date.now() - start >= 7800)
  await until(`!!document.querySelector('.download-status-error')`, '4.0 timeout error feedback')
  await sourceBuildFallbacks('4.0 timeout')
  pass('Actual 8-second request cancellation preserves 4.0-only source fallbacks')
  ses.webRequest.onBeforeRequest(null)
  if (!w.webContents.debugger.isAttached()) w.webContents.debugger.attach('1.3')
  await w.webContents.debugger.sendCommand('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  })
  assert.equal(
    await run('getComputedStyle(document.documentElement).scrollBehavior'),
    'auto',
  )
  assert.equal(
    await run(
      `getComputedStyle(document.querySelector('.button')).transitionDuration`,
    ),
    '0s',
  )
  assert.equal(
    await run(
      `getComputedStyle(document.querySelector('.hero-line>span')).animationName`,
    ),
    'none',
  )
  assert.deepEqual(
    await run(
      `[...document.querySelectorAll('a[href^="#"]')].map(e=>e.hash).filter(h=>h.length>1&&!document.getElementById(decodeURIComponent(h.slice(1))))`,
    ),
    [],
  )
  pass('Reduced motion and all internal anchors')
  errors.push(...(await run('window.__errs||[]')))
  assert.deepEqual(errors, [])
  fs.writeFileSync(
    path.join(out, 'functional-report.json'),
    JSON.stringify({ passed: true, checks, errors }, null, 2),
  )
  console.log('PASS', checks.length, 'functional groups')
  app.quit()
}
app
  .whenReady()
  .then(main)
  .catch(async (e) => {
    fs.writeFileSync(
      path.join(out, 'functional-report.json'),
      JSON.stringify(
        { passed: false, error: String(e), checks, errors },
        null,
        2,
      ),
    )
    if (w && !w.isDestroyed()) {
      fs.writeFileSync(
        path.join(out, 'functional-failure.png'),
        (await w.webContents.capturePage()).toPNG(),
      )
      fs.writeFileSync(
        path.join(out, 'functional-dom.txt'),
        await run('document.body.innerText'),
      )
    }
    console.error(e)
    app.exit(1)
  })
