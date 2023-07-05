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
      <Heading size={'sm'} mb={3}>Commandes et enlèvement chaque semaine</Heading>
      <Text mb={6}>
        Les commandes sont ouvertes chaque semaine pour la semaine suivante.<br />
        Les commandes se clôturent tous les dimanches à minuit.<br />
        Les commandes peuvent être retirées en points dépôts :
      </Text>
      <Heading size={'md'} mb={3} mt={6}>Points dépôts ouverts la semaine prochaine</Heading>
      {/* <Heading size={'sm'} mb={3}>Enlèvement le MARDI</Heading> */}
        {allDeliveryOptions.data?.map(dO => {

          return (
            <Box mb={5}>

              <DeliveryOptionName deliveryOption={dO} />
            </Box>
          )
        })}

    </Box >
  )
}