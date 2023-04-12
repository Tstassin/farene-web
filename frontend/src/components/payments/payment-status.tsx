import { Alert, AlertIcon, AlertStatus } from "@chakra-ui/react";
import Stripe from "stripe";

export const PaymentStatus = ({ status }: { status: string }) => {
  let message: string
  let alertStatus: AlertStatus

  switch (status) {
    case "succeeded":
      message = "Paiement réussi !"
      alertStatus = 'success'
      break;
    case "processing":
      message = "Paiement en cours de traitement."
      alertStatus = 'loading'
      break;
    case "requires_payment_method":
      message = 'En attente de paiement.'
      alertStatus = 'warning'
      break;
    case "canceled":
      message = 'Paiement annulé, veuillez rééssayer.'
      alertStatus = 'error'
      break;
    case "failed":
      message = 'Paiement annulé, veuillez rééssayer.'
      alertStatus = 'error'
      break;
    case "requires_action":
      message = 'Action requise en attente'
      alertStatus = 'info'
      break;
    case "requires_confirmation":
      message = "Confirmation en attente"
      alertStatus = 'info'
      break;
    default:
      message = status
      alertStatus = 'info'
      break;
  }

  return (
      message 
      ?
       (
        <Alert status={alertStatus}>
          <AlertIcon />
          {message}
        </Alert>
      )
      : <></>
  )

}