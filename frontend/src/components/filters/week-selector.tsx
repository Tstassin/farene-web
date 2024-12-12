import { Select } from "@chakra-ui/react"
import { useState } from "react"
import { dayLabel, getNextWeekStart, isoDate } from "../../../../backend/src/utils/dates"

interface WeekSelectorProps {
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  value: string
  weeksISO: string[]
}
export const WeekSelector = ({ onChange, value, weeksISO }: WeekSelectorProps) => {
  

  return (
    <Select onChange={onChange} value={value} defaultValue={value}>
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
  const nextWeek = getNextWeekStart()
  const weeksISO = [
    isoDate(nextWeek.subtract(8, 'weeks')),
    isoDate(nextWeek.subtract(7, 'weeks')),
    isoDate(nextWeek.subtract(6, 'weeks')),
    isoDate(nextWeek.subtract(5, 'weeks')),
    isoDate(nextWeek.subtract(4, 'weeks')),
    isoDate(nextWeek.subtract(3, 'weeks')),
    isoDate(nextWeek.subtract(2, 'weeks')),
    isoDate(nextWeek.subtract(1, 'week')),
    isoDate(nextWeek),
    isoDate(nextWeek.add(1, 'week')),
    isoDate(nextWeek.add(2, 'weeks')),
    isoDate(nextWeek.add(3, 'weeks')),
    isoDate(nextWeek.add(4, 'weeks')),
    isoDate(nextWeek.add(5, 'weeks')),
  ]
  const [week, setWeek] = useState(isoDate(nextWeek))
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWeek(e.target.value)
  }
  return {week, onChange, setWeek, weeksISO} as const
}