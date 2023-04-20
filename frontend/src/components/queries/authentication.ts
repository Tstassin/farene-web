import { FeathersError } from "@feathersjs/errors/lib"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { queryClient } from "../.."
import { client } from "../../../api/api"

export const useAuthenticateMutation = () => {
  const authenticationResult = useMutation({
    mutationFn: (values: { email: string, password: string }) => client.authenticate({
      strategy: 'local',
      ...values
    }),
    mutationKey: ['authentication'],
    onSuccess: (data) => {
      queryClient.setQueryData(['authentication'], data)
    },
    onError: (error: FeathersError) => error.toJSON()
  })
  return authenticationResult
}
export const useReAuthenticateMutation = () => {
  const authenticationResult = useMutation({
    mutationFn: async () => await client.reAuthenticate().catch(),
    mutationKey: ['authentication'],
    onSuccess: (data) => {
      queryClient.setQueryData(['authentication'], data)
    },
    onError: (error) => {
      queryClient.setQueryData(['authentication'], null)
    }
  })
  return authenticationResult
}

export const useLogoutMutation = () => {
  const navigate = useNavigate()
  const logoutResult = useMutation({
    mutationFn: () => client.logout(),
    mutationKey: ['authentication'],
    onSuccess: (data) => {
      queryClient.setQueryData(['authentication'], null)
      navigate('/')
    }
  })
  return logoutResult
}
