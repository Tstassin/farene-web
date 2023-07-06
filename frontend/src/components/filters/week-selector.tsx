import { Select } from "@chakra-ui/react"
import { useState } from "react"
import { dayLabel, getNextWeekStart, isoDate } from "../../../../backend/src/utils/dates"

interface WeekSelectorProps {
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  value: string
}
export const WeekSelector = ({ onChange, value }: WeekSelectorProps) => {
  const nextWeek = getNextWeekStart()
  const weeksISO = [
    isoDate(nextWeek.subtract(3, 'weeks')),
    isoDate(nextWeek.subtract(2, 'weeks')),
    isoDate(nextWeek.subtract(1, 'weeks')),
    isoDate(nextWeek),
  ]

  return (
    <Select onChange={onChange} value={value} defaultValue={isoDate(nextWeek)}>
      {
        weeksISO.map(
          (week) => {
            const weekDateLabel = dayLabel(week)
            return (
              <option value={week}>Semaine du {weekDateLabel}</option>
            )
          }
        )
      }
    </Select>

  )
}

export const useWeekSelector = () => {
  const [week, setWeek] = useState<'thisWeek' | 'previousWeek' | 'nextWeek'>('thisWeek')
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //@ts-expect-error, e.target.value is narrowed to a string
    setWeek(e.target.value)
  }
  return [week, onChange, setWeek] as const
}