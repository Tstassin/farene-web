import { Box, Container, Heading, Text } from '@chakra-ui/react'
import { CreatePlace } from '../components/places/create'
import { PlacesList } from '../components/places/list'

export const PlacesPage = () => {
  return (
    <>
      <Box mb={10}>
        <Heading>Mes lieux de livraison</Heading>
      </Box>
      <Box>
        <PlacesList />
        <Heading size='md' mt={10} mb={5}>Ajouter un lieu de livraison</Heading>
        <CreatePlace />
      </Box>
    </>
  )
}