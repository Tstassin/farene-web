import { CheckIcon, WarningIcon } from "@chakra-ui/icons"
import { Button, ButtonProps } from "@chakra-ui/react"
import { MutationStatus, QueryStatus } from "@tanstack/react-query"

interface RequestButtonProps {
  status: MutationStatus | QueryStatus
}

export const RequestButton = ((props: RequestButtonProps & ButtonProps) => {
  const { children, status, ...rest } = props
  return <Button leftIcon={status === 'success' ? <CheckIcon /> : status === 'error' ? <WarningIcon /> : undefined} isLoading={status === 'loading'} loadingText={'Envoi en cours'} {...rest}>{children}</Button>
})