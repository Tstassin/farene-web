// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const tagSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'Tag', additionalProperties: false }
)
export type Tag = Static<typeof tagSchema>
export const tagValidator = getValidator(tagSchema, dataValidator)
export const tagResolver = resolve<Tag, HookContext>({})

export const tagExternalResolver = resolve<Tag, HookContext>({})

// Schema for creating new entries
export const tagDataSchema = Type.Pick(tagSchema, ['text'], {
  $id: 'TagData'
})
export type TagData = Static<typeof tagDataSchema>
export const tagDataValidator = getValidator(tagDataSchema, dataValidator)
export const tagDataResolver = resolve<Tag, HookContext>({})

// Schema for updating existing entries
export const tagPatchSchema = Type.Partial(tagSchema, {
  $id: 'TagPatch'
})
export type TagPatch = Static<typeof tagPatchSchema>
export const tagPatchValidator = getValidator(tagPatchSchema, dataValidator)
export const tagPatchResolver = resolve<Tag, HookContext>({})

// Schema for allowed query properties
export const tagQueryProperties = Type.Pick(tagSchema, ['id', 'text'])
export const tagQuerySchema = Type.Intersect(
  [
    querySyntax(tagQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type TagQuery = Static<typeof tagQuerySchema>
export const tagQueryValidator = getValidator(tagQuerySchema, queryValidator)
export const tagQueryResolver = resolve<TagQuery, HookContext>({})
