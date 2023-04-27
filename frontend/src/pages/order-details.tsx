import { Alert, AlertIcon, Button, Divider, Heading, Stack, Text } from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useParams, useSearchParams } from "react-router-dom";
import CheckoutForm from "../components/payments/checkout-form";
import { QueryStatus } from "../components/queries/query-status";
import { useOrder, useOrderDates } from "../queries/orders";
import { usePaymentIntentCreateMutation, usePaymentIntentQuery } from "../queries/payment-intents";
import fr from 'dayjs/locale/fr'
import dayjs from "dayjs";
import { PaymentStatus } from "../components/payments/payment-status";
import { useState } from "react";
import { PayWithCodeModal } from "../components/payments/pay-with-code-modal";
import { FeathersError } from "@feathersjs/errors/lib";
import { eur, mult } from "../../../shared/prices";

let stripePromise: Promise<Stripe | null>
if (process.env.NODE_ENV === 'development') {
  stripePromise = loadStripe("pk_test_51MrSeeFRObIGk3haL4aTpcyt0kOv4PRmaRB5thGPKt9XKNyB5oNwk95UBIp6N5QQonWWIYqJ7UkQOaBQeJZS40SU00tRSVWn92");
} else {
  stripePromise = loadStripe('pk_live_51MrSeeFRObIGk3haZwp878GZ7Eaj0ZJthBTDsvJxNjUIhBUAYacpmKDPVW5UlHQL762bpIbGi3mgYXj5qse9gPlt00TTjTkrq4')
}

export const OrderDetailsPage = () => {
  const [showB2BPayment, setShowB2BPayment] = useState(false)
  const params = useParams()
  const [searchParams] = useSearchParams()
  const orderId = params.orderId ? parseInt(params.orderId) : undefined
  const orderQuery = useOrder(orderId)
  const orderDates = useOrderDates()
  const paymentIntentCreateMutation = usePaymentIntentCreateMutation()
  const paymentIntentQuery = usePaymentIntentQuery(orderQuery.data?.paymentIntent)
  const paymentIntent = paymentIntentQuery.data ?? paymentIntentCreateMutation.data
  const appearance = {
    theme: 'stripe' as const,
  };

  const orderPaymentSuccess = Boolean(orderQuery.isSuccess && orderQuery.data.paymentSuccess)
  const orderPaymentSuccessStatus = orderPaymentSuccess ? 'succeeded' : undefined
  const redirectStatus = searchParams.get('redirect_status')
  const paymentIntentStatus = paymentIntent && paymentIntent.status
  const status = redirectStatus ?? orderPaymentSuccessStatus ?? paymentIntentStatus

  return (
    <>

      <QueryStatus query={orderQuery}>
        <Heading mb={5}>Commande numéro {orderQuery.data?.id}</Heading>
        <Text fontSize={'xl'} mb={10}>
          Date : le {dayjs(orderQuery.data?.delivery, 'YYYY-MM-DD').locale(fr).format('dddd DD MMMM')}<br /> 
          Lieu : {orderQuery.data?.deliveryPlace ? orderDates.data?.deliveryPlaces[orderQuery.data.deliveryPlace] : ''} <br />
        </Text>
        <Text fontSize={'xl'} mb={5}>
          <ul>
            {orderQuery.data?.orderItems.map(orderItem => {

              return (
                <>
                  <li key={orderItem.id}>
                    {orderItem.product.name}
                    <Text textAlign='right'>
                      {orderItem.amount} x {eur(orderItem.product.price)} = {eur(mult(orderItem.amount,orderItem.product.price))}
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
          {
            orderQuery.data?.price !== undefined &&
            <Text as='span' float={'right'}>
              {eur(orderQuery.data.price)}
            </Text>
          }
        </Heading>
        <Stack spacing={3} my={10}>
          {
            paymentIntentCreateMutation.isError && <Alert status="error">
              <AlertIcon /> {paymentIntentCreateMutation.error instanceof FeathersError && paymentIntentCreateMutation.error.message}
            </Alert>
          }
          {
            status &&
            <PaymentStatus status={status} />
          }
        </Stack>
        {
          !paymentIntent && status !== 'succeeded' && <Button colorScheme={"blue"} mr={2} onClick={() => { paymentIntentCreateMutation.mutate(orderQuery.data?.id!) }}>Payer</Button>
        }
        {
          paymentIntent && status !== 'succeeded' && (
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
        {
          status !== 'succeeded' && <Button fontSize='sm' variant={'ghost'} color='GrayText' onClick={() => { setShowB2BPayment(true) }}>Payer avec un code professionnel</Button>
        }
      </QueryStatus>
      {orderQuery.isSuccess && <PayWithCodeModal orderId={orderQuery.data?.id} isOpen={showB2BPayment} closeAction={() => setShowB2BPayment(false)} />}
    </>
  )
}