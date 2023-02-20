import { Box, Flex, Stack } from "@chakra-ui/react";
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
          Frontend
        </NavItem>
      </Box>
      <Stack
        spacing={8}
        align="center"
        justify={"flex-end"}
        direction={"row"}
        pt={0}
      >
        <NavItem to={'/register'}>Register</NavItem>
        <NavItem to={'/login'}>Login</NavItem>
      </Stack>
    </Flex>
  )
}
