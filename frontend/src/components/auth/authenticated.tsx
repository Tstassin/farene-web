import React from 'react'
import { Navigate } from 'react-router-dom'
import ErrorPage from '../../pages/error-page'
import { isAdmin, isAuthenticated } from '../../utils/authentication'
import { Forbidden, NotFound } from '@feathersjs/errors/lib'

export const Authenticated: React.FC<{children: React.ReactElement}> = ({children}) => {
  if (isAuthenticated()) return children
  return <></>
}

export const NotAuthenticated: React.FC<{children: React.ReactElement}> = ({children}) => {
  if (!isAuthenticated()) return children
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