import { useTranslation } from 'react-i18next'

import { Placeholder } from '@/shared/ui/Placeholder'

export function TodayScreen() {
  const { t } = useTranslation()

  return <Placeholder note={t('placeholder.note')} title={t('tabs.today')} />
}
