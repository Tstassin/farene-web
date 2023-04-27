import { app } from "../../../src/app";
import { AllowedDeliveryPlaces } from "../../../src/config/orders";
import { OrderData } from "../../../src/services/orders/orders.schema";
import { Product } from "../../../src/services/products/products.schema";

export const getOrderMock = async (
  productId: Product["id"],
  data?: Partial<OrderData>
): Promise<OrderData> => {
  const delivery = (await app.service("orders").getDeliveryDates())
    .deliveries[0]
  const baseOrderMock: OrderData = {
    delivery: delivery.weekDay,
    deliveryPlace: delivery.deliveryPlace,
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
