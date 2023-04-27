import { Container, useMediaQuery } from "@chakra-ui/react";
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
    </Container>
  )
}