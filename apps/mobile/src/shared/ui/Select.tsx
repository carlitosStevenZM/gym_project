import { useState } from 'react'
import { ScrollView, View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { BottomSheet } from './BottomSheet'
import { Divider } from './Divider'
import { OptionRow } from './OptionRow'
import { Skeleton } from './Skeleton'
import { Text } from './Text'
import { Touchable } from './Touchable'
import { Icon } from './icons/Icon'

const CHEVRON = 12

const useStyles = makeStyles((t) => ({
  field: { gap: t.space.s2 },
  row: {
    alignItems: 'center',
    backgroundColor: t.color.inputBg,
    borderColor: t.color.inputLine,
    borderRadius: t.radius.md,
    borderWidth: t.border.hairline,
    flexDirection: 'row',
    gap: t.space.s3,
    height: t.size.inputH,
    paddingHorizontal: t.space.s4,
  },
  open: { borderColor: t.color.focus, borderWidth: t.border.focus },
  value: { flex: 1 },
  note: { paddingBottom: t.space.s3, paddingHorizontal: t.space.s5 },
}))

export type SelectOption<T extends string> = {
  value: T
  label: string
  description?: string
}

export type SelectProps<T extends string> = {
  label: string
  /** There is always a selected value. An empty list is an empty state, not a Select. */
  value: T
  options: readonly SelectOption<T>[]
  onChange: (value: T) => void
  sheetTitle: string
  closeLabel: string
  /** A line before the list for a consequence that is not visible, such as D3. */
  note?: string
  /** «Quitar la rutina de este día» (D30): a separate action at the end, in `danger`. */
  clear?: { label: string; onPress: () => void }
  loading?: boolean
  disabledReason?: string
}

/**
 * On mobile this never opens a floating menu: a menu asks for precision in the top half of
 * the screen, and a sheet puts 48 px rows where the thumb already is.
 */
export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  sheetTitle,
  closeLabel,
  note,
  clear,
  loading = false,
  disabledReason,
}: SelectProps<T>) {
  const s = useStyles()
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <View style={s.field}>
      <Text variant="label" tone="inkSoft">
        {label}
      </Text>
      <Touchable
        accessibilityLabel={`${label}, ${selected?.label ?? ''}`}
        accessibilityRole="button"
        disabled={disabledReason !== undefined}
        onPress={() => setOpen(true)}
        style={[s.row, open ? s.open : null]}
      >
        {loading ? (
          <Skeleton height={theme.text.bodyStrong.fontSize ?? theme.size.iconMd} width="60%" />
        ) : (
          <Text variant="bodyStrong" tone="ink" style={s.value}>
            {selected?.label}
          </Text>
        )}
        <Icon name="chevronDown" size={CHEVRON} tone="inkMuted" />
      </Touchable>

      {disabledReason ? (
        <Text variant="caption" tone="inkMuted">
          {disabledReason}
        </Text>
      ) : null}

      <BottomSheet
        closeLabel={closeLabel}
        height={options.length > 6 ? 'half' : 'content'}
        onClose={() => setOpen(false)}
        title={sheetTitle}
        visible={open}
      >
        {note ? (
          <Text variant="caption" tone="inkMuted" style={s.note}>
            {note}
          </Text>
        ) : null}
        <ScrollView>
          {options.map((option) => (
            <OptionRow
              description={option.description}
              key={option.value}
              label={option.label}
              onPress={() => {
                onChange(option.value)
                setOpen(false)
              }}
              selected={option.value === value}
              variant="select"
            />
          ))}
          {clear ? (
            <>
              <Divider />
              <OptionRow
                label={clear.label}
                onPress={() => {
                  clear.onPress()
                  setOpen(false)
                }}
                variant="destructive"
              />
            </>
          ) : null}
        </ScrollView>
      </BottomSheet>
    </View>
  )
}
