import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Box, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react"
import { dayLabel } from "../../../../backend/src/utils/dates"
import { useAllDeliveryOptions, useNextWeekDeliveryOptions } from "../../queries/delivery-options"

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
      <Heading size={'sm'} mb={3}>Points dépôts ouverts la semaine prochaine</Heading>
      {/* <Heading size={'sm'} mb={3}>Enlèvement le MARDI</Heading> */}
      <Text mb={6}>
        {allDeliveryOptions.data?.map(dO => {

          return (
            <>
              {dayLabel(dO.day)}
              <UnorderedList mb={5}>
                <ListItem>
                  De <b>{dO.from} à {dO.to}</b> chez {dO.place.name} : <br />
                  <Text>
                    {dO.place.description}
                  </Text>
                </ListItem>
                
              </UnorderedList>
            </>
          )
        })}
      </Text>

    </Box >
  )
}