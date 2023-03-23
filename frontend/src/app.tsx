import { Container } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { User } from "../../backend/src/services/users/users.schema";
import { Header } from "./components/header";
import { useReAuthenticateMutation } from "./components/queries/authentication";

export const App: React.FC = () => {
  const user = useLoaderData() as User | null
  if (user) {
    console.log({ 'logged in': user })
  }

  return (
    <Container maxW='container.xl'>
      <Header />
      <Outlet />
    </Container>
  )
}