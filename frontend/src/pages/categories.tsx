import { Box, Container, Heading, Text } from '@chakra-ui/react'
import { CreateCategory } from '../components/categories/create'
import { CategoriesList } from '../components/categories/list'

export const CategoriesPage = () => {
  return (
    <>
      <Box mb={10}>
        <Heading>Mes catégories de produits</Heading>
      </Box>
      <Box>
        <CategoriesList />
        <Heading size='md' mt={10} mb={5}>Ajouter une catégorie de produits</Heading>
        <CreateCategory />
      </Box>
    </>
  )
}