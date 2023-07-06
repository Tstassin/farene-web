import { Box, Text } from "@chakra-ui/react"
import { DeliveryOption } from "../../../../backend/src/client"
import { dayLabel, decimalTimeLabel } from "../../../../backend/src/utils/dates"

export const DeliveryOptionName = ({ deliveryOption }: { deliveryOption: DeliveryOption }) => {
  const dO = deliveryOption
  return (
    <Box mb={3}>
      <b>{dO.place.name}</b> <br />
      <>{dayLabel(dO.day)}</><br />
      <Text fontSize={'sm'}>de {decimalTimeLabel(dO.from)} à {decimalTimeLabel(dO.to)}</Text> 
      <Text fontSize={'sm'}><i>{dO.place.description}</i></Text>
      {dO.description && <>{dO.description}<br /></>}
    </Box>
  )
}