import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { User } from "../../backend/src/services/users/users.schema";
import { Layout } from "./components/layout";

export const Home: React.FC = () => {
  const user = useLoaderData() as User | null
  if (user) {
    console.log({ 'logged in': user })
  }

  return (
    <>
      test
      test
    </>
  )
}