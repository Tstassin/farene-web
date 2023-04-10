import { Button, Divider, Heading, Text } from "@chakra-ui/react";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useParams, useSearchParams } from "react-router-dom";
import CheckoutForm from "../components/payments/checkout-form";
import { QueryStatus } from "../components/queries/query-status";
import { useOrder } from "../queries/orders";
import { usePaymentIntentCreateMutation } from "../queries/payment-intents";
import fr from 'dayjs/locale/fr'
import dayjs from "dayjs";
import { PaymentSuccess } from "../components/payments/payment-success";

const stripePromise = loadStripe("pk_test_51MrSeeFRObIGk3haL4aTpcyt0kOv4PRmaRB5thGPKt9XKNyB5oNwk95UBIp6N5QQonWWIYqJ7UkQOaBQeJZS40SU00tRSVWn92");

export const OrderDetailsPage = () => {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const orderQuery = useOrder(parseInt(params.orderId!), Boolean(params.orderId))
  const paymentIntentCreateMutation = usePaymentIntentCreateMutation()
  const clientSecret = paymentIntentCreateMutation.data?.client_secret ?? searchParams.get('payment_intent_client_secret')
  const appearance = {
    theme: 'stripe' as const,
  };
  const stripeSuccessfullRedirect = searchParams.get('payment_intent_client_secret')
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


        <Heading size='md' mb={'20'}>
          Prix Total à payer
          <Text as='span' float={'right'}>
            {orderQuery.data?.price}€
          </Text>
        </Heading>
        {
          (stripeSuccessfullRedirect && clientSecret)
            ?
            <Elements options={{
              clientSecret,
              appearance,
            }} stripe={stripePromise}>
              <PaymentSuccess clientSecret={clientSecret} />
            </Elements>
            :
            clientSecret
              ?
              <>
                <Elements options={{
                  clientSecret,
                  appearance,
                }} stripe={stripePromise}>
                  <Heading mb={5} size='lg'>Procéder au paiement</Heading>
                  <CheckoutForm clientSecret={clientSecret} />
                </Elements>
              </>
              :
              <Button onClick={() => { paymentIntentCreateMutation.mutate(orderQuery.data?.id!) }}>Payer</Button>
        }
      </QueryStatus>
    </>
  )
}