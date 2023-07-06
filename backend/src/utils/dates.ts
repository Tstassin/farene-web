import dayjs, { Dayjs } from "dayjs";

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import fr from 'dayjs/locale/fr'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(localeData)
dayjs.locale('fr')

export const isoDateFormat = "YYYY-MM-DD"
export const isoDate = (date: Dayjs) => dayjs(date).format(isoDateFormat)

export const dayLabel = (day: string) => {
  return dayjs(day, isoDateFormat, true
    ).locale(fr).format('dddd DD MMMM YYYY')
  }
  export const decimalTimeLabel = (decimalTime: number) => {
    const hours = Math.trunc(decimalTime)
    const minutes = (decimalTime - hours) * 60
    return dayjs().hour(hours).minute(minutes).format('HH[h]mm')
  }
  
  export const getToday = () => {
    return dayjs()
  }
  export const belgianNow = () => {
    return getToday().tz('Europe/Paris')
  }

export const today = getToday().format(isoDateFormat)

export const getTodayIso = () => isoDate(getToday())
export const getTodayLabel = () => dayLabel(getTodayIso())
export const getWeekStart = (weekDay = getToday()) => {
  const weekStart = weekDay.startOf('week')
  return weekStart
}
export const getWeekEnd = (weekDay = getToday()) => {
  const weekEnd = weekDay.endOf('week')
  return weekEnd
}
export const getNextWeekStart = () => {
  const nextWeekStart = getToday().endOf('week').add(1, 'day')
  console.log(nextWeekStart)
  return nextWeekStart
}
export const getNextWeekEnd = () => {
  return getToday().endOf('week').add(1, 'day').endOf('week')
}