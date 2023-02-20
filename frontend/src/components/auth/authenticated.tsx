import { FeathersError } from '@feathersjs/errors/lib'
import React from 'react'
import { client } from '../../../api/api'

export const Authenticated: React.FC<{children: React.ReactNode}> = ({children}) => {
  try {
    const isAuthenticated = client.authentication.authenticated
    if (isAuthenticated) return children
    console.log('not')
  }
  catch (error_) {
    const error = (error_ as FeathersError).toJSON()
    console.log(error.code)
  }
  return <>Not Allowed</>

}