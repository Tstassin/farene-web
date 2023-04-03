import { Heading, Text, Link, Box } from "@chakra-ui/react";
import React from "react";
import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import { User } from "../../backend/src/services/users/users.schema";
import { Authenticated, NotAuthenticated } from "./components/auth/authenticated";
import { Layout } from "./components/layout";
import { OrderInstructions } from "./components/orders/order-instructions";

export const Home: React.FC = () => {
  const user = useLoaderData() as User | null
  if (user) {
    console.log({ 'logged in': user })
  }

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