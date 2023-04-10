import { useMutation, useQuery } from "@tanstack/react-query"
import Stripe from "stripe"
import { Order } from "../../../backend/src/services/orders/orders.schema"
import { client } from "../../api/api"

export const usePaymentIntentCreateMutation = () => {
  return useMutation({
    mutationFn: (orderId: Order['id']) => {
      return client.service('payment-intent').create({ orderId })
    },
  })
}

const fetchPaymentIntent = async ( id :  Stripe.PaymentIntent['id'] | undefined ) => {
  return typeof id === 'undefined'
  ? Promise.reject(new Error('Invalid id'))
  : client.service('payment-intent').get(id)
}

export const usePaymentIntentQuery = (paymentIntentId: Stripe.PaymentIntent['id'] | undefined) => {
  return useQuery({
    queryFn: () => fetchPaymentIntent(paymentIntentId),
    queryKey:['payment-intent', paymentIntentId],
    enabled: Boolean(paymentIntentId)
  })
}