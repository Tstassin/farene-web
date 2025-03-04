import { Box, Container, Text, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./header";

export const Layout: React.FC = () => {
  const location = useLocation()
  const [isDisplayingInBrowser] = useMediaQuery(['(display-mode: browser)'])
  const isAdminPath = location.pathname.includes('/admin')
  return (
    <Container mb={20} maxW={isDisplayingInBrowser && isAdminPath ? '120ch' : '60ch'}>
      <Header />
      <Outlet />
      <Box mt={20}>
        <Text fontSize={'xs'} textAlign='center'>&copy; {new Date().getFullYear()} · micro-ecommerce créé par <a href='https://codefathers.be' target={'_blank'}><u>codefathers</u></a></Text>
      </Box>
    </Container>
  )
}