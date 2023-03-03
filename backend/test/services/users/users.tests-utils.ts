import { app } from "../../../src/app"
import { User, UserData } from "../../../src/services/users/users.schema"

const userMock: UserData = { email: `user@test.com`, password: 'a' }

export const useMockUser = () => {
  let user: User | undefined
  beforeEach(async () => {
    user = await app.service('users').create(userMock)
  })
  afterEach(async () => {
    user && await app.service('users').remove(user.id)
  })

  return () => user

}