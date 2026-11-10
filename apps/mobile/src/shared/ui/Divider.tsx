import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'

const useStyles = makeStyles((t) => ({
  line: { height: t.border.hairline, backgroundColor: t.color.lineSoft },
}))

/**
 * Only between repeated rows of the same kind. Between blocks the system separates with
 * space, not with a rule.
 */
export function Divider() {
  const s = useStyles()

  return <View style={s.line} />
}
