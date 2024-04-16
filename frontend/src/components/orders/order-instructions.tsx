import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Box, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react"
import { dayLabel, decimalTimeLabel } from "../../../../backend/src/utils/dates"
import { useAllDeliveryOptions, useNextWeekDeliveryOptions } from "../../queries/delivery-options"
import { DeliveryOptionName } from "../delivery-options/delivery-option-name"

export const OrderInstructions = () => {
  const allDeliveryOptions = useNextWeekDeliveryOptions()
  console.log(allDeliveryOptions)
  return (
    <Box>
      <Heading size={'sm'} mb={3}>Commandez chaque semaine jusque dimanche minuit</Heading>
      <Text mb={6}>
        Votre commande sera prête pour le mardi suivant.<br />
        Vous choisissez le point d'enlèvement.<br />
      </Text>
      <Heading size={'md'} mb={3} mt={6}>Collectes en point dépôt mardi prochain</Heading>
      {/* <Heading size={'sm'} mb={3}>Enlèvement le MARDI</Heading> */}
      {allDeliveryOptions.data?.map(dO => {

        return (
          <Box mb={5}>

            <DeliveryOptionName deliveryOption={dO} />
          </Box>
        )
      })}
      {allDeliveryOptions.data?.length === 0 && (
        <>Il n'y a pas de livraisons prévues la semaine prochaine</>
      )}

    </Box >
  )
}