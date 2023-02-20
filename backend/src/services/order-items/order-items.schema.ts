// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const orderItemSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'OrderItem', additionalProperties: false }
)
export type OrderItem = Static<typeof orderItemSchema>
export const orderItemValidator = getValidator(orderItemSchema, dataValidator)
export const orderItemResolver = resolve<OrderItem, HookContext>({})

export const orderItemExternalResolver = resolve<OrderItem, HookContext>({})

// Schema for creating new entries
export const orderItemDataSchema = Type.Pick(orderItemSchema, ['text'], {
  $id: 'OrderItemData'
})
export type OrderItemData = Static<typeof orderItemDataSchema>
export const orderItemDataValidator = getValidator(orderItemDataSchema, dataValidator)
export const orderItemDataResolver = resolve<OrderItem, HookContext>({})

// Schema for updating existing entries
export const orderItemPatchSchema = Type.Partial(orderItemSchema, {
  $id: 'OrderItemPatch'
})
export type OrderItemPatch = Static<typeof orderItemPatchSchema>
export const orderItemPatchValidator = getValidator(orderItemPatchSchema, dataValidator)
export const orderItemPatchResolver = resolve<OrderItem, HookContext>({})

// Schema for allowed query properties
export const orderItemQueryProperties = Type.Pick(orderItemSchema, ['id', 'text'])
export const orderItemQuerySchema = Type.Intersect(
  [
    querySyntax(orderItemQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type OrderItemQuery = Static<typeof orderItemQuerySchema>
export const orderItemQueryValidator = getValidator(orderItemQuerySchema, queryValidator)
export const orderItemQueryResolver = resolve<OrderItemQuery, HookContext>({})
