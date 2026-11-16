const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
process.on('uncaughtException', error => { console.error(error.stack || error); process.exit(1) })
const { app, BrowserWindow } = require('electron')
const inputArgs = JSON.parse(process.env.CLERKBOX_PERF_ARGS || '[]')
const args = Object.fromEntries(inputArgs.reduce((pairs, value, i, all) => value.startsWith('--') ? [...pairs, [value.slice(2), all[i + 1]]] : pairs, []))
const urls = { A: args.url || 'http://127.0.0.1:5182/' }
if (args['url-b']) urls.B = args['url-b']
const count = Number(args.runs || 10)
if (count < 10) throw new Error('At least 10 cold-cache runs are required')
const cpu = Number(args.cpu || 1)
const out = path.resolve(args.out || path.join(__dirname, 'baseline.json'))
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'clerkbox-perf-profile-'))
app.setPath('userData', profile)
app.commandLine.appendSwitch('force-device-scale-factor', '1')
app.on('window-all-closed', () => {})
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const readyExpression = "(() => { const el = document.querySelector('#workspace textarea'), demo = document.querySelector('.product-demo[data-scenario]'); return !!el && el.getBoundingClientRect().width > 0 && !el.disabled && !el.readOnly && !!demo && demo.dataset.ready !== 'false' && [...demo.querySelectorAll('img')].filter(img => img.getBoundingClientRect().width > 0).every(img => img.complete && img.naturalWidth > 0); })()"
const init = `(() => {
  window.__flash = { ready: null, lcp: null, longtask: 0 };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__flash.lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__flash.longtask += e.duration }).observe({ type: 'longtask', buffered: true }); } catch {}
  const tick = () => { if (${readyExpression}) window.__flash.ready = performance.now(); else requestAnimationFrame(tick) }; requestAnimationFrame(tick);
})()`
const percentile = (values, p) => {
  const sorted = values.filter(value => value != null).sort((a, b) => a - b)
  if (!sorted.length) return null
  const index = (sorted.length - 1) * p
  return Math.round((sorted[Math.floor(index)] + (sorted[Math.ceil(index)] - sorted[Math.floor(index)]) * (index % 1)) * 10) / 10
}
async function until(win, expression, timeout = 20000) {
  const end = Date.now() + timeout
  while (Date.now() < end) {
    if (await win.webContents.executeJavaScript(expression)) return
    await delay(15)
  }
  throw new Error(`Timed out: ${expression}`)
}
async function measure(url, index, version) {
  const win = new BrowserWindow({ width: 1440, height: 900, show: false, webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false, backgroundThrottling: false, offscreen: true, partition: `perf-${version}-${index}-${Date.now()}` } })
  win.setContentSize(1440, 900)
  const wc = win.webContents
  wc.setFrameRate(60)
  const run = source => wc.executeJavaScript(source, true)
  const row = { url, ok: false }
  try {
    await win.loadURL('about:blank')
    wc.debugger.attach('1.3')
    await wc.debugger.sendCommand('Network.enable')
    await wc.debugger.sendCommand('Network.setCacheDisabled', { cacheDisabled: true })
    // Release availability is separately smoke-tested. Exclude this noncritical remote dependency from lab variance.
    await wc.debugger.sendCommand('Network.setBlockedURLs', { urls: ['https://api.github.com/*'] })
    await wc.debugger.sendCommand('Network.emulateNetworkConditions', { offline: false, latency: 20, downloadThroughput: 4 * 1024 * 1024 / 8, uploadThroughput: 3 * 1024 * 1024 / 8 })
    if (cpu > 1) await wc.debugger.sendCommand('Emulation.setCPUThrottlingRate', { rate: cpu })
    await wc.debugger.sendCommand('Page.enable')
    await wc.debugger.sendCommand('Page.addScriptToEvaluateOnNewDocument', { source: init })
    const navigation = win.loadURL(url)
    await until(win, 'window.__flash?.ready !== null && window.__flash?.ready !== undefined')
    // Use an actual Chromium key event; setting .value would not verify React's input handling.
    await run("document.querySelector('#workspace textarea').scrollIntoView({block:'center',behavior:'instant'}); document.querySelector('#workspace textarea').focus()")
    await run('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
    wc.sendInputEvent({ type: 'char', keyCode: 'Z' })
    await delay(32)
    row.type_check = await run("(() => { const valid = document.querySelector('#workspace textarea').value.includes('Z'); if (valid) window.__flash.inputReady = performance.now(); return valid })()")
    if (!row.type_check) throw new Error('Trusted key input did not persist')
    Object.assign(row, await run(`(() => { const nav = performance.getEntriesByType('navigation')[0], resources = performance.getEntriesByType('resource').filter(r => !r.name.includes('api.github.com')); return { navigation_requests: resources.length + 1, navigation_bytes: (nav?.encodedBodySize || 0) + resources.reduce((sum, r) => sum + r.encodedBodySize, 0), navigation_resources: resources.map(r => ({name:r.name.replace(location.origin,''),bytes:r.encodedBodySize,responseEnd:Math.round(r.responseEnd)})) } })()`))
    row.switches = {}
    for (const mode of ['vibe', 'work', 'recall']) {
      const result = await run(`new Promise(resolve => {
        const buttons = [...document.querySelectorAll('.product-demo [role="tab"]')];
        const target = buttons.find(el => el.id.endsWith('-tab-${mode}') || el.getAttribute('data-scenario-tab') === '${mode}');
        if (!target) { resolve(null); return; }
        const start = performance.now(); target.click();
        const frame = () => { const demo = document.querySelector('.product-demo'); const imagesReady = [...demo.querySelectorAll('img')].filter(img => img.getBoundingClientRect().width > 0).every(img => img.complete && img.naturalWidth > 0); if (demo.dataset.scenario === '${mode}' && demo.dataset.ready !== 'false' && imagesReady) requestAnimationFrame(() => resolve(performance.now() - start)); else if (performance.now() - start > 10000) resolve(null); else requestAnimationFrame(frame) }; requestAnimationFrame(frame);
      })`)
      row.switches[mode] = result
    }
    await navigation
    await delay(300)
    row.draft_persists = await run("document.querySelector('#workspace textarea').value.includes('Z')")
    if (!row.draft_persists) throw new Error('Scenario switching discarded the typed draft')
    Object.assign(row, await run(`(() => {
      const f = window.__flash, nav = performance.getEntriesByType('navigation')[0], resources = performance.getEntriesByType('resource');
      const byType = {}; for (const r of resources) { const type = /\\.js(?:$|\\?)/.test(r.name) ? 'js' : /\\.css(?:$|\\?)/.test(r.name) ? 'css' : /\\.(png|jpe?g|svg|webp)(?:$|\\?)/.test(r.name) ? 'image' : /\\.(woff2?|ttf)(?:$|\\?)/.test(r.name) ? 'font' : 'other'; byType[type] = (byType[type] || 0) + r.encodedBodySize; }
      return { ready: f.inputReady, dom_ready: f.ready, lcp: f.lcp, longtask: f.longtask, fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null, viewport: [innerWidth, innerHeight], requests: resources.filter(r => !r.name.includes('api.github.com')).length + 1, bytes_total: (nav?.encodedBodySize || 0) + resources.reduce((sum, r) => sum + r.encodedBodySize, 0), bytes_by_type: byType, resources: resources.filter(r => !r.name.includes('api.github.com')).map(r => ({ name: r.name.replace(location.origin, ''), type: r.initiatorType, bytes: r.encodedBodySize, responseEnd: Math.round(r.responseEnd) })).sort((a,b) => b.responseEnd - a.responseEnd), overflow: document.documentElement.scrollWidth > innerWidth, rawKeys: /(?:demo|hero|nav|desktop|sidebar|titlebar|interfaceMode)\\.[a-zA-Z]+/.test(document.body.innerText) };
    })()`))
    if (row.overflow || row.rawKeys) throw new Error('Layout or i18n guard failed')
    if (row.viewport[0] !== 1440 || row.viewport[1] !== 900) throw new Error('Unexpected content viewport')
    if (Object.values(row.switches).some(value => value === null)) throw new Error('Scenario selector contract missing')
    row.ok = true
  } catch (error) { row.error = String(error) }
  finally { if (wc.debugger.isAttached()) wc.debugger.detach(); win.destroy() }
  return row
}
function summarize(rows) {
  const good = rows.filter(row => row.ok)
  const summary = { n: rows.length, n_ok: good.length }
  for (const metric of ['ready', 'dom_ready', 'lcp', 'fcp', 'longtask', 'navigation_requests', 'navigation_bytes', 'requests', 'bytes_total']) {
    const values = good.map(row => row[metric]); summary[metric] = { valid_n: values.filter(value => value != null).length, p50: percentile(values, .5), p75: percentile(values, .75), p95: percentile(values, .95) }
  }
  for (const mode of ['vibe', 'work', 'recall']) {
    const values = good.map(row => row.switches?.[mode]); summary[`switch_${mode}`] = { valid_n: values.filter(value => value != null).length, p50: percentile(values, .5), p75: percentile(values, .75), p95: percentile(values, .95) }
  }
  return summary
}
app.whenReady().then(async () => {
  const started = new Date().toISOString(), runs = Object.fromEntries(Object.keys(urls).map(version => [version, []]))
  for (let index = 0; index < count; index++) {
    for (const version of Object.keys(urls)) {
      const row = await measure(urls[version], index, version)
      runs[version].push(row)
      console.log(`${version} ${index + 1}/${count} ready=${Math.round(row.ready || 0)}ms ok=${row.ok}${row.error ? ` ${row.error}` : ''}`)
    }
  }
  const report = { started, finished: new Date().toISOString(), paired: !!urls.B, config: { runs: count, profile: 'Fast4G:20ms/4Mbps/3Mbps', cpu, viewport: '1440x900@1', cache: 'new in-memory Electron session + disabled cache', ready: readyExpression, type_check: 'trusted Chromium char event Z persists in textarea', excluded: 'noncritical GitHub releases API blocked for deterministic lab data' }, results: Object.fromEntries(Object.entries(urls).map(([version, url]) => [version, { url, summary: summarize(runs[version]), runs: runs[version] }])) }
  if (urls.B) report.ready_p75_reduction = 1 - report.results.B.summary.ready.p75 / report.results.A.summary.ready.p75
  fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify(Object.fromEntries(Object.entries(report.results).map(([key, value]) => [key, value.summary])), null, 2))
  app.exit(Object.values(report.results).every(result => result.summary.n_ok === count) ? 0 : 1)
}).catch(error => { console.error(error); app.exit(1) })
