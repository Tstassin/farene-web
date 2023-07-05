import { DeliveryOption } from "../../../../backend/src/client"

export const DeliveryOptionName = ({deliveryOption}: {deliveryOption: DeliveryOption}) => {
  return <>{`${deliveryOption.place.name} ${deliveryOption.day} ${deliveryOption.from} ${deliveryOption.to}`}</>
}