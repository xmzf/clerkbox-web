export const PRODUCT_VERSION = '4.1.1'
export const REPO_URL = 'https://github.com/XMZF-vAI/clerkbox'
export const RELEASE_TAG = `v${PRODUCT_VERSION}`
export const RELEASES_URL = `${REPO_URL}/releases/tag/${RELEASE_TAG}`
export const RELEASE_API_URL = `https://api.github.com/repos/XMZF-vAI/clerkbox/releases/tags/${RELEASE_TAG}`

export type DownloadPlatform = 'windows' | 'mac-arm' | 'mac-intel' | 'linux'
export interface ReleaseAsset { platform: DownloadPlatform; name: string; url: string; bytes: number | null }
export interface PublicRelease { version: string; tag: string; url: string; assets: ReleaseAsset[] }

/** Only list verified, publicly released assets here, with their real byte counts.
 * An empty list keeps the planned release visible without claiming downloads exist.
 * Downloads never depend on a visitor's GitHub API access or rate limit.
 */
export const PRODUCT_RELEASE: PublicRelease = {
  version: PRODUCT_VERSION,
  tag: RELEASE_TAG,
  url: RELEASES_URL,
  assets: [
    { platform: 'windows', name: 'ClerkBox-Setup-4.1.1.exe', url: `${REPO_URL}/releases/download/${RELEASE_TAG}/ClerkBox-Setup-4.1.1.exe`, bytes: 216009410 },
    { platform: 'mac-arm', name: 'ClerkBox-4.1.1-arm64.dmg', url: `${REPO_URL}/releases/download/${RELEASE_TAG}/ClerkBox-4.1.1-arm64.dmg`, bytes: 265045703 },
    { platform: 'mac-intel', name: 'ClerkBox-4.1.1.dmg', url: `${REPO_URL}/releases/download/${RELEASE_TAG}/ClerkBox-4.1.1.dmg`, bytes: 268641292 },
    { platform: 'linux', name: 'ClerkBox-4.1.1.AppImage', url: `${REPO_URL}/releases/download/${RELEASE_TAG}/ClerkBox-4.1.1.AppImage`, bytes: 277695487 },
  ],
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/** Only expose official assets whose version, architecture and URL all agree. */
export function parsePublicRelease(value: unknown): PublicRelease {
  if (!record(value) || value.draft !== false || value.prerelease !== false || typeof value.tag_name !== 'string') throw new Error('Invalid stable release')
  const match = /^v?(\d+\.\d+\.\d+)$/.exec(value.tag_name)
  if (!match || !Array.isArray(value.assets)) throw new Error('Invalid release version or assets')
  const version = match[1]
  if (version !== PRODUCT_VERSION) throw new Error('Unexpected product release')
  const tag = value.tag_name
  const names: Record<string, DownloadPlatform> = {
    [`ClerkBox-Setup-${version}.exe`]: 'windows',
    [`ClerkBox-${version}-arm64.dmg`]: 'mac-arm',
    [`ClerkBox-${version}.dmg`]: 'mac-intel',
    [`ClerkBox-${version}.AppImage`]: 'linux',
  }
  const assets: ReleaseAsset[] = []
  const seen = new Set<DownloadPlatform>()
  for (const asset of value.assets) {
    if (!record(asset) || typeof asset.name !== 'string' || typeof asset.browser_download_url !== 'string') continue
    const platform = names[asset.name]
    if (!platform || seen.has(platform)) continue
    let url: URL
    try { url = new URL(asset.browser_download_url) } catch { continue }
    const expectedPath = `/XMZF-vAI/clerkbox/releases/download/${tag}/${asset.name}`
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.username || url.password || url.port || url.search || url.hash) continue
    try { if (decodeURIComponent(url.pathname).replace(/^\/xmzf-vai\/clerkbox\//i, '/XMZF-vAI/clerkbox/') !== expectedPath) continue } catch { continue }
    seen.add(platform)
    assets.push({ platform, name: asset.name, url: url.href, bytes: typeof asset.size === 'number' && Number.isFinite(asset.size) && asset.size > 0 ? asset.size : null })
  }
  return { version, tag, url: `${REPO_URL}/releases/tag/${encodeURIComponent(tag)}`, assets }
}

/** Only request this product version; an unpublished release never falls back. */
export async function fetchProductRelease(signal: AbortSignal): Promise<PublicRelease | null> {
  const response = await fetch(RELEASE_API_URL, { headers: { Accept: 'application/vnd.github+json' }, signal, credentials: 'omit' })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Release request failed (${response.status})`)
  return parsePublicRelease(await response.json())
}

export function formatAssetSize(bytes: number | null): string | null {
  return bytes === null ? null : `${Math.ceil(bytes / (1024 * 1024))} MB`
}
