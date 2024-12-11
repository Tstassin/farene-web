import dayjs from "dayjs";
import { app } from "../../../src/app";
import { DeliveryOptionData, Place } from "../../../src/client";
import { FormType } from "../../../src/services/delivery-options/delivery-options.schema";
import { isoDateFormat, today } from "../../../src/utils/dates";
import { getPlaceMock } from "../places/places.mocks";

const in7Days = dayjs(today, 'YYYY-MM-DD', true).add(7, 'days').format(isoDateFormat)
export const deliveryOptionBaseMock: Omit<DeliveryOptionData, 'placeId'> = { day: in7Days, from: 9, to: 17, description: 'test', type: FormType.standard }

export const getDeliveryOptionMock = async (place?: Place, data?: Partial<DeliveryOptionData>) => {
  let placeId
  if (place === undefined) {
    const {id} = await app.service('places').create(getPlaceMock())
    placeId = id
  } else {
    placeId = place['id']
  }
  const deliveryOptionMock: DeliveryOptionData = {
    ...deliveryOptionBaseMock,
    placeId,
    ...data
  }
  return deliveryOptionMock
}