import { Heading, Text, Link, Box, Alert, AlertIcon } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";
import { NotAuthenticated } from "./components/auth/authenticated";
import { DeliveryOptions } from "./components/delivery-options/delivery-options";
// @ts-expect-error
import * as image from './images/IMG_6124.jpeg'

export const Home: React.FC = () => {

  return (
    <>
      <Heading mb={5}>Boulangerie 250°</Heading>
      <Box mb={10}>
        <Text fontSize={'xl'}>Commandez votre pain jusque dimanche minuit</Text>
        <Text fontSize={'xl'}>Récupérez le à partir de mardi</Text>
        <br />
        <InfoMessage />
        <NotAuthenticated>
          <>
            <Text fontSize={'l'} mt={5}>
              <Link as={NavLink} to='/register'><u>Créez un compte</u></Link> pour commander et payer en ligne.<br />
              <Link as={NavLink} to='/login'><u>Connectez-vous</u></Link> si vous avez déjà un compte.
              <br />
            </Text>
          </>
        </NotAuthenticated>

        <Heading size={'md'} mb={3} mt={6}>Points dépôt disponibles :</Heading>
        <DeliveryOptions />
      </Box>
      <br />
      <img src={image} />
      <br />
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

export const InfoMessage = () => {

  return (
    <Alert status="info" mb={5} fontWeight='bold'>
      <AlertIcon></AlertIcon>
      Fermeture de la boulangerie mardi prochain, le 22 octobre.
      Vous pouvez déjà passer votre commande pour le mardi 29 octobre.
    </Alert>
  )
}