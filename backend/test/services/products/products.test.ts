// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'
import { User, UserData } from '../../../src/services/users/users.schema'
import { describe } from 'mocha'
import { useMockUser } from '../users/users.tests-utils'

const userMock: UserData = { email: `user@test.com`, password: 'a' }
let user: User | undefined

describe('products service', () => {
  const user = useMockUser()
  it('registered the service', () => {
    const service = app.service('products')
    
    assert.ok(service, 'Registered the service')
  })
  it('creates a product', async () => {
    await app.service('products').create({ name: "Pain d'épeautre", description: 'Délicieux', weight: 900, price: 5, categoryId: 1 })
  })
})
