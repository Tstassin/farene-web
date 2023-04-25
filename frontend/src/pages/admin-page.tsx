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
          <NavItem to='/export'>Export</NavItem>
          <NavItem to='/orders'>Liste</NavItem>
        </HStack>
      </Box>
      <Box>
        <Heading size='md' mt={10} mb={5}>Produits</Heading>
        <HStack>
          <NavItem to='/products'>Liste</NavItem>
        </HStack>
      </Box>
      <Box>
        <Heading size='md' mt={10} mb={5}>Catégories</Heading>
        <HStack>
          <NavItem to='/categories'>Liste</NavItem>
        </HStack>
      </Box>
    </>
  )
}