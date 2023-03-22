import { useMutation } from "@tanstack/react-query"
import { Order } from "../../../backend/src/services/orders/orders.schema"
import { client } from "../../api/api"

export const usePaymentIntentCreateMutation = () => {
  return useMutation({
    mutationFn: (orderId: Order['id']) => {
      return client.service('create-payment-intent').update(orderId, {})
    },
  })
}