import { Box, Text } from "@chakra-ui/react"
import { useNextWeekDeliveryOptions } from "../../queries/delivery-options"

export const OrderInstructions = () => {
  const allDeliveryOptions = useNextWeekDeliveryOptions()
  return (
    <Box>
      <Text mb={6}>
        <ul>
          <li>Commandez votre pain jusque dimanche minuit</li>
          <li>Récupérez le à partir de mardi</li>
        </ul>
      </Text>
    </Box >
  )
}