import { useI18n } from '../i18n'
import { Icon } from './Icons'
import { REPO, RELEASES } from './Header'
export default function Footer() {
  const { t } = useI18n()
  return <footer className="site-footer"><div className="container"><div className="footer-top"><h2>{t('footer.line')}</h2><a className="footer-back" href="#top">{t('footer.back')}<Icon name="arrow-up" size={23} /></a></div><nav className="footer-links" aria-label={t('footer.nav')}><a href="#workspace">{t('footer.product')}</a><a href={REPO} target="_blank" rel="noreferrer">{t('footer.source')}</a><a href={`${REPO}#readme`} target="_blank" rel="noreferrer">{t('footer.docs')}</a><a href={RELEASES} target="_blank" rel="noreferrer">{t('footer.releases')}</a><a href={`${REPO}/issues`} target="_blank" rel="noreferrer">{t('footer.issues')}</a></nav><div className="footer-wordmark" aria-hidden="true">ClerkBox<span>.</span></div><div className="footer-bottom"><span>{t('footer.copyright')}</span><a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">{t('footer.license')}</a><span>{t('footer.note')}</span></div></div></footer>
}
