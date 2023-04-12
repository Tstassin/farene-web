import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Alert, AlertIcon, Button, Stack } from "@chakra-ui/react";
import Stripe from "stripe";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stripe_return_url = new URL(location.pathname, window.location.href).toString()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: stripe_return_url,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      error.message && setErrorMessage(error.message);
    } else {
      setErrorMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs" as const
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Stack spacing={3} mt={5}>
        
        {errorMessage && (
          <Alert status='error'>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
      </Stack>
      <Button mb={5} type="submit" colorScheme={"blue"} disabled={isLoading || !stripe || !elements} id="submit" mt={5} isLoading={isLoading} loadingText='En cours...'>
        <span id="button-text">
          Payer ma commande
        </span>
      </Button>
      {/* Show any error or success messages */}
    </form>
  );
}