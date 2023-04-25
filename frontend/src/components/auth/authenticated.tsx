import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAdmin, isAuthenticated } from '../../utils/authentication'
import { NotFound } from '@feathersjs/errors/lib'

export const Authenticated: React.FC<{children: React.ReactElement}> = ({children}) => {
  if (isAuthenticated()) return children
  return <></>
}
export const Admin: React.FC<{children: React.ReactElement}> = ({children}) => {
  if (isAdmin()) return children
  return <></>
}

export const NotAuthenticated: React.FC<{children: React.ReactElement}> = ({children}) => {
  if (!isAuthenticated()) return children
  return <></>
}
export const NotAdmin: React.FC<{children: React.ReactElement}> = ({children}) => {
  if (!isAdmin()) return children
  return <></>
}

export const Protected: React.FC<{children: React.ReactElement}> = ({children}) => {
  if (isAuthenticated()) return children
  return <Navigate to='/login' />
}

export const AdminProtected: React.FC<{children: React.ReactElement}> = ({children}) => {
  if (isAdmin()) return children
  throw new NotFound()
}