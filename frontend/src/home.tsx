import { Heading, Text, Link, Box } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";
import { Authenticated, NotAuthenticated } from "./components/auth/authenticated";
import { OrderInstructions } from "./components/orders/order-instructions";

export const Home: React.FC = () => {

  return (
    <>
      <Heading mb={5}>Bienvenue dans l'eshop de Farène</Heading>
      <Box mb={10}>
        <Authenticated>
          <Text fontSize={'xl'}>
            <Link as={NavLink} to='/order'><u>Commandez</u></Link> du pain pour la semaine prochaine.
          </Text>
        </Authenticated>
        <NotAuthenticated>
          <>
            <Text fontSize={'xl'}>
              <Link as={NavLink} to='/register'><u>Créez un compte</u></Link> pour commander et payer en ligne.
              <br />
              <Link as={NavLink} to='/login'><u>Connectez-vous</u></Link> directement.
            </Text>
          </>
        </NotAuthenticated>
      </Box>
      <OrderInstructions />
    </>
  )
}