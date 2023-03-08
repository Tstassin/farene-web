// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'
import { describe } from 'mocha'
import { UserData } from '../../../src/services/users/users.schema'
import { OrderData } from '../../../src/services/orders/orders.schema'
import dayjs from 'dayjs'

const newOrderTemplate = {
  delivery: dayjs().add(1, 'day').toISOString(),
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
  it('registered the service', () => {
    const service = app.service('orders')
    assert.ok(service, 'Registered the service')
  })
  describe('DELIVERY DATES', () => {
    it('rejects if delivery date is in the past', async () => {
      const user = await app.service('users').create(userTemplate)
      const orderData: OrderData = {
        delivery: dayjs().subtract(1, 'day').toISOString(),
        products: [{
          productId: 1,
          amount: 1
        },
        {
          productId: 1,
          amount: 2
        }]
      }
      const orderFn = () => app.service('orders').create(orderData, { user })
      assert.rejects(orderFn)
    })
    it('passes if delivery date is in the future', async () => {
      const user = await app.service('users').create(userTemplate)
      const orderData: OrderData = {
        delivery: dayjs().add(1, 'day').toISOString(),
        products: [{
          productId: 1,
          amount: 1
        },
        {
          productId: 1,
          amount: 2
        }]
      }
      const order = await app.service('orders').create(orderData, { user })
      assert.ok(order)
    })
  })
  describe('PRODUCTS', () => {
    it('rejects if no product in order', async () => {
      const user = await app.service('users').create(userTemplate)
      const {products, ...orderData} = newOrderTemplate
      // @ts-expect-error
      const orderFn = () => app.service('orders').create(orderData)
      assert.rejects(orderFn)
    })
  })
  it('creates an order', async () => {
    // Create a test user
    const user = await app.service('users').create(userTemplate)
    const order = await app.service('orders').create(newOrderTemplate, { user })
  })
})
