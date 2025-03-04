import { Heading, Text, Link, Box, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";
import { FormType } from "../../backend/src/services/delivery-options/delivery-options.schema";
import { NotAuthenticated } from "./components/auth/authenticated";
import { DeliveryOptions } from "./components/delivery-options/delivery-options";
// @ts-expect-error
import * as image from './images/IMG_6124.jpg'

export const Home: React.FC = () => {

  return (
    <>
      <Alert
        backgroundColor={'#FFE0C9'}
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        mb={'4rem'}
      >
        <AlertTitle mt={4} mb={3} fontSize='xl'>
          🔔 Un rappel chaque semaine ?
        </AlertTitle>
        <AlertDescription fontWeight={'semibold'}>
          <p>
            <br />
            Chaque semaine recevez par email :<br />
            <ul style={{ listStyleType: 'none' }}>
              <li>
                ✔️ Un rappel pour commander votre pain artisanal.
              </li>
              <li>
                ✔️ Les nouveautés et produits de la semaine.
              </li>
              <li>
                ✔️ Des astuces, coulisses, découvertes, recettes…
              </li>
            </ul>
            <br />
            🔗 <a href="http://eepurl.com/i9yzVY"><u>Cliquez-ici pour vous inscrire au rappel 🔔</u></a><br />
            <br />
            Prochaines dates de fermeture de la boulangerie :<br />
            <ul style={{ listStyleType: 'none' }}>
              <li>
                -&gt; Du 17 mars au 26 mars inclus
              </li>
              <li>
                -&gt; Du 21 avril au 23 avril inclus
              </li>
              <li>
                -&gt; Du 14 juillet au 15 août inclus
              </li>
            </ul>
            <br />
          </p>
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