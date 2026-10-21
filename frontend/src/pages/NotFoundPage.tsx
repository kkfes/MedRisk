import { Link } from 'react-router-dom'
import { t } from '../i18n'

/** The page that is shown for an address that does not exist. */
export function NotFoundPage() {
  return (
    <>
      <h1>{t('generic.not_found_title')}</h1>
      <p>{t('generic.not_found_text')}</p>
      <p>
        <Link className="btn" to="/">
          {t('generic.back_home')}
        </Link>
      </p>
    </>
  )
}
