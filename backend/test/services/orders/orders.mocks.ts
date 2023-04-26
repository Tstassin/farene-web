import { app } from "../../../src/app";
import { OrderData } from "../../../src/services/orders/orders.schema";
import { Product } from "../../../src/services/products/products.schema";

export const getOrderMock = async (
  productId: Product["id"],
  data?: Partial<OrderData>
): Promise<OrderData> => {
  const baseOrderMock = {
    delivery: (await app.service("orders").getDeliveryDates())
      .deliveryDates.nextWeek[0],
    orderItems: [
      {
        productId: productId,
        amount: 1,
      },
    ],
  };

  return {
    ...baseOrderMock,
    ...data,
  };
};
