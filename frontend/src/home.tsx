import { Heading, Text, Link, Box, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";
import { FormType } from "../../backend/src/services/delivery-options/delivery-options.schema";
import { NotAuthenticated } from "./components/auth/authenticated";
import { DeliveryOptions } from "./components/delivery-options/delivery-options";
// @ts-expect-error
import * as image from './images/IMG_6124.jpeg'

export const Home: React.FC = () => {

  return (
    <>
      <Alert
        colorScheme='pink'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        mb={'4rem'}
      >
        <AlertTitle mt={4} mb={3} fontSize='xl'>
          🎄 Spécial Noël 🎄
        </AlertTitle>
        <AlertDescription maxWidth='sm'>
          <Text fontWeight={900}><Link as={NavLink} to='/order?special=christmas'><u>-&gt; Cliquez ici &lt;-</u></Link></Text> 
          --- <br/>
          Pour commander vos bûches, biscuits apéritifs, brioches et crackers 
          <br />
          --- <br/>
          Commandes jusqu'au <Text fontWeight={900}>19 Décembre 2024</Text><br />
          A venir retirer sur place à l'atelier de La Ferme du Champs des Noces
        </AlertDescription>
      </Alert>
      <Heading mb={5}>Boulangerie 250°</Heading>
      <Box mb={10}>
        {/* <Alert status="info" mb={5}>
          <AlertIcon></AlertIcon>
          250° est partiellement en congés.<br />
          Vous pouvez commander cette semaine pour le Mardi 16 Mai.
        </Alert> */}
        <Text fontSize={'xl'}>Commandez votre pain jusque dimanche minuit</Text>
        <Text fontSize={'xl'}>Récupérez le à partir de mardi</Text>
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
        <DeliveryOptions formType={FormType.standard} />
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