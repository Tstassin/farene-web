import { Box, Heading, HStack, Link, } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export const AdminPage = () => {

  return (
    <>
      <Box mb={10}>
        <Heading>Admin</Heading>
      </Box>
      <Box>
        <Heading size='md' mt={10} mb={5}>Commandes</Heading>
        <HStack>
          <Link as={NavLink} to='/export'>Export</Link>
          <Link as={NavLink} to='/orders'>Liste</Link>
        </HStack>
      </Box>
      <Box>
        <Heading size='md' mt={10} mb={5}>Produits</Heading>
        <HStack>
          <Link as={NavLink} to='/products'>Liste</Link>
        </HStack>
      </Box>
      <Box>
        <Heading size='md' mt={10} mb={5}>Catégories</Heading>
        <HStack>
          <Link as={NavLink} to='/categories'>Liste</Link>
        </HStack>
      </Box>
    </>
  )
}