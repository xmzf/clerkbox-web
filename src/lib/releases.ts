export const PRODUCT_VERSION = '4.0.0'
export const REPO_URL = 'https://github.com/XMZF-vAI/clerkbox'
export const RELEASE_TAG = `v${PRODUCT_VERSION}`
export const RELEASES_URL = `${REPO_URL}/releases/tag/${RELEASE_TAG}`
export const RELEASE_API_URL = `https://api.github.com/repos/XMZF-vAI/clerkbox/releases/tags/${RELEASE_TAG}`

export type DownloadPlatform = 'windows' | 'mac-arm' | 'mac-intel' | 'linux'
export interface ReleaseAsset { platform: DownloadPlatform; name: string; url: string; bytes: number | null }
export interface PublicRelease { version: string; tag: string; url: string; assets: ReleaseAsset[] }

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
