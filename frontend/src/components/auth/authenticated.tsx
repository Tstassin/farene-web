import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { client } from '../../../api/api'
import { Login } from './login'

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

export const Protected: React.FC<{children: React.ReactElement}> = ({children}) => {
  const authenticated = client.authentication.authenticated
  if (authenticated) return children
  return <Navigate to='/login' />
}