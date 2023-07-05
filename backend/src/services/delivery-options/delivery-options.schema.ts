// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { BadRequest } from '@feathersjs/errors/lib'
import { Place, placeSchema } from '../places/places.schema'
import { resourceSchema } from '../common/resources'
import { app } from '../../app'

// Main data model schema
export const deliveryOptionSchema =
  Type.Intersect(
    [
      Type.Object(
        {
          id: Type.Number(),
          place: Type.Object(placeSchema.properties),
          day: Type.String({ format: 'date' }),
          from: Type.Number({ minimum: 0, maximum: 24 }),
          to: Type.Number({ minimum: 0, maximum: 24, }),
          description: Type.String()
        }
      ),
      resourceSchema
    ],
    { $id: 'DeliveryOption', additionalProperties: false }
  )
export type DeliveryOption = Static<typeof deliveryOptionSchema>
export const deliveryOptionValidator = getValidator(deliveryOptionSchema, dataValidator)
export const deliveryOptionResolver = resolve<Omit<DeliveryOption, 'place'>, HookContext>(
  {},
  {
    converter: async (data, context) => {
      const { placeId } = data
      const place = await context.app.service('places').get(placeId)
      return ({ place, ...data })
    }
  })

export const deliveryOptionExternalResolver = resolve<DeliveryOption, HookContext>({})

// Schema for creating new entries
export const deliveryOptionDataSchema = Type.Intersect([
  Type.Pick(deliveryOptionSchema, ['day', 'from', 'to', 'description']),
  Type.Object({
    placeId: Type.Number()
  })
], {
  $id: 'DeliveryOptionData'
})
export type DeliveryOptionData = Static<typeof deliveryOptionDataSchema>
export const deliveryOptionDataValidator = getValidator(deliveryOptionDataSchema, dataValidator)
export const deliveryOptionDataResolver = resolve<DeliveryOption, HookContext>({
  from: async (value, data) => {
    if (data.to <= data.from) {
      throw new BadRequest("'from' time decimal value has to be lower then 'to' time decimal value")
    }
    return value
  },
  to: async (value, data) => {
    if (data.from >= data.to) {
      throw new BadRequest("'from' time decimal value has to be lower then 'to' time decimal value")
    }
    return value
  },
})

// Schema for updating existing entries
export const deliveryOptionPatchSchema = Type.Partial(deliveryOptionDataSchema, {$id: 'DeliveryOptionPatch'})
export type DeliveryOptionPatch = Static<typeof deliveryOptionPatchSchema>
export const deliveryOptionPatchValidator = getValidator(deliveryOptionPatchSchema, dataValidator)
export const deliveryOptionPatchResolver = resolve<DeliveryOption, HookContext>({
  from: async (value, data, context) => {
    if (value === undefined) return value
    const to = data.to ?? (await context.app.service('delivery-options').get(context.id!))['to']
    if (to <= data.from) {
      throw new BadRequest("'from' time decimal value has to be lower then 'to' time decimal value")
    }
    return value
  },
  to: async (value, data, context) => {
    if (value === undefined) return value
    const from = data.from ?? (await context.app.service('delivery-options').get(context.id!))['from']
    if (from >= data.to) {
      throw new BadRequest("'from' time decimal value has to be lower then 'to' time decimal value")
    }
    return value
  },
  place: async () => undefined
})

// Schema for allowed query properties
export const deliveryOptionQueryProperties = deliveryOptionSchema
export const deliveryOptionQuerySchema = Type.Intersect(
  [
    querySyntax(deliveryOptionQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type DeliveryOptionQuery = Static<typeof deliveryOptionQuerySchema>
export const deliveryOptionQueryValidator = getValidator(deliveryOptionQuerySchema, queryValidator)
export const deliveryOptionQueryResolver = resolve<DeliveryOptionQuery, HookContext>({})
