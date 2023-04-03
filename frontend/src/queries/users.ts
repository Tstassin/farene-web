import { useMutation } from "@tanstack/react-query"
import { client } from "../../api/api"

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