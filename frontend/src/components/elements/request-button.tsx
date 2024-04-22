import { CheckIcon, WarningIcon } from "@chakra-ui/icons"
import { Alert, AlertDescription, AlertTitle, Box, Button, ButtonProps } from "@chakra-ui/react"
import { FeathersError } from "@feathersjs/errors/lib"
import { MutationStatus, QueryStatus, UseMutationResult, UseQueryResult } from "@tanstack/react-query"
import { useEffect } from "react"

interface RequestButtonProps {
  query: UseMutationResult<any, any, any, any> | UseQueryResult<any, any>
}

export const RequestButton = ((props: RequestButtonProps & ButtonProps) => {
  const { children, query, ...rest } = props

  return <>
    {query?.isError &&
      <Alert status='error' mb={5}>
        <Box>
          <AlertTitle>
            {query.error.message}
          </AlertTitle>
          <AlertDescription>
            {query.error.data &&
              (
                <>
                  {Object.entries(query.error.data as FeathersError).map(([fieldName, error]) => <>{fieldName}: {error.message}</>)}
                </>
              )}
          </AlertDescription>
        </Box>
      </Alert>
    }
    <Button leftIcon={query.isSuccess ? <CheckIcon /> : query.isError ? <WarningIcon /> : undefined} isLoading={query.isLoading} loadingText={'Envoi en cours'} {...rest}>{children}</Button>
  </>
})
