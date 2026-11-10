import { View, type AccessibilityState } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { Switch } from './Switch'
import { Text } from './Text'
import { Touchable } from './Touchable'
import { Icon } from './icons/Icon'

const DESCRIBED_ROW_HEIGHT = 64

const useStyles = makeStyles((t) => ({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: t.space.s3,
    minHeight: t.size.rowH,
    paddingHorizontal: t.space.s5,
  },
  described: { minHeight: DESCRIBED_ROW_HEIGHT },
  labels: { flex: 1, gap: 2 },
}))

type Common = {
  label: string
  /** One line. If it needs two, it belongs on the detail screen. */
  description?: string
  onPress?: () => void
}

export type OptionRowProps = Common &
  (
    | { variant?: 'navigate' }
    | { variant: 'value'; value: string }
    | { variant: 'select'; selected: boolean }
    | { variant: 'switch'; checked: boolean; busy?: boolean }
    | { variant: 'destructive' }
  )

/** One row, one thing: a row with a switch never also carries a chevron. */
export function OptionRow(props: OptionRowProps) {
  const s = useStyles()
  const { label, description, onPress } = props
  const variant = props.variant ?? 'navigate'

  return (
    <Touchable
      accessibilityLabel={label}
      accessibilityRole={variant === 'switch' ? 'switch' : 'button'}
      accessibilityState={accessibilityState(props)}
      onPress={onPress}
      style={[s.row, description ? s.described : null]}
    >
      <View style={s.labels}>
        <Text variant="body" tone={variant === 'destructive' ? 'danger' : 'ink'}>
          {label}
        </Text>
        {description ? (
          <Text variant="caption" tone="inkMuted">
            {description}
          </Text>
        ) : null}
      </View>
      <OptionRowTrailing {...props} />
    </Touchable>
  )
}

function accessibilityState(props: OptionRowProps): AccessibilityState | undefined {
  switch (props.variant) {
    case 'switch':
      return { checked: props.checked, busy: props.busy }
    case 'select':
      return { selected: props.selected }
    default:
      return undefined
  }
}

function OptionRowTrailing(props: OptionRowProps) {
  switch (props.variant) {
    case 'value':
      return (
        <>
          <Text variant="body" tone="inkSoft">
            {props.value}
          </Text>
          <Icon name="chevronRight" size={theme.size.iconMd} tone="inkMuted" />
        </>
      )
    case 'select':
      return props.selected ? <Icon name="check" size={theme.size.iconMd} tone="accent" /> : null
    case 'switch':
      return <Switch busy={props.busy} value={props.checked} />
    case 'destructive':
      return null
    default:
      return <Icon name="chevronRight" size={theme.size.iconMd} tone="inkMuted" />
  }
}
