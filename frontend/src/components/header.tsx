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
        <NavItem to='/' fontSize="lg" fontWeight="bold" noDecorate>
          250°
        </NavItem>
      </Box>
      <Stack
        spacing={4}
        align="center"
        justify={"flex-end"}
        direction={"row"}
        pt={0}
      >
        
      </Stack>
    </Flex>
  )
}
