import { Box, Flex, Stack } from "@chakra-ui/react";
import { Authenticated, NotAuthenticated } from "./auth/authenticated";
import { NavItem } from "./navbar/nav-item";

export const Header = () => {

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
    >
      <Box>
        <NavItem to='/' fontSize="lg" fontWeight="bold">
          Farène
        </NavItem>
      </Box>
      <Stack
        spacing={8}
        align="center"
        justify={"flex-end"}
        direction={"row"}
        pt={0}
      >
        <Authenticated>
          <NavItem to={'/logout'}>Déconnexion</NavItem>
        </Authenticated>
        <NotAuthenticated>
          <>
            <NavItem to={'/login'}>Se connecter</NavItem>
            <NavItem to={'/register'}>Créer un compte</NavItem>
          </>
        </NotAuthenticated>
      </Stack>
    </Flex>
  )
}
