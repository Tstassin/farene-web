// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'
import { StripeWebhooksData } from '../../../src/client'
import { OrderData } from '../../../src/services/orders/orders.schema'
import { cleanAll } from '../../utils/clean-all'
import { getCategoryMock } from '../categories/categories.mocks'
import { getOrderMock } from '../orders/orders.mocks'
import { getProductMock } from '../products/products.mocks'
import { getUserMock } from '../users/users.mocks'

describe('stripe-webhooks service', () => {
  beforeEach(cleanAll)
  it('registered the service', () => {
    const service = app.service('stripe-webhooks')

    assert.ok(service, 'Registered the service')
  })
  it('Updates the order when payment is succesful', async () => {
    const user = await app.service("users").create(getUserMock());
    const category = await app.service("categories").create(getCategoryMock());
    const product = await app
      .service("products")
      .create(getProductMock(category.id));
    const orderData: OrderData = {
      ...(await getOrderMock(product.id)),
      orderItems: [
        {
          productId: product.id,
          amount: 1,
        },
      ],
    };
    const order = await app.service("orders").create(orderData, { user });
    const paymentIntent = await app.service('payment-intent').create({ orderId: order.id }, { user })
    const webhook: Partial<StripeWebhooksData> = {
      data: {
        object: {...paymentIntent, status: "succeeded"}
      }
    }
    await app.service('stripe-webhooks').create(webhook as StripeWebhooksData)
    await new Promise(resolve => setTimeout(resolve, 100)) // Webhook returns early
    const updatedOrder = await app.service('orders').get(order.id)
    assert.equal(updatedOrder.paymentSuccess, 1)
  })
})
