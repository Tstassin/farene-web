// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from "assert";
import { app } from "../../../src/app";
import { describe } from "mocha";
import { User, UserData } from "../../../src/services/users/users.schema";
import { Order, OrderData } from "../../../src/services/orders/orders.schema";
import dayjs from "dayjs";
import { getProductMock } from "../products/products.mocks";
import { getCategoryMock } from "../categories/categories.mocks";
import { baseUserMock, getUserMock } from "../users/users.mocks";
import { getOrderMock } from "./orders.mocks";
import { cleanAll } from "../../utils/clean-all";
import { BadRequest, FeathersError, PaymentError, NotFound, GeneralError, Forbidden } from "@feathersjs/errors/lib";
import { Category } from "../../../src/services/categories/categories.schema";
import { Product } from "../../../src/services/products/products.schema";
import { Place } from "../../../src/services/places/places.schema";
import { DeliveryOption } from "../../../src/client";
import { getPlaceMock } from "../places/places.mocks";
import { getDeliveryOptionMock } from "../delivery-options/delivery-options.mocks";
import { isoDateFormat, today } from "../../../src/utils/dates";

const userTemplate: UserData = { email: "user1@test.com", password: "a" };

const assertRejects = async (fn: () => Promise<any>, ErrorType: typeof FeathersError, errMessage: RegExp | string, data?: any) => {
  await assert.rejects(fn, (err: FeathersError) => {
    if (typeof errMessage === 'string') {
      assert.ok(err.message.includes(errMessage));
    } else {
      assert.match(err.message, errMessage);
    }
    assert.ok(err instanceof ErrorType);
    if (data) assert.deepEqual(err.data, data)
    return true;
  });
}



describe("orders service", () => {

  const ordersService = app.service('orders')
  let user: User
  let admin: User
  let category: Category
  let product: Product
  let orderData: Readonly<OrderData>
  let place: Place
  let deliveryOption: DeliveryOption

  const useBaseOrderMocks = () => {
    beforeEach(async () => {
      user = await app.service("users").create(getUserMock());
      const userWillBeAdmin = await app.service("users").create(getUserMock({ firstName: 'Admin', lastName: 'Admin', email: 'admin@farene.be' }));
      admin = await app.service('users').patch(userWillBeAdmin.id, { admin: 1 })
      category = await app.service("categories").create(getCategoryMock());
      product = await app
        .service("products")
        .create(getProductMock(category.id));
      place = await app.service('places').create(getPlaceMock())
      deliveryOption = await app.service('delivery-options').create(await getDeliveryOptionMock(place))
      orderData = await getOrderMock(product.id, deliveryOption.id);
    })

    afterEach(cleanAll);
  }


  it("registered the service", () => {
    const service = app.service("orders");
    assert.ok(service, "Registered the service");
  });

  describe('Create', () => {
    useBaseOrderMocks()
    it("creates an order", async () => {
      const order = await ordersService.create(orderData, { user });
      assert.ok(order);
      assert.ok(order.createdAt !== null);
      assert.ok(order.updatedAt !== null);
      assert.ok(order.userId === user.id);
      assert.ok(order.deliveryOptionId === orderData.deliveryOptionId);
      assert.ok(order.price === (orderData.orderItems[0].amount * product.price));
      assert.ok(order.paymentIntent === null);
      assert.ok(order.paymentSuccess === 0);
    });
  })

  describe('Delivery date', () => {
    describe("Rejects if delivery option is in the past", () => {
      useBaseOrderMocks()
      it('On create', async () => {
        const pastDeliveryOption = await app.service('delivery-options').create({ ...(await getDeliveryOptionMock(place)), day: dayjs().subtract(1, "day").format(isoDateFormat) })

        const orderFn = () => app.service("orders").create({ ...orderData, deliveryOptionId: pastDeliveryOption.id }, { user });

        await assertRejects(orderFn, BadRequest, /No delivery in the past/)
      })
    });

    describe("Only admins can update the delivery option", () => {
      useBaseOrderMocks()
      it('On PATCH', async () => {
        const newDeliveryOption = await app.service('delivery-options').create({ ...(await getDeliveryOptionMock(place)), day: dayjs().add(5, "day").format(isoDateFormat) })
        const order = await app.service("orders").create(orderData, { user });
        const updatedDeliveryOption = await app.service('orders').patch(order.id, { deliveryOptionId: newDeliveryOption.id }, { user: admin })
        assert.equal(newDeliveryOption.id, updatedDeliveryOption.deliveryOptionId)
      })
    })
    describe("Users cannot update the delivery date", () => {
      useBaseOrderMocks()
      it('On PATCH', async () => {
        const newDeliveryOption = await app.service('delivery-options').create({ ...(await getDeliveryOptionMock(place)), day: dayjs().add(5, "day").format(isoDateFormat) })
        const order = await app.service("orders").create(orderData, { user });
        const updateDeliveryDateFn = () => app.service('orders').patch(order.id, { deliveryOptionId: newDeliveryOption.id }, { user })
        await assertRejects(updateDeliveryDateFn, Forbidden, 'Error')
      })
    })
  })

  // TODO : Move to order-items !!
  describe('Order Items', () => {
    describe('At least an order item is required', async () => {
      useBaseOrderMocks()
      it('On create', async () => {
        const orderFn = (orderData: OrderData) =>
          app.service("orders").create(orderData, { user });

        // Testing undefined
        await assertRejects(
          () => orderFn({
            ...orderData,
            //@ts-expect-error types already protect us
            orderItems: undefined
          }),
          BadRequest,
          'validation failed'
        )

        // Testing null
        await assertRejects(
          () => orderFn({
            ...orderData,
            //@ts-expect-error types already protect us
            orderItems: null
          }),
          BadRequest,
          'validation failed'
        )
        // Empty array
        await assertRejects(
          () => orderFn({
            ...orderData,
            orderItems: []
          }),
          BadRequest,
          'No orderItems in order'
        )
      })
    })
    describe('Ordered products must exist', () => {
      useBaseOrderMocks()
      it('On create', async () => {


        const orderFn = () => app.service("orders").create({
          ...orderData,
          orderItems: [
            {
              productId: product.id + 1,
              amount: 1,
            },
          ],
        }, { user });
        await assertRejects(orderFn, NotFound, /No record found for/)
      })
    })
    describe('Ordered products cannot be disabled products', () => {
      useBaseOrderMocks()
      it('On create', async () => {
        const disabledProduct = await app.service('products').create(getProductMock(category.id, {sku: 'DISABLED', disabled: 1 }))
        const orderFn = () => app.service("orders").create({
          ...orderData,
          orderItems: [
            {
              productId: disabledProduct.id,
              amount: 1,
            },
          ],
        }, { user });
        await assertRejects(orderFn, BadRequest, "Error resolving data", {
          product: {
            name: 'BadRequest',
            message: 'Cannot order a product which is disabled',
            code: 400,
            className: 'bad-request'
          }
        })
      })
    })
    describe('Order-items have an amount > 1 specified', () => {
      useBaseOrderMocks()
      it('On create', async () => {
        const orderFn = () => app.service("orders").create({
          ...orderData,
          orderItems: [
            {
              productId: product.id,
              amount: 0,
            },
          ],
        }, { user });
        await assertRejects(orderFn, BadRequest, 'validation failed', [
          {
            instancePath: '/orderItems/0/amount',
            schemaPath: '#/properties/orderItems/items/properties/amount/minimum',
            keyword: 'minimum',
            params: { comparison: '>=', limit: 1 },
            message: 'must be >= 1'
          }
        ])
      })
    })
  })

  describe('User', () => {
    describe("Orders are for an existing user", () => {
      useBaseOrderMocks()
      it('On create', async () => {
        const orderFn = async () =>
          app
            .service("orders")
            .create(orderData, { user: { ...user, id: 0 } });

        await assertRejects(orderFn, GeneralError, /SQLITE_CONSTRAINT: FOREIGN KEY constraint failed/)
        await assertRejects(orderFn, GeneralError, /insert into `orders`/)
      })
    });
  })


  describe('Pay with a code', () => {
    useBaseOrderMocks()
    it("rejects if payment with code using wrong code", async () => {

      const order = await app.service("orders").create(orderData, { user });
      const payWithCodeFn = () => app.service("orders").payWithCode({ id: order.id, code: 'BLABLA' }, {});

      await assert.rejects(payWithCodeFn, (error: PaymentError) => {
        assert.equal(error.className, 'payment-error');
        assert.equal(error.code, 402);
        return true;
      });
    });
    it("sets paymentSuccess to true (1) if payment with code using correct code", async () => {

      const order = await app.service("orders").create(orderData, { user });
      const orderPayed = await app.service("orders").payWithCode({ id: order.id, code: app.get('payments').b2b.code }, {});

      assert.equal(orderPayed.paymentSuccess, 1)
    });
    it('rejects if order is outdated', async () => {
      const pastWeekDeliveryDate = dayjs(today, isoDateFormat, true).subtract(7, 'days').toISOString()
      const order = await app.service("orders").create(orderData, { user });
      await app.service('orders').Model.table('orders').where({ id: order.id }).update({ delivery: pastWeekDeliveryDate })
      const orderPayWithCodeFn = () => app.service('orders').payWithCode({ id: order.id, code: app.get('payments').b2b.code }, {})
      await assert.rejects(orderPayWithCodeFn, (err: BadRequest) => {
        assert.match(err.message, /order is outdated please make a new order/);
        assert.strictEqual(err.code, 400);
        return true;
      });
    })
  })

  describe('Summary', () => {
    useBaseOrderMocks()
    it("is restricted to admins", async () => {
      const getOrdersSummaryFn = () => app.service('orders').getOrdersSummary({}, { user })

      await assert.rejects(getOrdersSummaryFn, (error: PaymentError) => {
        assert.equal(error.className, 'forbidden');
        assert.equal(error.code, 403);
        return true;
      });
    })
    it("returns nothing if no orders", async () => {

      //const order = await app.service("orders").create(orderData, { user });
      const ordersSummary = await app.service("orders").getOrdersSummary({}, {});
      assert.equal(ordersSummary.amount, 0)
      assert.equal(ordersSummary.price, 0)
      assert.equal(ordersSummary.orderItems.length, 0)
    });
    it("returns a summary", async () => {
      const order = await app.service("orders").create(orderData, { user });
      const ordersSummary = await app.service("orders").getOrdersSummary({}, {});

      assert.equal(ordersSummary.amount, orderData.orderItems[0].amount)
      assert.equal(ordersSummary.price, order.price)
      assert.equal(ordersSummary.orderItems.length, 1)
    });
  })

  // TODO : wrong implementation, should be handled on the payment intent side
  describe('Payment success', () => {
    useBaseOrderMocks()
    it.skip('doesnt allow to set paymentSuccess on an order which is outdated', async () => {
      const pastWeekDeliveryDate = dayjs(today, isoDateFormat, true).subtract(7, 'days').toISOString()
      const order = await app.service("orders").create(orderData, { user });
      await app.service('orders').Model.table('orders').where({ id: order.id }).update({ delivery: pastWeekDeliveryDate })
      const orderUpdateFn = () => app.service('orders').patch(order.id, { paymentSuccess: 0 })
      await assert.rejects(orderUpdateFn, (err: BadRequest) => {
        assert.match(err.message, /order is outdated please make a new order/);
        assert.strictEqual(err.code, 400);
        return true;
      });
    })

  })

  describe('Access control', () => {
    useBaseOrderMocks()
    it('only shows the orders of the logged user', async () => {
      const user1 = await app.service("users").create(getUserMock({
        email: 'user1@example.com',
        password: 'a'
      }));
      const user2 = await app.service("users").create(getUserMock({
        email: 'user2@example.com',
        password: 'a'
      }));
      const { id } = await app.service("orders").create(orderData, { user: user1 });
      await app.service("orders").create(orderData, { user: user2 });
      const orders = await app.service('orders').find({ user: user1 })
      const orderFromUser1 = await app.service('orders').get(id)
      assert.equal(orders.data.length, 1)
      assert.deepEqual(orders.data[0], orderFromUser1)
    })
    it('Shows all orders to the admins', async () => {
      const user1 = await app.service("users").create(getUserMock({
        email: 'user1@example.com',
        password: 'a'
      }));
      const user2 = await app.service("users").create(getUserMock({
        email: 'user2@example.com',
        password: 'a'
      }));
      const orderFromUser1 = await app.service("orders").create(orderData, { user: user1 });
      const orderFromUser2 = await app.service("orders").create(orderData, { user: user2 });
      const admin = await app.service('users').patch(user2.id, { admin: 1 });
      const orders = await app.service('orders').find({ user: admin })
      assert.equal(orders.data.length, 2)
    })
  })

});
