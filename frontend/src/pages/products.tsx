import { Box, Container,  Heading,  Text } from "@chakra-ui/react";
import { useAllProducts } from "../queries/products";

export const Products = () => {

  const breadsQuery = useAllProducts()

  return (
    <Container>
      <Box mb={10}>
        <Heading>Tous nos produits disponibles</Heading>
        <Text fontSize={'xl'}>Fais maison et ...</Text>
      </Box>
      {breadsQuery.data?.map(bread => <li key={bread.id}>{bread.name}</li>)}
    </Container>
  )
}