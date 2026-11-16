import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

// Execute the actual parser without adding a test framework or building output.
const module = { exports: {} }
const code = ts.transpileModule(fs.readFileSync(new URL('../src/lib/releases.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
vm.runInNewContext(code, { exports: module.exports, module, URL, fetch, AbortController, setTimeout, clearTimeout })
const { PRODUCT_RELEASE, parsePublicRelease, formatAssetSize, fetchProductRelease, RELEASE_API_URL, RELEASES_URL } = module.exports
const repo = 'https://github.com/XMZF-vAI/clerkbox'
const asset = (name, url = `${repo}/releases/download/v4.0.0/${name}`) => ({ name, browser_download_url: url, size: 1024 * 1024 })
const base = { tag_name: 'v4.0.0', draft: false, prerelease: false, assets: [
  asset('ClerkBox-Setup-4.0.0.exe'), asset('ClerkBox-4.0.0-arm64.dmg'), asset('ClerkBox-4.0.0.dmg'), asset('ClerkBox-4.0.0.AppImage'),
] }
const valid = parsePublicRelease(base)
assert.equal(PRODUCT_RELEASE.version, '4.0.0')
assert.equal(PRODUCT_RELEASE.url, `${repo}/releases/tag/v4.0.0`)
assert.deepEqual(Array.from(PRODUCT_RELEASE.assets, item => item.url), base.assets.map(item => item.browser_download_url))
assert.equal(PRODUCT_RELEASE.assets.length, 4)
assert.ok(PRODUCT_RELEASE.assets.every(item => item.bytes > 0))
const downloadComponent = fs.readFileSync(new URL('../src/components/Download.tsx', import.meta.url), 'utf8')
assert.ok(downloadComponent.includes('const release = PRODUCT_RELEASE'))
assert.equal(/fetchProductRelease|useEffect|status: 'loading'/.test(downloadComponent), false, 'Rendering downloads must never wait for the GitHub API')
assert.equal(RELEASE_API_URL, 'https://api.github.com/repos/XMZF-vAI/clerkbox/releases/tags/v4.0.0')
assert.equal(RELEASES_URL, `${repo}/releases/tag/v4.0.0`)
assert.equal(valid.version, '4.0.0')
assert.equal(valid.assets.length, 4)
assert.equal(new Set(valid.assets.map(a => a.platform)).size, 4)
assert.equal(valid.url, `${repo}/releases/tag/v4.0.0`)
for (const bad of [null, {}, { ...base, draft: true }, { ...base, prerelease: true }, { ...base, tag_name: 'v4.0.0-beta.1' }, { ...base, tag_name: 'v3.5.1' }, { ...base, tag_name: 'v4.1.0' }, { ...base, assets: null }]) assert.throws(() => parsePublicRelease(bad))
const badUrls = [
  'http://github.com/XMZF-vAI/clerkbox/releases/download/v4.0.0/ClerkBox-Setup-4.0.0.exe',
  'https://evil.test/ClerkBox-Setup-4.0.0.exe',
  'https://github.com/another/repo/releases/download/v4.0.0/ClerkBox-Setup-4.0.0.exe',
  `${repo}/releases/download/v3.5.1/ClerkBox-Setup-4.0.0.exe`,
  `${repo}/releases/download/v4.0.0/ClerkBox-Setup-4.0.0.exe?redirect=elsewhere`,
  `${repo}/releases/download/v4.0.0/%XX`,
]
for (const url of badUrls) assert.equal(parsePublicRelease({ ...base, assets: [asset('ClerkBox-Setup-4.0.0.exe', url)] }).assets.length, 0)
assert.equal(parsePublicRelease({ ...base, assets: [asset('ClerkBox-Setup-3.5.1.exe')] }).assets.length, 0)
assert.equal(parsePublicRelease({ ...base, assets: [base.assets[0], base.assets[0]] }).assets.length, 1)
assert.equal(parsePublicRelease({ ...base, assets: [] }).assets.length, 0)
assert.equal(formatAssetSize(null), null)
assert.equal(formatAssetSize(1024 * 1024 + 1), '2 MB')
const controller = new AbortController()
controller.abort()
await assert.rejects(fetchProductRelease(controller.signal))
console.log('Release parsing: pinned 4.0, rejects other versions, four platforms, unsafe URLs, stale assets, duplicates, empty assets, sizes and cancellation passed.')
