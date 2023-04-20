import { queryClient } from ".."
import { AuthenticationResult } from "../../../backend/src/client"
import { client } from "../../api/api"

export const isAuthenticated = () => {
  const isAuthenticated = client.authentication.authenticated
  if (isAuthenticated) return true
  else return false
}

export const isAdmin = () => {
  if (!isAuthenticated()) return false
  const { user: { admin } } = queryClient.getQueryData(['authentication']) as AuthenticationResult
  if (admin === 1) return true
  return false
}