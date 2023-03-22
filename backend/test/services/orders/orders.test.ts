// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'
import { describe } from 'mocha'
import { UserData } from '../../../src/services/users/users.schema'
import { OrderData } from '../../../src/services/orders/orders.schema'
import dayjs from 'dayjs'
import { getProductMock } from '../products/products.mocks'
import { getCategoryMock } from '../categories/categories.mocks'
import { getUserMock } from '../users/users.mocks'
import { getOrderMock } from './orders.mocks'
import { cleanAll } from '../../utils/clean-all'
import { FeathersError } from '@feathersjs/errors/lib'

const userTemplate: UserData = { email: 'user1@test.com', password: 'a' }

describe('orders service', () => {
  beforeEach(cleanAll)
  it('registered the service', () => {
    const service = app.service('orders')
    assert.ok(service, 'Registered the service')
  })

  it('creates an order', async () => {

    const user = await app.service('users').create(getUserMock())
    const category = await app.service('categories').create(getCategoryMock())
    const product = await app.service('products').create(getProductMock(category.id))
    const orderData = await getOrderMock(product.id)
    const order = await app.service('orders').create(orderData, { user })

    assert.ok(order)
    assert.ok(order.createdAt !== null)
    assert.ok(order.updatedAt !== null)
    assert.ok(order.userId === user.id)
    assert.ok(order.delivery === orderData.delivery)
  })

  it('rejects if no product in order', async () => {
    const user = await app.service('users').create(getUserMock())
    const category = await app.service('categories').create(getCategoryMock())
    const product = await app.service('products').create(getProductMock(category.id))

    const orderFn = (orderData: OrderData) => app.service('orders').create(orderData, { user })

    // Testing undefined
    const orderData: OrderData = {
      ...await getOrderMock(product.id),
      // @ts-expect-error
      products: undefined
    }
    await assert.rejects(orderFn(orderData))


    // Testing null
    // @ts-expect-error
    orderData.products = null
    await assert.rejects(orderFn(orderData))

    /**
     * TODO
     */
    // Testing empty array
    //orderData.products = []
    //await assert.rejects(orderFn(orderData))

  })

  it('rejects if product doesnt exist', async () => {
    const user = await app.service('users').create(getUserMock())
    const category = await app.service('categories').create(getCategoryMock())
    const product = await app.service('products').create(getProductMock(category.id))
    const orderData: OrderData = {
      ...await getOrderMock(product.id),
      products: [{
        productId: product.id + 1,
        amount: 1
      }]
    }

    const orderFn = () => app.service('orders').create(orderData, { user })
    await assert.rejects(orderFn, (err: FeathersError) => {
      const error = err.toJSON()
      assert.match(err.message, /No record found for/)
      assert.strictEqual(err.code, 404)
      return true
    })
  })

  it('rejects if product doesnt exist', async () => {
    const user = await app.service('users').create(getUserMock())
    const category = await app.service('categories').create(getCategoryMock())
    const product = await app.service('products').create(getProductMock(category.id))
    const orderData: OrderData = {
      ...await getOrderMock(product.id),
      products: [{
        productId: product.id + 1,
        amount: 1
      }]
    }

    const orderFn = () => app.service('orders').create(orderData, { user })
    await assert.rejects(orderFn, (err: FeathersError) => {
      const error = err.toJSON()
      assert.match(err.message, /No record found for/)
      assert.strictEqual(err.code, 404)
      return true
    })
  })

  /**
   * TODO
   */
  it.skip('rejects if no amount is set for a product', async () => {
    const user = await app.service('users').create(getUserMock())
    const category = await app.service('categories').create(getCategoryMock())
    const product1 = await app.service('products').create(getProductMock(category.id))
    const product2 = await app.service('products').create(getProductMock(category.id, { name: 'Un autre pain' }))
    const orderData: OrderData = {
      ...await getOrderMock(product1.id),
      products: [
        {
          productId: product1.id,
          amount: 1
        },
        {
          productId: product2.id,
          amount: 0
        },
      ]
    }

    const orderFn = async () => app.service('orders').create(orderData, { user })
    await assert.rejects(orderFn, (err: FeathersError) => {
      const error = err.toJSON()
      assert.strictEqual(error.name, 'GeneralError')
      return true
    })
  })

  it('rejects if user doesnt exist', async () => {
    const user = await app.service('users').create(getUserMock())
    const category = await app.service('categories').create(getCategoryMock())
    const product = await app.service('products').create(getProductMock(category.id))
    const orderData: OrderData = {
      ...await getOrderMock(product.id),
      products: [{
        productId: product.id + 1,
        amount: 1
      }]
    }

    const orderFn = async () => app.service('orders').create(orderData, { user: { ...user, id: user.id + 1 } })

    await assert.rejects(orderFn, (err: FeathersError) => {
      const error = err.toJSON()
      assert.strictEqual(error.name, 'GeneralError')
      assert.match(error.message, /SQLITE_CONSTRAINT: FOREIGN KEY constraint failed/)
      assert.match(error.message, /insert into `orders`/)
      return true
    })
  })


  it('rejects if delivery date is in the past', async () => {
    const user = await app.service('users').create(getUserMock())
    const category = await app.service('categories').create(getCategoryMock())
    const product = await app.service('products').create(getProductMock(category.id))

    const orderData = await getOrderMock(product.id)
    orderData.delivery = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

    const orderFn = () => app.service('orders').create(orderData, { user })

    await assert.rejects(orderFn, (err: FeathersError) => {
      const error = err.toJSON()
      assert.match(error.message, /No delivery on/)
      return true
    })
  })

  it('rejects if delivery date is not valid', async () => {
    const user = await app.service('users').create(getUserMock())
    const category = await app.service('categories').create(getCategoryMock())
    const product = await app.service('products').create(getProductMock(category.id))

    const orderData = await getOrderMock(product.id)
    orderData.delivery = 'NOT VALID'

    const orderFn = () => app.service('orders').create(orderData, { user })

    await assert.rejects(orderFn, (err: FeathersError) => {
      const error = err.toJSON()
      assert.match(error.message, /Invalid delivery date or format/)
      return true
    })
  })
})