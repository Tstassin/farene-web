import dayjs from "dayjs";

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import fr from 'dayjs/locale/fr'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(localeData)

export const isoDateFormat = "YYYY-MM-DD"
export const belgianNow = () => {
  return dayjs().tz('Europe/Paris')
}

export const dayLabel = (day: string) => {
  return dayjs(day, isoDateFormat, true
    ).locale(fr).format('dddd DD MMMM YYYY')
}

export const today = dayjs().format(isoDateFormat)
