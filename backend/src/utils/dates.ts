import dayjs, { Dayjs } from "dayjs";

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import fr from 'dayjs/locale/fr'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(localeData)
dayjs.locale('fr')

export const isoDateFormat = "YYYY-MM-DD"
export const isoDate = (date: Dayjs) => dayjs(date).format(isoDateFormat)
export const belgianNow = () => {
  return dayjs().tz('Europe/Paris')
}

export const dayLabel = (day: string) => {
  return dayjs(day, isoDateFormat, true
    ).locale(fr).format('dddd DD MMMM YYYY')
}

export const today = dayjs().format(isoDateFormat)

export const getToday = () => {
  return dayjs()
}
export const getTodayIso = () => isoDate(getToday())
export const getTodayLabel = () => dayLabel(getTodayIso())
export const getNextWeekStart = () => {
  const nextWeekStart = dayjs().endOf('week').add(1, 'day')
  console.log(nextWeekStart)
  return nextWeekStart
}
export const getNextWeekEnd = () => {
  return dayjs().endOf('week').add(1, 'day').endOf('week')
}