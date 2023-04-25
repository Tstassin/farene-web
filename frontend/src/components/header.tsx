import { Box, Flex, Link, Stack } from "@chakra-ui/react";
import { Admin, Authenticated, NotAuthenticated } from "./auth/authenticated";
import { NavItem } from "./navbar/nav-item";
import { useLogoutMutation } from "./queries/authentication";

export const Header = () => {
  const logoutQuery = useLogoutMutation()
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      py={8}
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
          <>
            <Admin>
              <NavItem to={'/admin'}>Admin</NavItem>
            </Admin>
            <NavItem to={'/order'}>Commander</NavItem>
            {/* <NavItem to={'/products'}>Produits</NavItem>
            <NavItem to={'/categories'}>Catégories</NavItem> */}
            <Link as='button' onClick={() => { logoutQuery.mutate() }}>
              Déconnexion
            </Link>
          </>
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
