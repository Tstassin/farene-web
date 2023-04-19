// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from "assert";
import { app } from "../../../src/app";
import { Order, OrderData } from "../../../src/services/orders/orders.schema";
import { cleanAll } from "../../utils/clean-all";
import { getCategoryMock } from "../categories/categories.mocks";
import { getOrderMock } from "../orders/orders.mocks";
import { getProductMock } from "../products/products.mocks";
import { getUserMock } from "../users/users.mocks";
import { describe } from 'mocha'
import dayjs from "dayjs";
import { BadRequest } from "@feathersjs/errors/lib";
import { User } from "../../../src/services/users/users.schema";
import { Category } from "../../../src/services/categories/categories.schema";
import { Product } from "../../../src/services/products/products.schema";
import { mockedCreatedPaymentIntent, mockStripePaymentIntentsCreate } from "./payment-intents.mocks";
import Sinon, * as sinon from "sinon";
import Stripe from "stripe";
import { calculateOrderPrice } from "../../../src/services/orders/orders.utils";

let user: User
let category: Category
let product: Product
let order: Order
let nextDeliveryDate: string
let pastWeekDeliveryDate: string
let mockedStripePaymentIntentCreate: Sinon.SinonStub<[data: Stripe.PaymentIntentCreateParams], Promise<Stripe.Response<Stripe.PaymentIntent>>>

describe("payment-intent service", () => {
  beforeEach(cleanAll)
  beforeEach(async () => {
    user = await app.service("users").create(getUserMock());
    category = await app.service("categories").create(getCategoryMock());
    product = await app
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
    nextDeliveryDate = await (await app.service('orders').getNextDeliveryDates()).nextDeliveryDates[0]
    pastWeekDeliveryDate = dayjs(nextDeliveryDate).subtract(7, 'days').toISOString()
  })
  beforeEach(async () => {
    mockedStripePaymentIntentCreate = mockStripePaymentIntentsCreate()
  })
  afterEach(async () => {
    mockedStripePaymentIntentCreate.restore()
  })

  it("registered the service", () => {
    const service = app.service("payment-intent");

    assert.ok(service, "Registered the service");
  });

  describe.only('Create a paymentIntent', async () => {
    it('Updates the order with paymentIntent when created', async () => {
      const paymentIntent = await app.service('payment-intent').create({ orderId: order.id }, { user })
      const updatedOrder = await app.service('orders').get(order.id)

      assert.equal(mockedCreatedPaymentIntent.id, updatedOrder.paymentIntent)
    })

    it('Sets receipt email whe calling stripe create payment intent method', async () => {
      const paymentIntent = await app.service('payment-intent').create({ orderId: order.id }, { user })
      assert(mockedStripePaymentIntentCreate.calledWith(sinon.match({ receipt_email: user.email })))
    })

    it('Sets amount as AMOUNT_IN_EUROS * 100', async () => {
      const paymentIntent = await app.service('payment-intent').create({ orderId: order.id }, { user })
      sinon.assert.calledWith(mockedStripePaymentIntentCreate, sinon.match({ amount: await calculateOrderPrice(order) * 100 }))
    })

    it('Set currency as euros', async () => {
      const paymentIntent = await app.service('payment-intent').create({ orderId: order.id }, { user })
      sinon.assert.calledWith(mockedStripePaymentIntentCreate, sinon.match({ currency: 'eur' }))
    })

    it('Sets correct payment methods', async () => {
      const paymentIntent = await app.service('payment-intent').create({ orderId: order.id }, { user })
      sinon.assert.calledWith(mockedStripePaymentIntentCreate, sinon.match({ payment_method_types: ['card', 'bancontact'] }))
    })

    it('Sets orderId in metadata', async () => {
      const paymentIntent = await app.service('payment-intent').create({ orderId: order.id }, { user })
      sinon.assert.calledWith(mockedStripePaymentIntentCreate, sinon.match({ metadata: {orderId: order.id} }))
    })

    it('doesnt create a payment intent for an order which is outdated', async () => {
      const updatedOrder = await app.service('orders').Model.table('orders').where({ id: order.id }).update({ delivery: pastWeekDeliveryDate })
      const paymentIntentCreateFn = () => app.service('payment-intent').create({ orderId: order.id }, {})
      await assert.rejects(paymentIntentCreateFn, (err: BadRequest) => {
        const error = err.toJSON();
        console.log(error)
        assert.match(err.message, /order is outdated please make a new order/);
        assert.strictEqual(err.code, 400);
        return true;
      });
    })
  })
});
