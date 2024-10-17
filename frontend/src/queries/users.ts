import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from ".."
import { AuthenticationResult } from "../../../backend/src/client"
import { User, UserQuery } from "../../../backend/src/services/users/users.schema"
import { client } from "../../api/api"

export const useMakeUserAdminMutation = () => {

  return useMutation({
    mutationFn: (userId: User['id']) => client.service('users').patch(userId, { admin: 1 })
  })
}

export const useUsers = (query?: UserQuery) => {
  return useQuery({
    queryFn: () => client.service('users').find({query}),
    queryKey: ['users', query]
  })
}

export const useGenerateResetCodeMutation = () => {

  return useMutation({
    mutationFn: ({ email }: { email: string }) => client.service('users').generateResetCode({ email })
  })
}

export const useVerifyResetCodeMutation = () => {

  return useMutation({
    mutationFn: ({ email, resetCode }: { email: string, resetCode: number }) => client.service('users').verifyResetCode({ email, resetCode })
  })
}

export const useChangePasswordMutation = () => {

  return useMutation({
    mutationFn: ({ email, resetCode, password }: { email: string, resetCode: number, password: string }) => client.service('users').changePassword({ email, resetCode, password })
  })
}

export const getAuthentication = () => {

  return queryClient.getQueryData<AuthenticationResult>(['authentication'])
}