import { Box, Container, Heading, Text } from '@chakra-ui/react'
import { CreateDeliveryOption } from '../components/delivery-options/create'
import { DeliveryOptionsList } from '../components/delivery-options/list'

export const DeliveryOptionsPage = () => {
  return (
    <>
      <Box mb={10}>
        <Heading>Mes options de livraison</Heading>
      </Box>
      <Box>
        <DeliveryOptionsList />
        <Heading size='md' mt={10} mb={5}>Ajouter une option de livraison</Heading>
        <CreateDeliveryOption />
      </Box>
    </>
  )
}