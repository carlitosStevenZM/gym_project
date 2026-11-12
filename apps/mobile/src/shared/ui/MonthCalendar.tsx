import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'
import type { ColorToken } from '@/shared/theme/tokens.gen'

import { Text } from './Text'
import { Touchable } from './Touchable'
import { Icon } from './icons/Icon'

const CELL = 40
const DAYS_IN_WEEK = 7

const useStyles = makeStyles((t) => ({
  root: { gap: t.space.s3 },
  heading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: t.space.s2 },
  initial: { textAlign: 'center', width: CELL },
  cell: {
    alignItems: 'center',
    borderRadius: t.radius.circle,
    height: CELL,
    justifyContent: 'center',
    width: CELL,
  },
  trained: { backgroundColor: t.color.accent },
  today: { borderColor: t.color.accent, borderWidth: t.border.ring },
}))

export type CalendarDayState = 'trained' | 'untrained' | 'outside' | 'future'

const INK: Readonly<Record<CalendarDayState, ColorToken>> = {
  trained: 'accentInk',
  untrained: 'inkSoft',
  outside: 'inkDisabled',
  future: 'inkMuted',
}

export type CalendarDay = {
  key: string
  day: number
  state: CalendarDayState
  today?: boolean
  /** «miércoles 14 de octubre, pecho y tríceps, 52 minutos» */
  accessibilityLabel: string
  /** Only a trained day opens anything: rests are not recorded (D5). */
  onPress?: () => void
}

export type MonthCalendarProps = {
  monthLabel: string
  /** Monday first: the product's week starts with the weekly training. */
  weekdayInitials: readonly string[]
  days: readonly CalendarDay[]
  onPreviousMonth: () => void
  /** Absent on the current month: the calendar never runs ahead of today. */
  onNextMonth?: () => void
  previousLabel: string
  nextLabel: string
}

/** A reading view of the history (FR-7), not a date picker: nothing is scheduled ahead. */
export function MonthCalendar({
  monthLabel,
  weekdayInitials,
  days,
  onPreviousMonth,
  onNextMonth,
  previousLabel,
  nextLabel,
}: MonthCalendarProps) {
  const s = useStyles()

  return (
    <View style={s.root}>
      <View style={s.heading}>
        <Touchable
          accessibilityLabel={previousLabel}
          accessibilityRole="button"
          onPress={onPreviousMonth}
        >
          <Icon name="chevronLeft" size={theme.size.iconMd} tone="ink" />
        </Touchable>
        <Text accessibilityRole="header" variant="displayMd" tone="ink">
          {monthLabel}
        </Text>
        <Touchable
          accessibilityLabel={nextLabel}
          accessibilityRole="button"
          disabled={!onNextMonth}
          onPress={onNextMonth}
        >
          <Icon
            name="chevronRight"
            size={theme.size.iconMd}
            tone={onNextMonth ? 'ink' : 'inkDisabled'}
          />
        </Touchable>
      </View>

      <View style={s.week}>
        {weekdayInitials.slice(0, DAYS_IN_WEEK).map((initial, index) => (
          <Text key={`${initial}-${index}`} variant="label" tone="inkMuted" style={s.initial}>
            {initial}
          </Text>
        ))}
      </View>

      <View style={s.grid}>
        {days.map((day) => (
          <Touchable
            accessibilityLabel={day.accessibilityLabel}
            accessibilityRole={day.onPress ? 'button' : 'text'}
            disabled={!day.onPress}
            key={day.key}
            onPress={day.onPress}
            style={[s.cell, day.state === 'trained' ? s.trained : null, day.today ? s.today : null]}
          >
            <Text
              variant="numericSm"
              tone={day.today && day.state !== 'trained' ? 'ink' : INK[day.state]}
            >
              {day.day}
            </Text>
          </Touchable>
        ))}
      </View>
    </View>
  )
}
