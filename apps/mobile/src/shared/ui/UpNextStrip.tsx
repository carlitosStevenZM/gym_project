import { Fragment } from 'react'
import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'

import { Divider } from './Divider'
import { RingBadge } from './RingBadge'
import { Text } from './Text'

const DAY_COLUMN = 32

const useStyles = makeStyles((t) => ({
  root: {
    borderTopColor: t.color.lineSoft,
    borderTopWidth: t.border.hairline,
    marginBottom: t.space.s10,
    paddingTop: t.space.s3,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: t.space.s3,
    paddingVertical: t.space.s3,
  },
  day: { textAlign: 'center', width: DAY_COLUMN },
  labels: { flex: 1, gap: 2 },
}))

export type UpNextItem = {
  key: string
  /** «VIE». Absent in the record variant, which has no day. */
  dayAbbr?: string
  /** «LO QUE VIENE» */
  label: string
  title: string
  /** «6 ejercicios». Replaced by the badge when one is given. */
  detail?: string
  badge?: { value: number; unit: string }
}

export type UpNextStripProps = {
  /** One item normally; two when the next day is a rest day and the one after is not. */
  items: readonly UpNextItem[]
  accessibilityLabel: string
}

/**
 * Closes the Hoy screen so the list does not die in black over the tab bar. It sits at the
 * end of the content and is never pinned to the bottom edge: a pinned strip rides over the
 * last row of the list.
 */
export function UpNextStrip({ items, accessibilityLabel }: UpNextStripProps) {
  const s = useStyles()

  return (
    <View accessibilityLabel={accessibilityLabel} accessibilityRole="summary" style={s.root}>
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {index > 0 ? <Divider /> : null}
          <View style={s.item}>
            {item.dayAbbr ? (
              <Text variant="numericSm" tone="inkMuted" style={s.day}>
                {item.dayAbbr}
              </Text>
            ) : null}
            <View style={s.labels}>
              <Text variant="label" tone="inkMuted">
                {item.label}
              </Text>
              <Text variant="bodyStrong" tone="ink">
                {item.title}
              </Text>
            </View>
            {item.badge ? (
              <RingBadge
                size={56}
                unit={item.badge.unit}
                value={item.badge.value}
                variant="solid"
              />
            ) : item.detail ? (
              <Text variant="caption" tone="inkMuted">
                {item.detail}
              </Text>
            ) : null}
          </View>
        </Fragment>
      ))}
    </View>
  )
}
