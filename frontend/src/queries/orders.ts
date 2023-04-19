import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { queryClient } from ".."
import { Order, OrderData, OrderPatch, OrderPayWithCode, OrderQuery } from "../../../backend/src/services/orders/orders.schema"
import { client } from "../../api/api"

export const useOrders = (query?: OrderQuery, enabled = true) => {
  return useQuery({
    queryKey: ['orders', query],
    queryFn: () => client.service('orders').find({ query }),
    enabled
  })
}

export const useOrder = (id: Order['id'], enabled: Required<UseQueryOptions['enabled']>) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => client.service('orders').get(id),
    enabled
  })
}

export const useOrderDates = () => {
  return useQuery({
    queryKey: ['nextDeliveryDates'],
    queryFn: () => client.service('orders').getNextDeliveryDates()
  })
}

export const useOrdersExport = () => {
  return useMutation({
    mutationFn: () => client.service('orders').exportOrders(),
  })
}

export const useOrderCreateMutation = () => {
  return useMutation({
    mutationFn: (data: OrderData) => {
      return client.service('orders').create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
    }
  })
}

export const useOrderPayWithCodeMutation = () => {
  return useMutation({
    mutationFn: (data: OrderPayWithCode) => {
      return client.service('orders').payWithCode(data, {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
    }
  })
}
/* 
export const useOrderUpdateMutation = () => {
  return useMutation({
    mutationFn: (values: { id: Order['id'] } & OrderPatch) => {
      const { id, ...data } = values
      return client.service('orders').patch(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
    }
  })
}

export const useOrderRemoveMutation = () => {
  return useMutation({
    mutationFn: (id: Order['id']) => {
      return client.service('orders').remove(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
    }
  })
} */