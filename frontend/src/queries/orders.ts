import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from ".."
import { Order, OrderData, OrderPatch } from "../../../backend/src/services/orders/orders.schema"
import { client } from "../../api/api"

export const useAllOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => client.service('orders').find({ paginate: false })
  })
}

export const useOrderDates = () => {
  return useQuery({
    queryKey: ['nextDeliveryDates'],
    queryFn: () => client.service('orders').getNextDeliveryDates()
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

export const useOrderUpdateMutation = () => {
  return useMutation({
    mutationFn: (values: {id: Order['id']} & OrderPatch) => {
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
}