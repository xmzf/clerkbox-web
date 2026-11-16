// Electron is used only by this measurement harness, never by the website.
const { spawnSync } = require('node:child_process')
const { createRequire } = require('node:module')
const path = require('node:path')
const desktopPackage = process.env.CLERKBOX_DESKTOP_PACKAGE || 'D:/ClerkBox - 副本/package.json'
const executable = createRequire(path.resolve(desktopPackage))('electron')
const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE
env.CLERKBOX_PERF_ARGS = JSON.stringify(process.argv.slice(2))
const result = spawnSync(executable, [path.join(__dirname, 'measure.cjs')], {
  env, windowsHide: true, timeout: 300000, encoding: 'utf8',
})
process.stdout.write(result.stdout || '')
process.stderr.write(result.stderr || '')
if (result.error) process.stderr.write(`${result.error}\n`)
process.exit(result.status ?? 1)
