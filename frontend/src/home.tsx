import { Heading, Text, Link } from "@chakra-ui/react";
import React from "react";
import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import { User } from "../../backend/src/services/users/users.schema";
import { Layout } from "./components/layout";

export const Home: React.FC = () => {
  const user = useLoaderData() as User | null
  if (user) {
    console.log({ 'logged in': user })
  }

  return (
    <>
      <Heading>Bienvenue dans l'eshop de Farène</Heading>
      <Text fontSize={'xl'}>Commandez du pain chaque semaine</Text>
    </>
  )
}