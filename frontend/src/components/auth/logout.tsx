import React, { useEffect } from "react";
import { client } from "../../../api/api";
import { useLogoutMutation } from "../queries/authentication";

export const Logout = () => {
  const logoutQuery = useLogoutMutation()
  useEffect(
    () => {
      logoutQuery.mutate()
    },
    []
  )
  return <></>
}