import { Heading, Text, Link, Box, Alert, AlertIcon, Divider } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";
import { dayLabel, getNextWeekStart } from "../../backend/src/utils/dates";
import { Authenticated, NotAuthenticated } from "./components/auth/authenticated";
import { OrderInstructions } from "./components/orders/order-instructions";

const nextMardi = dayLabel(getNextWeekStart().add(1, 'day').toISOString())

export const Home: React.FC = () => {

  return (
    <>
      <Heading mb={5}>Boulangerie 250°</Heading>
      <Box mb={10}>
        {/* <Alert status="info" mb={5}>
          <AlertIcon></AlertIcon>
          250° est partiellement en congés.<br />
          Vous pouvez commander cette semaine pour le Mardi 16 Mai.
        </Alert> */}
        <Authenticated>
          <Text fontSize={'xl'}>
            <Link as={NavLink} to='/order'><u>Commandez</u></Link> du pain pour le {nextMardi}.
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
      <br />
      <br />
      <br />
      <br />
      <br />
      <img src="https://250degres.be/IMG_6124.jpeg" />
      <br />
      <p>
        <b>250 degrés</b> propose un pain au levain, cuit à point
      </p>

      <p>
        Préparé, cuit et livré avec soin par Laurence<br />
        BOULANGÈRE – ARTISANE - INDEPENDANTE
      </p>
      <br />
      <ul>
        <li>CHASTRE</li>
        <li>TVA BE0734974740</li>
        <li>250degres@gmail.com</li>
        <li><Link as={NavLink} to='https://www.facebook.com/profile.php?id=61555972030001'><u>facebook</u></Link></li>
      </ul>

      <br />
      <br />
      <br />


    </>
  )
}