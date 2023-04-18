// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from "assert";
import { app } from "../../../src/app";
import { OrderData } from "../../../src/services/orders/orders.schema";
import { cleanAll } from "../../utils/clean-all";
import { getCategoryMock } from "../categories/categories.mocks";
import { getOrderMock } from "../orders/orders.mocks";
import { getProductMock } from "../products/products.mocks";
import { getUserMock } from "../users/users.mocks";
import { describe } from 'mocha'
import dayjs from "dayjs";
import { BadRequest } from "@feathersjs/errors/lib";

describe("payment-intent service", () => {
  beforeEach(cleanAll)
  it("registered the service", () => {
    const service = app.service("payment-intent");

    assert.ok(service, "Registered the service");
  });
  it.skip('Updates the order with paymentIntent when created', async () => {
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

    assert.equal(paymentIntent.receipt_email, user.email)
    assert.equal(paymentIntent.metadata.orderId, order.id)
  })
  it('doesnt create a payment intent for an order which is outdated', async () => {
    const user = await app.service("users").create(getUserMock());
    const category = await app.service("categories").create(getCategoryMock());
    const product = await app
      .service("products")
      .create(getProductMock(category.id));
    const nextDeliveryDate = await (await app.service('orders').getNextDeliveryDates()).nextDeliveryDates[0]
    const pastWeekDeliveryDate = dayjs(nextDeliveryDate).subtract(7, 'days').toISOString()
    const orderData: OrderData = {
      ...(await getOrderMock(product.id)),
    };
    const order = await app.service("orders").create(orderData, { user });
    const updatedOrder = await app.service('orders').Model.table('orders').where({id: order.id}).update({delivery: pastWeekDeliveryDate})
    const paymentIntentCreateFn = () => app.service('payment-intent').create({orderId: order.id}, {})
    await assert.rejects(paymentIntentCreateFn, (err: BadRequest) => {
      const error = err.toJSON();
      console.log(error)
      assert.match(err.message, /order is outdated please make a new order/);
      assert.strictEqual(err.code, 400);
      return true;
    });
  })
});
