import { useI18n } from '../i18n'
import { Icon } from './Icons'
export default function Vibe({ onExplore }: { onExplore: () => void }) {
  const { t, lang } = useI18n()
  return (
    <section className="vibe-section" id="vibe" aria-labelledby="vibe-title">
      <div className="container">
        <div className="vibe-heading">
          <p className="eyebrow">{t('vibe.eyebrow')}</p>
          <span className="mono">SAME WORKSPACE. A DIFFERENT FEEL.</span>
        </div>
        <div className="vibe-layout">
          <div className="vibe-copy">
            <h2 className="section-title" id="vibe-title">
              {t('vibe.title')}
            </h2>
            <p>{t('vibe.desc')}</p>
            <button
              type="button"
              className="button button-light"
              onClick={onExplore}
            >
              {t('vibe.cta')}
              <Icon name="arrow-right" size={18} />
            </button>
          </div>
          <ul className="vibe-principles">
            {[1, 2, 3].map((n) => (
              <li key={n}>
                <span className="mono">0{n}</span>
                <span>{t(`vibe.item${n}`)}</span>
              </li>
            ))}
          </ul>
        </div>
        <figure className="vibe-capture">
          <img
            src={`/product/vibe-${lang}.webp?model=deepseek-v4-1-flash`}
            alt={t('vibe.illustration')}
            width="1400"
            height="900"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            <span className="mono">CLERKBOX 4.1.1 / VIBE</span>
            <span>{t('vibe.note')}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
