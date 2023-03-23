import React from 'react'
import { client } from '../../../api/api'

export const Authenticated: React.FC<{children: React.ReactElement}> = ({children}) => {
  const authenticated = client.authentication.authenticated
  if (authenticated) return children
  return <></>
}

export const NotAuthenticated: React.FC<{children: React.ReactElement}> = ({children}) => {
  const authenticated = client.authentication.authenticated
  if (!authenticated) return children
  return <></>
}