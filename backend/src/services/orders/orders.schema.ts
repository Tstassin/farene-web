// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from "@feathersjs/schema";
import { Type, getValidator, querySyntax } from "@feathersjs/typebox";
import type { Static } from "@feathersjs/typebox";

import type { HookContext } from "../../declarations";
import { dataValidator, queryValidator } from "../../validators";
import { resourceSchema } from "../common/resources";
import { orderItemSchema, orderItemDataSchema } from "../order-items/order-items.schema";
import { calculateOrderPrice } from "./orders.utils";
import { restrictResource } from "../users/users.utils";

/**
 * Main data model
 */
export const orderSchema = Type.Intersect([
  Type.Object(
    {
      id: Type.Number(),
      delivery: Type.String(),
      userId: Type.Number(),
      orderItems: Type.Array(orderItemSchema),
      price: Type.Number(),
      paymentIntent: Type.Optional(Type.String()),
      paymentSuccess: Type.Integer({ default: 0, minimum: 0, maximum: 1 })
    },
    { $id: "Order", additionalProperties: false }
  ),
  resourceSchema,
]);
export type Order = Static<typeof orderSchema>;
export const orderValidator = getValidator(orderSchema, dataValidator);
export const orderResolver = resolve<Order, HookContext>(
  {
    // If there is a user (e.g. with authentication), they are only allowed to see their own data
    userId: async (value, user, context) => {
      if (context.params.user) {
        return context.params.user.id;
      }
      return value;
    },
    price: virtual(async (order) => calculateOrderPrice(order))
  },
  {
    converter: async (data, context) => {
      // We populate all order-items from the order
      return {
        ...data,
        orderItems: await context.app
          .service("order-items")
          .find({ query: { orderId: data.id }, paginate: false }),
      };
    },
  }
);

export const orderExternalResolver = resolve<Order, HookContext>({});

// Schema for creating new entries
export const orderDataSchema = Type.Intersect(
  [
    Type.Pick(orderSchema, ["delivery"], { $id: undefined }),
    Type.Object({
      orderItems: Type.Array(
        Type.Pick(orderItemDataSchema, ["amount", "productId"], {
          $id: undefined,
        })
      ),
    }),
  ],
  { $id: "OrderData", additionalProperties: false }
);
export type OrderData = Static<typeof orderDataSchema>;
export const orderDataValidator = getValidator(orderDataSchema, dataValidator);
export const orderDataResolver = resolve<Order, HookContext>(
  {
    userId: async (value, user, context) => {
      if (context.params.user) {
        return context.params.user.id;
      }

      return value;
    },
    paymentSuccess: async () => 0
  },
  {
    converter: async (data) => {
      return {
        ...data,
        orderItems: undefined,
      };
    },
  }
);

// Schema for patching existing entries
// Only paymentSuccess and paymentIntent allowed atm
// They cannot be 'undone', they must be patched to a value
export const orderPatchSchema =
  Type.Partial(
    Type.Intersect(
      [
        Type.Pick(
          orderSchema,
          ['paymentSuccess'],
        ),
        Type.Required(
          Type.Pick(
            orderSchema,
            ['paymentIntent'],
          )
        ),
      ]
    ),
    {
      $id: "OrderPatch", additionalProperties: false
    }
  );
export type OrderPatch = Static<typeof orderPatchSchema>;
export const orderPatchValidator = getValidator(
  orderPatchSchema,
  dataValidator
);
export const orderPatchResolver = resolve<Order, HookContext>({});

// Schema for code payment
export const orderPayWithCodeSchema =
  Type.Object(
    {
      id: orderSchema.properties.id,
      code: Type.String()
    },
    {
      $id: "OrderPayWithCode", additionalProperties: false
    }
  );
export type OrderPayWithCode = Static<typeof orderPayWithCodeSchema>;
export const orderPayWithCodeValidator = getValidator(
  orderPayWithCodeSchema,
  dataValidator
);
export const orderPayWithCodeResolver = resolve<Order, HookContext>({});

// Schema for allowed query properties
export const orderQueryProperties = Type.Pick(orderSchema, [
  "delivery",
  "userId",
  "paymentSuccess"
]);
export const orderQuerySchema = Type.Intersect(
  [
    querySyntax(orderQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
);
export type OrderQuery = Static<typeof orderQuerySchema>;
export const orderQueryValidator = getValidator(
  orderQuerySchema,
  queryValidator
);
export const orderQueryResolver = resolve<OrderQuery, HookContext>({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  userId: restrictResource
});
