import { useTranslation } from 'react-i18next'

const DAYS_IN_WEEK = 7

/** ISO weekday: 1 is Monday and 7 is Sunday, which is the week the product plans in (D1). */
export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7

export const WEEK: readonly IsoWeekday[] = [1, 2, 3, 4, 5, 6, 7]

export function isoWeekdayOf(date: Date): IsoWeekday {
  const sundayFirst = date.getDay()
  return (sundayFirst === 0 ? DAYS_IN_WEEK : sundayFirst) as IsoWeekday
}

export type DateLabels = {
  /** «Miércoles 14 oct» */
  dayAndMonth: (date: Date) => string
  /** «L». Spanish uses X for miércoles so it does not collide with martes. */
  weekdayInitial: (weekday: IsoWeekday) => string
  /** «VIE» */
  weekdayShort: (weekday: IsoWeekday) => string
  /** «miércoles» */
  weekdayLong: (weekday: IsoWeekday) => string
}

/**
 * Day and month names come from the locale file rather than from `Intl`, because the
 * initials the product uses are a choice of ours: `Intl` narrows both martes and miércoles
 * to M, and a week strip with two Ms is unreadable.
 */
export function useDateLabels(): DateLabels {
  const { t } = useTranslation()

  return {
    dayAndMonth: (date) =>
      t('date.dayAndMonth', {
        weekday: t(`date.weekday.long.${isoWeekdayOf(date) - 1}`),
        day: date.getDate(),
        month: t(`date.month.short.${date.getMonth()}`),
      }),
    weekdayInitial: (weekday) => t(`date.weekday.initial.${weekday - 1}`),
    weekdayShort: (weekday) => t(`date.weekday.short.${weekday - 1}`),
    weekdayLong: (weekday) => t(`date.weekday.long.${weekday - 1}`).toLowerCase(),
  }
}
