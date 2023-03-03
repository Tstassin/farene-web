// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'
import { describe } from 'mocha'
import { UserData } from '../../../src/services/users/users.schema'

const newOrderTemplate = {
  delivery: new Date().toISOString(),
  products: [{
    productId: 1,
    amount: 2,
  }]
}

const userTemplate: UserData = { email: 'user1@test.com', password: 'a' }

describe('orders service', () => {
  beforeEach(async () => {
    await app.service('orders')._remove(null)
    await app.service('order-items')._remove(null)
    await app.service('users')._remove(null)
  })
  /* afterEach(async () => {
    await app.service('orders')._remove(null)
    await app.service('users')._remove(null)
  }) */
  it('registered the service', () => {
    const service = app.service('orders')
    assert.ok(service, 'Registered the service')
  })
  it('creates an order', async () => {
    // Create a test user
    const user = await app.service('users').create(userTemplate)
    const params = { user }
    const order = await app.service('orders').create(newOrderTemplate, params)
  })
})
