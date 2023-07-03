import { app } from "../../../src/app";
import { DeliveryOption } from "../../../src/client";
import { OrderData } from "../../../src/services/orders/orders.schema";
import { Product } from "../../../src/services/products/products.schema";

export const getOrderMock = async (
  productId: Product["id"],
  deliveryOptionId: DeliveryOption['id'],
  data?: Partial<OrderData>
): Promise<OrderData> => {
  const baseOrderMock: OrderData = {
    deliveryOptionId,
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
