import { Box,  Heading } from "@chakra-ui/react";
import { CreateProduct } from "../components/products/create";
import { ProductsList } from "../components/products/list";
import { useAllProducts } from "../queries/products";

export const Products = () => {

  const breadsQuery = useAllProducts()

  return (
    <>
      <Box mb={10}>
        <Heading>Tous les produits disponibles</Heading>
      </Box>
      <Box>
        <ProductsList />
        <Heading size='md' mt={10} mb={5}>Ajouter un nouveau produit</Heading>
        <CreateProduct />
      </Box>
    </>
  )
}