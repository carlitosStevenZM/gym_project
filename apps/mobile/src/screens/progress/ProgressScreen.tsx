import { useTranslation } from 'react-i18next'

import { Placeholder } from '@/shared/ui/Placeholder'

export function ProgressScreen() {
  const { t } = useTranslation()

  return <Placeholder title={t('tabs.progress')} />
}
