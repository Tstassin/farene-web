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
  const auth = queryClient.getQueryData(['authentication']) as AuthenticationResult | null | undefined
  if (auth && 'user' in auth && 'admin' in auth.user && auth.user.admin === 1) {
    return true
  }
  return false
}