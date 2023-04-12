import { Button, Divider, Heading, Stack, Text } from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useParams, useSearchParams } from "react-router-dom";
import CheckoutForm from "../components/payments/checkout-form";
import { QueryStatus } from "../components/queries/query-status";
import { useOrder } from "../queries/orders";
import { usePaymentIntentCreateMutation, usePaymentIntentQuery } from "../queries/payment-intents";
import fr from 'dayjs/locale/fr'
import dayjs from "dayjs";
import { PaymentStatus } from "../components/payments/payment-status";

let stripePromise
if (process.env.NODE_ENV === 'development') {
  stripePromise = loadStripe("pk_test_51MrSeeFRObIGk3haL4aTpcyt0kOv4PRmaRB5thGPKt9XKNyB5oNwk95UBIp6N5QQonWWIYqJ7UkQOaBQeJZS40SU00tRSVWn92");
} else {
  stripePromise = loadStripe('pk_live_51MrSeeFRObIGk3haZwp878GZ7Eaj0ZJthBTDsvJxNjUIhBUAYacpmKDPVW5UlHQL762bpIbGi3mgYXj5qse9gPlt00TTjTkrq4')
}

export const OrderDetailsPage = () => {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const orderQuery = useOrder(parseInt(params.orderId!), Boolean(params.orderId))
  const paymentIntentCreateMutation = usePaymentIntentCreateMutation()
  const paymentIntentQuery = usePaymentIntentQuery(orderQuery.data?.paymentIntent)
  const paymentIntent = paymentIntentQuery.data ?? paymentIntentCreateMutation.data
  const appearance = {
    theme: 'stripe' as const,
  };
  const displayCheckoutForm = paymentIntent?.status !== 'succeeded'
  const displayPayButton = orderQuery.isSuccess && !orderQuery.data.paymentIntent && !paymentIntent
  const redirectStatus = searchParams.get('redirect_status')
  const status = orderQuery.data?.paymentSuccess ? 'succeeded' as const : redirectStatus ?? paymentIntent?.status

  return (
    <>

      <QueryStatus query={orderQuery}>
        <Heading>Commande numéro {orderQuery.data?.id}</Heading>
        <Text fontSize={'xl'} mb={10}>
          Pour livraison le {dayjs(orderQuery.data?.delivery, 'YYYY-MM-DD').locale(fr).format('dddd DD MMMM')} <br />
        </Text>
        <Text fontSize={'xl'} mb={5}>
          <ul>
            {orderQuery.data?.orderItems.map(orderItem => {

              return (
                <>
                  <li key={orderItem.id}>
                    {orderItem.product.name}
                    <Text textAlign='right'>
                      {orderItem.amount} x {orderItem.product.price}€ = {orderItem.amount * orderItem.product.price}€
                    </Text>
                    <Divider mt={5} />
                  </li>
                </>
              )
            })}
          </ul>
        </Text>


        <Heading size='md' mb={'10'}>
          Prix Total à payer
          <Text as='span' float={'right'}>
            {orderQuery.data?.price}€
          </Text>
        </Heading>
        {
          paymentIntent && status && 
          <Stack spacing={3} my={10}><PaymentStatus status={status} /></Stack>
        }
        {
          displayPayButton && <Button onClick={() => { paymentIntentCreateMutation.mutate(orderQuery.data?.id!) }}>Payer</Button>
        }
        {
          paymentIntent && displayCheckoutForm && (
            <>
              <Elements options={{
                clientSecret: paymentIntent.client_secret ?? undefined,
                appearance,
              }} stripe={stripePromise}>
                <Heading mb={5} size='lg'>Procéder au paiement</Heading>
                <CheckoutForm />
              </Elements>
            </>
          )
        }
      </QueryStatus>
    </>
  )
}