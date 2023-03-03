import { FeathersError } from '@feathersjs/errors/lib'
import React from 'react'
import { client } from '../../../api/api'
import { isAuthenticated } from '../../utils/authentication'

export const Authenticated: React.FC<{children: React.ReactElement}> = ({children}) => {
  try {
    if (isAuthenticated()) return children
  }
  catch (error_) {
    const error = (error_ as FeathersError).toJSON()
    console.log(error.code)
  }
  return <></>
}

export const NotAuthenticated: React.FC<{children: React.ReactElement}> = ({children}) => {
  try {
    if (!isAuthenticated()) return children
  }
  catch (error_) {
    const error = (error_ as FeathersError).toJSON()
    console.log(error.code)
  }
  return <></>
}