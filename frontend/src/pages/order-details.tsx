import { Button, Container, Divider, Heading, Text } from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import CheckoutForm from "../components/payments/checkout-form";
import { QueryStatus } from "../components/queries/query-status";
import { useOrder } from "../queries/orders";
import { usePaymentIntentCreateMutation } from "../queries/payment-intents";
import fr from 'dayjs/locale/fr'
import dayjs from "dayjs";

const stripePromise = loadStripe("pk_test_1KaGE07z9jcdVCoJgyGByCxa");

export const OrderDetailsPage = () => {
  const params = useParams()
  const orderQuery = useOrder(parseInt(params.orderId!), Boolean(params.orderId))
  const paymentIntentCreateMutation = usePaymentIntentCreateMutation()
  const { clientSecret } = paymentIntentCreateMutation.data ?? {}
  const appearance = {
    theme: 'stripe' as const,
  };


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
          {orderQuery.data?.orderItems?.reduce((acc, curr) => (acc + (curr.amount * curr.product.price)), 0)}€
          </Text>
        </Heading>
        {
          clientSecret
            ?
            (
              <>
                <Heading mb={5} size='lg'>Procéder au paiement</Heading>
                <Elements options={{
                  clientSecret,
                  appearance,
                }} stripe={stripePromise}>
                  <CheckoutForm clientSecret={clientSecret} />
                </Elements>
              </>
            )
            :
            <Button onClick={() => { paymentIntentCreateMutation.mutate(orderQuery.data?.id!) }}>Payer</Button>
        }
      </QueryStatus>
    </>
  )
}