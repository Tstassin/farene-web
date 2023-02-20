// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { resourceSchema } from '../common/resources'

// Main data model schema
export const orderSchema = Type.Intersect(
  [
    Type.Object(
      {
        id: Type.Number(),
        delivery: Type.String(),
        userId: Type.Number()
      },
      { $id: 'Order', additionalProperties: false }
    ),
    resourceSchema
  ]
)
export type Order = Static<typeof orderSchema>
export const orderValidator = getValidator(orderSchema, dataValidator)
export const orderResolver = resolve<Order, HookContext>({})

export const orderExternalResolver = resolve<Order, HookContext>({})

// Schema for creating new entries
export const orderDataSchema = Type.Pick(
  orderSchema,
  ['delivery', 'userId']
  , {
    $id: 'OrderData'
  }
)
export type OrderData = Static<typeof orderDataSchema>
export const orderDataValidator = getValidator(orderDataSchema, dataValidator)
export const orderDataResolver = resolve<Order, HookContext>({})

// Schema for updating existing entries
export const orderPatchSchema = Type.Partial(orderSchema, {
  $id: 'OrderPatch'
})
export type OrderPatch = Static<typeof orderPatchSchema>
export const orderPatchValidator = getValidator(orderPatchSchema, dataValidator)
export const orderPatchResolver = resolve<Order, HookContext>({})

// Schema for allowed query properties
export const orderQueryProperties = Type.Pick(
  orderSchema,
  ['delivery', 'userId']
)
export const orderQuerySchema = Type.Intersect(
  [
    querySyntax(orderQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type OrderQuery = Static<typeof orderQuerySchema>
export const orderQueryValidator = getValidator(orderQuerySchema, queryValidator)
export const orderQueryResolver = resolve<OrderQuery, HookContext>({})
