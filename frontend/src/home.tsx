import { Heading, Text, Link, Box, Alert, AlertIcon } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";
import { Authenticated, NotAuthenticated } from "./components/auth/authenticated";
import { OrderInstructions } from "./components/orders/order-instructions";

export const Home: React.FC = () => {

  return (
    <>
      <Heading mb={5}>Bienvenue dans l'eshop de Farène</Heading>
      <Box mb={10}>
        {/* <Alert status="info" mb={5}>
          <AlertIcon></AlertIcon>
          Farène est partiellement en congés.<br />
          Vous pouvez commander cette semaine pour le Mardi 16 Mai.
        </Alert> */}
        <Authenticated>
          <Text fontSize={'xl'}>
            <Link as={NavLink} to='/order'><u>Commandez</u></Link> du pain pour la semaine prochaine.
          </Text>
        </Authenticated>
        <NotAuthenticated>
          <>
            <Text fontSize={'xl'}>
              <Link as={NavLink} to='/register'><u>Créez un compte</u></Link> pour commander et payer en ligne.<br />
              <Link as={NavLink} to='/login'><u>Connectez-vous</u></Link> si vous avez déjà un compte.
              <br />
            </Text>
          </>
        </NotAuthenticated>
      </Box>
      <OrderInstructions />
    </>
  )
}