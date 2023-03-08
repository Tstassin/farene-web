import { Box, Container, Heading, Text } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { Authenticated } from '../components/auth/authenticated'
import { CreateCategory } from '../components/categories/create'
import { CategoriesList } from '../components/categories/list'

export const CategoriesPage = () => {
  return (
    <Container>
      <Box mb={10}>
        <Heading>Mes catégories de produits</Heading>
        <Text fontSize={'xl'}>....</Text> 
        <CategoriesList />
        <CreateCategory />
      </Box>
      
    </Container>
  )
}