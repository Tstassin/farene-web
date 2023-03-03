import { client } from "../../api/api"

export const isAuthenticated = () => {
  const isAuthenticated = client.authentication.authenticated
  if (isAuthenticated) return true
  else return false
}