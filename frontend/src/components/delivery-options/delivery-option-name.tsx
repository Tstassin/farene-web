import { DeliveryOption } from "../../../../backend/src/client"
import { dayLabel, decimalTimeLabel } from "../../../../backend/src/utils/dates"

export const DeliveryOptionName = ({ deliveryOption }: { deliveryOption: DeliveryOption }) => {
  const {day, place, from, to} = deliveryOption
  return (
    <>
      {dayLabel(deliveryOption.day)} <br />
      {place.name} <br />
      de {decimalTimeLabel(from)} à {decimalTimeLabel(to)}
    </>
  )
}