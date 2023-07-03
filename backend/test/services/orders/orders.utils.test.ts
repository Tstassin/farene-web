import assert from "assert";
import { describe } from "mocha";
import { app } from "../../../src/app";
import { Category } from "../../../src/services/categories/categories.schema";
import { DeliveryOption } from "../../../src/services/delivery-options/delivery-options";
import { calculateOrderPrice } from "../../../src/services/orders/orders.utils";
import { Product } from "../../../src/services/products/products.schema";
import { User } from "../../../src/services/users/users.schema";
import { cleanAll } from "../../utils/clean-all";
import { getCategoryMock } from "../categories/categories.mocks";
import { getDeliveryOptionMock } from "../delivery-options/delivery-options.mocks";
import { getProductMock } from "../products/products.mocks";
import { getUserMock } from "../users/users.mocks";
import { getOrderMock } from "./orders.mocks";

let user: User
let category: Category
let product1: Product
let product2: Product
let product3: Product
let deliveryOption: DeliveryOption

describe("orders service", () => {
  beforeEach(cleanAll);
  beforeEach(async () => {
    user = await app.service("users").create(getUserMock());
    category = await app.service("categories").create(getCategoryMock());
    product1 = await app
      .service("products")
      .create(getProductMock(category.id, { price: 1 }));
    product2 = await app
      .service("products")
      .create(getProductMock(category.id, { price: 2.3 }));
    product3 = await app
      .service("products")
      .create(getProductMock(category.id, { price: 3.8 }));
    deliveryOption = await app.service('delivery-options').create(await getDeliveryOptionMock())
  })
  it("calculates order prices correctly", async () => {
    const service = app.service("orders");

    const orderData = await getOrderMock(product1.id, deliveryOption.id, {
      orderItems: [{
        amount: 2,
        productId: product2.id
      }]
    });
    const order = await app.service("orders").create(orderData, { user })

    assert.equal(await calculateOrderPrice(order), 4.6)
    const orderData1 = await getOrderMock(product1.id, deliveryOption.id, {
      orderItems: [{
        amount: 3,
        productId: product2.id
      }, {
        amount: 1,
        productId: product3.id
      }]
    });
    const order1 = await app.service("orders").create(orderData1, { user })
    assert.equal(await calculateOrderPrice(order1), 6.9 + 3.8)

  });
})