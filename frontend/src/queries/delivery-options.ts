import { useMutation, useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { queryClient } from ".."
import { DeliveryOption, DeliveryOptionData, DeliveryOptionPatch, DeliveryOptionQuery } from "../../../backend/src/services/delivery-options/delivery-options.schema"
import { getNextWeekEnd, getNextWeekEndOfNextWeek, getNextWeekStart, getToday, isoDate, isoDateFormat } from "../../../backend/src/utils/dates"
import { client } from "../../api/api"

const defaultDeliveryOptionsQuery: DeliveryOptionQuery = {
  $sort: { day: 1 }
}

export const useAllDeliveryOptions = () => {
  return useQuery({
    queryKey: ['deliveryOptions'],
    queryFn: () => client.service('delivery-options').find({ paginate: false, query: defaultDeliveryOptionsQuery })
  })
}

export const useDeliveryOptions = (query?: DeliveryOptionQuery, enabled = true) => {
  return useQuery({
    queryKey: ['deliveryOptions', query],
    queryFn: () => client.service('delivery-options').find({ paginate: false, query: { ...defaultDeliveryOptionsQuery, ...query } }),
    enabled
  })
}

export const useNextDeliveryOptions = () => {
  return useDeliveryOptions({ day: { $gte: isoDate(getToday()) } })
}

export const useNextWeekDeliveryOptions = () => {
  return useDeliveryOptions({ day: { $gte: isoDate(getNextWeekStart()), $lte: isoDate(getNextWeekEndOfNextWeek()) } })
}

const fetchDeliveryOption = async (id: DeliveryOption['id'] | undefined) => {
  return typeof id === 'undefined'
    ? Promise.reject(new Error('Invalid id'))
    : client.service('delivery-options').get(id)
}
export const useDeliveryOption = (id: DeliveryOption['id'] | undefined) => {
  return useQuery({
    queryKey: ['deliveryOptions', id],
    queryFn: () => fetchDeliveryOption(id),
    enabled: Boolean(id)
  })
}

export const useDeliveryOptionCreateMutation = () => {
  return useMutation({
    mutationFn: (data: DeliveryOptionData) => {
      return client.service('delivery-options').create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['deliveryOptions'])
    }
  })
}

export const useDeliveryOptionUpdateMutation = () => {
  return useMutation({
    mutationFn: (values: { id: DeliveryOption['id'] } & DeliveryOptionPatch) => {
      const { id, ...data } = values
      return client.service('delivery-options').patch(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['deliveryOptions'])
    }
  })
}

export const useDeliveryOptionRemoveMutation = () => {
  return useMutation({
    mutationFn: (id: DeliveryOption['id']) => {
      return client.service('delivery-options').remove(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['deliveryOptions'])
    }
  })
}