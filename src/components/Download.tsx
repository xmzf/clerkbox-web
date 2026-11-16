import { useI18n } from '../i18n'
import { PRODUCT_RELEASE, formatAssetSize, REPO_URL, type DownloadPlatform } from '../lib/releases'
import { GithubIcon, Icon } from './Icons'
import '../styles/download.css'

function PlatformMark({ name }: { name: 'windows' | 'mac' | 'linux' }) {
  if (name === 'windows') return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 4.5 10 3.4v8H2zm9.5-1.3L22 1.7v9.7H11.5zM2 12.8h8v8L2 19.7zm9.5 0H22v9.7l-10.5-1.4z" /></svg>
  return <Icon name={name === 'mac' ? 'harddrive' : 'terminal'} size={29} />
}

export default function Download() {
  const { t, lang } = useI18n()
  const release = PRODUCT_RELEASE
  const sourceBuildUrl = `${REPO_URL}/blob/main/${lang === 'zh' ? 'README.md#从源码构建' : 'README.en.md#build-from-source'}`
  const assetLink = (platform: DownloadPlatform, label: string) => {
    const asset = release.assets.find((item) => item.platform === platform)
    if (!asset) return null
    return <a className="download-asset" data-platform={platform} href={asset.url} aria-label={`${label} · ${release.tag} · ${t('download.official')}`}><span>{label}</span><span className="download-asset-meta">{formatAssetSize(asset.bytes)}<Icon name="download" size={17} /></span></a>
  }
  const platforms: Array<{ key: 'windows' | 'mac' | 'linux'; detail: string; links: Array<[DownloadPlatform, string]> }> = [
    { key: 'windows', detail: 'windowsDetail', links: [['windows', 'windowsDownload']] },
    { key: 'mac', detail: 'macDetail', links: [['mac-arm', 'macArmDownload'], ['mac-intel', 'macIntelDownload']] },
    { key: 'linux', detail: 'linuxDetail', links: [['linux', 'linuxDownload']] },
  ]
  return <section className="section download-section" id="download" aria-labelledby="download-title">
    <div className="container">
      <div className="download-heading"><div><span className="eyebrow">{t('download.eyebrow')}</span><h2 className="section-title" id="download-title">{t('download.title')}</h2><p className="section-intro">{t('download.intro')}</p></div><span className="download-product-version">ClerkBox <strong>4.0</strong></span></div>
      <div className="download-status download-status-ready" role="status">
        <div className="download-status-main"><span className="download-status-dot" aria-hidden="true" /><div><span>{t('download.current')}</span> <strong>{release.tag}</strong><p>{t('download.checked')}</p></div></div>
        <a href={release.url} target="_blank" rel="noreferrer">{t('download.viewRelease')}<Icon name="arrow-right" size={15} /></a>
      </div>
      <div className="download-platform-grid">
        {platforms.map((platform) => {
          return <article className="download-platform" key={platform.key}>
            <div className="download-platform-heading"><span className="download-platform-icon"><PlatformMark name={platform.key} /></span><div><h3>{t(`download.${platform.key}`)}</h3><p>{t(`download.${platform.detail}`)}</p></div></div>
            <div className="download-platform-actions">
              {platform.links.map(([key, label]) => <div key={key}>{assetLink(key, t(`download.${label}`))}</div>)}
            </div>
          </article>
        })}
      </div>
      <p className="download-requirement">{t('download.requirement')} <a href={`${REPO_URL}/releases`} target="_blank" rel="noreferrer">{t('download.releaseHistory')} <Icon name="arrow-right" size={13} /></a></p>
      <div className="download-more">
        <article className="download-source"><div><span className="eyebrow">{t('download.sourceLabel')}</span><h3>{t('download.sourceTitle')}</h3><p>{t('download.sourceBody')}</p></div><div className="download-source-links"><a className="button button-secondary" href={REPO_URL} target="_blank" rel="noreferrer"><GithubIcon size={18} />{t('download.sourceLink')}</a><a className="download-text-link" href={sourceBuildUrl} target="_blank" rel="noreferrer">{t('download.sourceBuild')}<Icon name="arrow-right" size={16} /></a></div></article>
        <article className="download-remote"><Icon name="globe" size={24} /><h3>{t('download.remoteLabel')}</h3><p>{t('download.remoteBody')}</p><a className="download-text-link" href={`${REPO_URL}/blob/main/${lang === 'zh' ? 'README.md#webui-远程访问' : 'README.en.md#webui-remote-access'}`} target="_blank" rel="noreferrer">{t('download.remoteLink')}<Icon name="arrow-right" size={16} /></a></article>
      </div>
    </div>
  </section>
}
