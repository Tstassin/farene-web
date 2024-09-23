import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Alert, AlertIcon, Box, Heading, Text } from "@chakra-ui/react"
import { DeliveryOption } from "../../../../backend/src/client"
import { dayLabel, decimalTimeLabel, weekDay } from "../../../../backend/src/utils/dates"
import { useNextWeekDeliveryOptions } from "../../queries/delivery-options"

export const DeliveryOptions = () => {
  const allDeliveryOptions = useNextWeekDeliveryOptions()

  return (
    <Accordion allowMultiple>
      {
        allDeliveryOptions.data?.map(
          dO => {
            return (
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as='span' flex='1' textAlign='left'>
                      <DeliveryOptionTitle deliveryOption={dO} />
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Text mb={3}>
                    {dayLabel(dO.day)} de {decimalTimeLabel(dO.from)} à {decimalTimeLabel(dO.to)}<br />
                    {dO.place.description}
                  </Text>
                  <Text mb={3}>
                    {dO.description && <i>{dO.description}</i>}
                  </Text>
                </AccordionPanel>
              </AccordionItem>

            )
          }
        ) ?? (
          allDeliveryOptions.data?.length === 0 && (
            <Alert status="warning" mb={5}>
              <AlertIcon></AlertIcon>
              Pas de livraisons prévues la semaine prochaine
            </Alert>
          )
        )
      }
    </Accordion >
  )
}

export const DeliveryOptionItem = ({ deliveryOption }: { deliveryOption: DeliveryOption }) => {
  return (
    <Box mb={3}>
      <DeliveryOptionTitle deliveryOption={deliveryOption} />
      <DeliveryOptionDetails deliveryOption={deliveryOption} />
    </Box>
  )

}

export const DeliveryOptionTitle = ({ deliveryOption }: { deliveryOption: DeliveryOption }) => {
  const dO = deliveryOption

  return (
    <>
      <b>{dO.place.name}</b> - {weekDay(dO.day)}
    </>
  )
}
export const DeliveryOptionDetails = ({ deliveryOption }: { deliveryOption: DeliveryOption }) => {
  const dO = deliveryOption
  return (
    <>
      <Text mb={3}>
        {dayLabel(dO.day)} de {decimalTimeLabel(dO.from)} à {decimalTimeLabel(dO.to)}<br />
        {dO.place.description}
      </Text>
      <Text mb={3}>
        {dO.description && <i>{dO.description}</i>}
      </Text>
    </>
  )
}