import { Box, Container,  Heading,  Text } from "@chakra-ui/react";
import { CreateProduct } from "../components/products/create";
import { useAllProducts } from "../queries/products";

export const Products = () => {

  const breadsQuery = useAllProducts()

  return (
    <Container>
      <Box mb={10}>
        <Heading>Tous nos produits disponibles</Heading>
        <Text fontSize={'xl'}>Faits maison et ...</Text>
      </Box>
      {breadsQuery.data?.map(bread => <li key={bread.id}>{bread.name}</li>)}
      <Box mb={10}>
        <Heading>Ajouter un nouveau produit</Heading>
        {/* <Text fontSize={'xl'}>Fais maison et ...</Text> */}
      </Box>
      <CreateProduct />
    </Container>
  )
}