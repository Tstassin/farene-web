import { DeliveryOption } from "../../../../backend/src/client"
import { dayLabel, decimalTimeLabel } from "../../../../backend/src/utils/dates"

export const DeliveryOptionName = ({ deliveryOption }: { deliveryOption: DeliveryOption }) => {
  const dO = deliveryOption
  return (
    <>
      <b>{dayLabel(dO.day)}</b><br />
      <b>{dO.place.name}</b> <br />
      de {decimalTimeLabel(dO.from)} à {decimalTimeLabel(dO.to)} <br />
      <i>{dO.place.description}</i> <br />
      {dO.description}
    </>
  )
}