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

export const useOrdersSummary = (query?: OrderQuery, enabled = true) => {
  return useQuery({
    queryKey: ['orders-summary', query],
    queryFn: () => client.service('orders').getOrdersSummary(query ?? {}, {}),
    enabled
  })
}

const fetchOrder = (id?: Order['id']) => {
  return typeof id === 'undefined'
    ? Promise.reject(new Error('Invalid id'))
    : client.service('orders').get(id)
}
export const useOrder = (id?: Order['id']) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => fetchOrder(id),
    enabled: Boolean(id)
  })
}

export const useOrdersExport = ({ $gte, $lte }: { $gte: string, $lte: string }) => {
  return useMutation({
    mutationFn: () => client.service('orders').exportOrders({ $gte, $lte }),
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

export const useOrderDeliveryOptionIdMutation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: Order['id'], data: Omit<OrderPatch, 'paymentSuccess' | 'paymentIntent'> }) => {
      return client.service('orders').patch(id, data)
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