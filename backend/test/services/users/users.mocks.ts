import {  UserData } from "../../../src/services/users/users.schema"

export const baseUserMock: UserData = { email: `user@test.com`, password: 'a' }

export const getUserMock = (data?: Partial<UserData>) => {
  
  return ({
    ...baseUserMock,
    ...data
  })
}