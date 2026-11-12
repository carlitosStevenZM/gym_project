import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'

import { Text } from './Text'

const CELL = 30

const useStyles = makeStyles((t) => ({
  root: { gap: t.space.s2 },
  heading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  day: {
    alignItems: 'center',
    borderRadius: t.radius.circle,
    height: CELL,
    justifyContent: 'center',
    width: CELL,
  },
  trained: { backgroundColor: t.color.accent },
  planned: { backgroundColor: t.color.surfaceAlt },
  rest: { backgroundColor: t.color.surface },
  today: { borderColor: t.color.accent, borderWidth: t.border.ring },
}))

export type WeekDayState = 'trained' | 'planned' | 'rest'

export type WeekDay = {
  key: string
  /** The initial of the day, or a three letter routine abbreviation. */
  initial: string
  state: WeekDayState
  /** Today and trained are not exclusive: a day can be both, and then it is filled and ringed. */
  today?: boolean
  /** «miércoles, hoy, pecho y tríceps» */
  accessibilityLabel: string
}

export type WeekStripProps = {
  /** «ESTA SEMANA» */
  label: string
  /** «2 de 4». Always present, so the information never depends on telling circles apart. */
  counter: string
  days: readonly WeekDay[]
}

const INK = { trained: 'accentInk', planned: 'inkMuted', rest: 'inkDisabled' } as const

export function WeekStrip({ label, counter, days }: WeekStripProps) {
  const s = useStyles()

  return (
    <View accessibilityLabel={`${label}, ${counter}`} accessibilityRole="summary" style={s.root}>
      <View style={s.heading}>
        <Text variant="label" tone="inkMuted">
          {label}
        </Text>
        <Text variant="caption" tone="inkSoft">
          {counter}
        </Text>
      </View>
      <View style={s.week}>
        {days.map((day) => (
          <View
            accessibilityLabel={day.accessibilityLabel}
            key={day.key}
            style={[s.day, s[day.state], day.today ? s.today : null]}
          >
            <Text
              variant="numericSm"
              tone={day.today && day.state !== 'trained' ? 'ink' : INK[day.state]}
            >
              {day.initial}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
