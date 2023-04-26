import dayjs from "dayjs";

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

export const isoDateFormat = "YYYY-MM-DD"
export const belgianNow = () => {
  return dayjs().tz('Europe/Paris')
}