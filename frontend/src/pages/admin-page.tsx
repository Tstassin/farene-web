import { Box, Heading, HStack } from "@chakra-ui/react";
import { NavItem } from "../components/navbar/nav-item";

export const AdminPage = () => {

  return (
    <>
      <Box mb={10}>
        <Heading>Admin</Heading>
      </Box>
      <Box>
        <Heading size='md' mt={10} mb={5}>Commandes</Heading>
        <HStack>
          <NavItem to='/admin/export'>Export</NavItem>
        </HStack>
      </Box>
      <Box>
        <Heading size='md' mt={10} mb={5}>Livraisons</Heading>
        <HStack>
          <NavItem to='/admin/orders'>Liste</NavItem>
        </HStack>
      </Box>
      <Box>
        <Heading size='md' mt={10} mb={5}>Produits</Heading>
        <HStack>
          <NavItem to='/admin/products'>Liste</NavItem>
        </HStack>
      </Box>
      <Box>
        <Heading size='md' mt={10} mb={5}>Catégories</Heading>
        <HStack>
          <NavItem to='/admin/categories'>Liste</NavItem>
        </HStack>
      </Box>
      <Box>
        <Heading size='md' mt={10} mb={5}>Lieux de livraison</Heading>
        <HStack>
          <NavItem to='/admin/places'>Liste</NavItem>
        </HStack>
      </Box>
    </>
  )
}