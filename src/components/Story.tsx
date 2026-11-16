import { useI18n } from '../i18n'
import { Icon } from './Icons'
import { REPO } from './Header'

// Dates and commit IDs come from the desktop repository, not website history.
const CHAPTERS = [
  { key: 'may', date: '2026-05', label: '2026.05', commits: [] },
  {
    key: 'july',
    date: '2026-07-22',
    label: '2026.07',
    commits: ['a351384', 'dc4e5c7', '7468355'],
  },
  { key: 'august', date: '2026-08-13', label: '2026.08', commits: ['d792eed'] },
  {
    key: 'september',
    date: '2026-09-27',
    label: '2026.09',
    commits: ['12b96e2', '0753975', 'cec9d41'],
  },
  {
    key: 'october',
    date: '2026-10-23',
    label: '2026.10',
    commits: ['ff8682a', '16f6fe7', '87583cd'],
  },
  {
    key: 'november',
    date: '2026-11-16',
    label: '2026.11',
    commits: ['7c16ae8', 'd2546e4'],
  },
] as const

export default function Story() {
  const { t } = useI18n()
  return (
    <section className="story-section" id="story" aria-labelledby="story-title">
      <div className="container story-layout">
        <div className="story-heading">
          <p className="eyebrow">{t('story.eyebrow')}</p>
          <h2 className="section-title" id="story-title">
            {t('story.title')}
          </h2>
          <p className="section-intro">{t('story.intro')}</p>
          <p className="story-origin">{t('story.origin')}</p>
          <a
            className="text-link"
            href={`${REPO}/commits/main/`}
            target="_blank"
            rel="noreferrer"
          >
            {t('story.log')}
            <Icon name="arrow-right" size={16} />
          </a>
        </div>
        <ol className="story-timeline">
          {CHAPTERS.map((chapter) => (
            <li className="story-chapter" key={chapter.key}>
              <span className="story-dot" aria-hidden="true" />
              <time className="mono" dateTime={chapter.date}>
                {chapter.label}
              </time>
              <h3>{t(`story.${chapter.key}Title`)}</h3>
              <p>{t(`story.${chapter.key}Body`)}</p>
              {chapter.commits.length ? (
                <details>
                  <summary>
                    {t('story.expand')}
                    <Icon name="plus" size={14} />
                  </summary>
                  <p>{t(`story.${chapter.key}Evidence`)}</p>
                  <div className="story-commits">
                    {chapter.commits.map((hash) => (
                      <a
                        className="mono"
                        key={hash}
                        href={`${REPO}/commit/${hash}`}
                        aria-label={`${t('story.source')} ${hash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {hash}
                        <Icon name="arrow-right" size={12} />
                      </a>
                    ))}
                  </div>
                </details>
              ) : (
                <small>{t('story.mayEvidence')}</small>
              )}
            </li>
          ))}
        </ol>
        <p className="story-closing">
          {t('story.closing')}
          <span aria-hidden="true"><Icon name="arrow-right" size={32} /></span>
        </p>
      </div>
    </section>
  )
}
