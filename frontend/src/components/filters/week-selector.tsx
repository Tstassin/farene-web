import { Select } from "@chakra-ui/react"
import { useState } from "react"
import { dayLabel } from "../../../../backend/src/utils/dates"
import { useOrderDates } from "../../queries/orders"

interface WeekSelectorProps {
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  value: string
}
export const WeekSelector = ({ onChange, value }: WeekSelectorProps) => {
  const orderDatesQuery = useOrderDates()

  return (
    <Select onChange={onChange} value={value}>
      {
        orderDatesQuery.data?.weeks && Object.keys(orderDatesQuery.data.weeks).map(
          (week) => {
            const weekDate =
              //@ts-expect-error, map function narrowed week to string
              orderDatesQuery.data?.weeks?.[week]
            const weekDateLabel = dayLabel(weekDate)
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