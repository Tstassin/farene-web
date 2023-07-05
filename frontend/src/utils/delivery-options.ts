import { DeliveryOption } from "../../../backend/src/client";

export const getNiceName = (deliveryOption: DeliveryOption) => {
  return `${deliveryOption.place.name} ${deliveryOption.day} ${deliveryOption.from} ${deliveryOption.to}`
}