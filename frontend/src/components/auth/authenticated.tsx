import { FeathersError } from '@feathersjs/errors/lib'
import React from 'react'
import { client } from '../../../api/api'
import { isAuthenticated } from '../../utils/authentication'
import { useAuthentication } from '../queries/authentication'

export const Authenticated: React.FC<{children: React.ReactElement}> = ({children}) => {
  const authenticated = Boolean(useAuthentication().data)
  if (authenticated) return children
  return <></>
}

export const NotAuthenticated: React.FC<{children: React.ReactElement}> = ({children}) => {
  const authenticated = Boolean(useAuthentication().data)
  if (!authenticated) return children
  return <></>
}