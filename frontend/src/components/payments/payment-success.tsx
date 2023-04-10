import { Alert, AlertIcon, Stack } from "@chakra-ui/react";
import { useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

export const PaymentSuccess = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const [message, setMessage] = useState<null | string>(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Paiement réussi !");
          break;
        case "processing":
          setMessage("Paiement en cours de traitement.");
          break;
        case "requires_payment_method":
          setMessage("");
          break;
        default:
          setMessage("Une erreur a eu lieu.");
          break;
      }
    });
  }, [stripe]);

  return (
    <Stack spacing={3} mt={5}>
      {message && (
        <Alert status="success">
          <AlertIcon />
          {message}
        </Alert>
      )}
    </Stack>
  )

}