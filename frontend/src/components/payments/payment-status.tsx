import { Alert, AlertIcon, AlertStatus } from "@chakra-ui/react";
import Stripe from "stripe";

export const PaymentStatus = ({ paymentIntent }: { paymentIntent: Stripe.PaymentIntent }) => {
  let message: string
  let status: AlertStatus

  switch (paymentIntent.status) {
    case "succeeded":
      message = "Paiement réussi !"
      status = 'success'
      break;
    case "processing":
      message = "Paiement en cours de traitement."
      status = 'loading'
      break;
    case "requires_payment_method":
      message = 'En attente de paiement.'
      status = 'warning'
      break;
    case "canceled":
      message = 'Paiement annulé'
      status = 'error'
    case "requires_action":
      message = 'Action requise'
      status = 'info'
    case "requires_confirmation":
      message = "Confirmation en attente"
      status = 'info'
    default:
      message = paymentIntent.status
      status = 'info'
      break;
  }

  return (
      message 
      ?
       (
        <Alert status={status}>
          <AlertIcon />
          {message}
        </Alert>
      )
      : <></>
  )

}