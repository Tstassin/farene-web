import { Button, Container, Heading, Text } from "@chakra-ui/react";
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
      {clientSecret && (
        <Elements options={{
          clientSecret,
          appearance,
        }} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
      <QueryStatus query={orderQuery}>
        <Heading>Commande numéro {orderQuery.data?.id}</Heading>
        <Text fontSize={'xl'} mb={10}>
          Pour livraison le {dayjs(orderQuery.data?.delivery, 'YYYY-MM-DD').locale(fr).format('dddd DD MMMM')} <br />
        </Text>
        <Text fontSize={'xl'} mb={10}>
          <ul>
            {orderQuery.data?.orderItems.map(orderItem => {

              return (
                <>
                  <li key={orderItem.id}>
                    {orderItem.amount} x {orderItem.product.name} ({orderItem.product.price}€ pièce)
                    <br />
                    = {orderItem.amount * orderItem.product.price}€
                  </li>
                </>
              )
            })}
          </ul>
        </Text>


        <Heading size='md' mb={10}>
          Prix Total à payer
          <br />
          = {orderQuery.data?.orderItems?.reduce((acc, curr) => (acc + (curr.amount * curr.product.price)), 0)}€
        </Heading>

        <Button onClick={() => { paymentIntentCreateMutation.mutate(orderQuery.data?.id!) }}>Payer</Button>
      </QueryStatus>
    </>
  )
}