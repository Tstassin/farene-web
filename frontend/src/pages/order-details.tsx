import { Button, Container } from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import { QueryStatus } from "../components/queries/query-status";
import { useOrder } from "../queries/orders";
import { usePaymentIntentCreateMutation } from "../queries/payment-intents";

export const OrderDetailsPage = () => {
  const params = useParams()
  const orderQuery = useOrder(parseInt(params.orderId!), Boolean(params.orderId))
  const paymentIntentCreateMutation = usePaymentIntentCreateMutation()

  return (
    <Container>
      <QueryStatus query={orderQuery}>
        <p>
          Numéro de commande : {orderQuery.data?.id} <br />
          Pour livraison le : {orderQuery.data?.delivery}
        </p>
        {JSON.stringify(paymentIntentCreateMutation)}
        <Button onClick={() => { paymentIntentCreateMutation.mutate(orderQuery.data?.id!) }}>Payer</Button>
      </QueryStatus>
    </Container>
  )
}