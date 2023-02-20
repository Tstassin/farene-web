import { Container } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/header";

export const App: React.FC = () => {

  return (
    <Container maxW='container.xl'> 
      <Header />
      <Outlet />
    </Container>
  )
}