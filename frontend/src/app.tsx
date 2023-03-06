import { Container } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/header";
import { useReAuthenticateMutation } from "./components/queries/authentication";

export const App: React.FC = () => {
  const reAuthenticationMutation = useReAuthenticateMutation()
  
  useEffect(
    () => {
      reAuthenticationMutation.mutate()
    },
    []
  )

  return (
    <Container maxW='container.xl'>
      <Header />
      <Outlet />
    </Container>
  )
}