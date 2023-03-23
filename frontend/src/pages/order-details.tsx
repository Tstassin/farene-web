import { Button, Container } from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CheckoutForm from "../components/payments/checkout-form";
import { QueryStatus } from "../components/queries/query-status";
import { useOrder } from "../queries/orders";
import { usePaymentIntentCreateMutation } from "../queries/payment-intents";

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
        <p>
          Numéro de commande : {orderQuery.data?.id} <br />
          Pour livraison le : {orderQuery.data?.delivery}
        </p>
        <Button onClick={() => { paymentIntentCreateMutation.mutate(orderQuery.data?.id!) }}>Payer</Button>
      </QueryStatus>
    </>
  )
}