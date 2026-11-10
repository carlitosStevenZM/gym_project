import { NativeTabs } from 'expo-router/native-tabs'
import { useTranslation } from 'react-i18next'

import { color } from '@/shared/ui/tokens'

const TABS = [
  { name: 'index', label: 'tabs.today', sf: 'calendar', md: 'calendar_today' },
  { name: 'routines', label: 'tabs.routines', sf: 'list.bullet', md: 'list' },
  { name: 'history', label: 'tabs.history', sf: 'clock.arrow.circlepath', md: 'history' },
  { name: 'progress', label: 'tabs.progress', sf: 'chart.line.uptrend.xyaxis', md: 'trending_up' },
  { name: 'settings', label: 'tabs.settings', sf: 'gearshape', md: 'settings' },
] as const

export default function TabsLayout() {
  const { t } = useTranslation()

  return (
    <NativeTabs backgroundColor={color.surface} labelStyle={{ selected: { color: color.accent } }}>
      {TABS.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <NativeTabs.Trigger.Label>{t(tab.label)}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={tab.sf} md={tab.md} />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  )
}
