import { t } from '../i18n'
import type { TranslationKey } from '../i18n'

/**
 * A screen that is reserved for a later task of the milestone.
 *
 * The routes exist from DIP-35 on, so that the navigation, the landmarks and the
 * accessibility of the application shell can be reviewed before the screens
 * themselves are implemented (DIP-36 … DIP-38).
 */
export function PlaceholderPage({ title, message }: { title: string; message: TranslationKey }) {
  return (
    <>
      <h1>{title}</h1>
      <p className="notice">
        <strong>{t('app.placeholder_badge')}:</strong> {t(message)}
      </p>
    </>
  )
}
