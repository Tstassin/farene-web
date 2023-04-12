import { Container } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./header";

export const Layout: React.FC = () => {

  return (
    <Container mb={20}>
      <Header />
      <Outlet />
    </Container>
  )
}