// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'
import { StripeWebhooksData } from '../../../src/client'
import { Order, OrderData } from '../../../src/services/orders/orders.schema'
import { cleanAll } from '../../utils/clean-all'
import { getCategoryMock } from '../categories/categories.mocks'
import { getOrderMock } from '../orders/orders.mocks'
import { getProductMock } from '../products/products.mocks'
import { getUserMock } from '../users/users.mocks'
import { describe } from 'mocha'
import Sinon from 'sinon'
import Stripe from 'stripe'
import { mockStripePaymentIntentsCreate } from '../payment-intents/payment-intents.mocks'
import { User } from '../../../src/services/users/users.schema'
import { Category } from '../../../src/services/categories/categories.schema'
import { Product } from '../../../src/services/products/products.schema'

let user: User
let category: Category
let product: Product
let order: Order
let mockedStripePaymentIntentCreate: Sinon.SinonStub<[data: Stripe.PaymentIntentCreateParams], Promise<Stripe.Response<Stripe.PaymentIntent>>>

describe('stripe-webhooks service', () => {
  beforeEach(cleanAll)
  beforeEach(async () => {

    user = await app.service("users").create(getUserMock());
    category = await app.service("categories").create(getCategoryMock());
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
    order = await app.service("orders").create(orderData, { user });
  })
  beforeEach(async () => {
    mockedStripePaymentIntentCreate = mockStripePaymentIntentsCreate()
  })
  afterEach(async () => {
    mockedStripePaymentIntentCreate.restore()
  })

  it('registered the service', () => {
    const service = app.service('stripe-webhooks')

    assert.ok(service, 'Registered the service')
  })
  it('Updates the order when payment is successful', async () => {
    const paymentIntent = await app.service('payment-intent').create({ orderId: order.id }, { user })
    const webhook: Partial<StripeWebhooksData> = {
      data: {
        object: { ...paymentIntent, status: "succeeded" }
      }
    }
    await app.service('stripe-webhooks').create(webhook as StripeWebhooksData)
    await new Promise(resolve => setTimeout(resolve, 10)) // Webhook returns early
    const updatedOrder = await app.service('orders').get(order.id)
    assert.equal(updatedOrder.paymentSuccess, 1)
  })
})
