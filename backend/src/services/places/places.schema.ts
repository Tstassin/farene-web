// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { resourceSchema } from '../common/resources'

// Main data model schema
export const placeSchema =
  Type.Intersect(
    [
      Type.Object(
        {
          id: Type.Number(),
          name: Type.String(),
          description: Type.String()
        }
      ),
      resourceSchema
    ],
    { $id: 'Place', additionalProperties: false }
  )

export type Place = Static<typeof placeSchema>
export const placeValidator = getValidator(placeSchema, dataValidator)
export const placeResolver = resolve<Place, HookContext>({})

export const placeExternalResolver = resolve<Place, HookContext>({})

// Schema for creating new entries
export const placeDataSchema = Type.Pick(placeSchema, ['name', 'description'], {
  $id: 'PlaceData'
})
export type PlaceData = Static<typeof placeDataSchema>
export const placeDataValidator = getValidator(placeDataSchema, dataValidator)
export const placeDataResolver = resolve<Place, HookContext>({})

// Schema for updating existing entries
export const placePatchSchema = Type.Partial(placeSchema, {
  $id: 'PlacePatch'
})
export type PlacePatch = Static<typeof placePatchSchema>
export const placePatchValidator = getValidator(placePatchSchema, dataValidator)
export const placePatchResolver = resolve<Place, HookContext>({})

// Schema for allowed query properties
export const placeQueryProperties = Type.Pick(placeSchema, ['id', 'name', 'description'])
export const placeQuerySchema = Type.Intersect(
  [
    querySyntax(placeQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type PlaceQuery = Static<typeof placeQuerySchema>
export const placeQueryValidator = getValidator(placeQuerySchema, queryValidator)
export const placeQueryResolver = resolve<PlaceQuery, HookContext>({})
