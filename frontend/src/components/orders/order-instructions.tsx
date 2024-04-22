import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Alert, AlertIcon, Box, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react"
import { dayLabel, decimalTimeLabel } from "../../../../backend/src/utils/dates"
import { useAllDeliveryOptions, useNextWeekDeliveryOptions } from "../../queries/delivery-options"
import { DeliveryOptionName } from "../delivery-options/delivery-option-name"

export const OrderInstructions = () => {
  const allDeliveryOptions = useNextWeekDeliveryOptions()
  return (
    <Box>
      <Text mb={6}>
        <ul>
          <li>Commandez chaque semaine jusque dimanche minuit</li>
          <li>Votre commande sera prête pour le mardi suivant</li>
          <li>Vous choisissez le point d'enlèvement</li>
        </ul>
      </Text>
      <Heading size={'md'} mb={3} mt={6}>Collectes en point dépôt mardi prochain :</Heading>
      {allDeliveryOptions.data?.map(dO => {

        return (
          <Box mb={5}>

            <DeliveryOptionName deliveryOption={dO} />
          </Box>
        )
      })}
      {allDeliveryOptions.data?.length === 0 && (
        <Alert status="warning" mb={5}>
          <AlertIcon></AlertIcon>
          Pas de livraisons prévues la semaine prochaine
        </Alert>
      )}

    </Box >
  )
}