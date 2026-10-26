import { useI18n } from '../i18n'
import { JOULE, REPO } from './Header'

export default function Footer() {
  const { t } = useI18n()
  return (
    <footer className="footer">
      <div className="container footer-in">
        <span>{t('footer.rights')}</span>
        <nav className="footer-links">
          <a href={REPO} target="_blank" rel="noreferrer">
            {t('footer.repo')}
          </a>
          <a href={JOULE} target="_blank" rel="noreferrer">
            {t('footer.joule')}
          </a>
          <a href="https://github.com/XMZF-vAI" target="_blank" rel="noreferrer">
            {t('footer.studio')}
          </a>
        </nav>
      </div>
    </footer>
  )
}
