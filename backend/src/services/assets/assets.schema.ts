// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import multer from '@koa/multer'

export const multerFileSchema = Type.Object({
  fieldname: Type.String(),
  originalname: Type.String(),
  encoding: Type.String(),
  mimetype: Type.String(),
  destination: Type.String(),
  filename: Type.String(),
  path: Type.String(),
  size: Type.Integer()
})

// Main data model schema
export const assetSchema = Type.Object(
  {
    service: Type.Literal('products'),
    id: Type.Integer(),
    file: Type.Optional(multerFileSchema)
  },
  { $id: 'Asset', additionalProperties: false }
)
export type Asset = Static<typeof assetSchema>
export const assetValidator = getValidator(assetSchema, dataValidator)
export const assetResolver = resolve<Asset, HookContext>({})

export const assetExternalResolver = resolve<Asset, HookContext>({})

export const assetDataSchema = Type.Object(
  { 
    id: Type.Union([Type.String(), Type.Number()]), 
    service: Type.Literal('products'),
  },
  { $id: 'AssetData' }
)

export type AssetData = Static<typeof assetDataSchema>
export const assetDataValidator = getValidator(assetDataSchema, dataValidator)
export const assetDataResolver = resolve<Asset, HookContext>({})

// Schema for updating existing entries
export const assetPatchSchema = Type.Partial(assetSchema, {
  $id: 'AssetPatch'
})
export type AssetPatch = Static<typeof assetPatchSchema>
export const assetPatchValidator = getValidator(assetPatchSchema, dataValidator)
export const assetPatchResolver = resolve<Asset, HookContext>({})

// Schema for allowed query properties
export const assetQueryProperties = Type.Omit(assetSchema, ['file'])
export const assetQuerySchema = Type.Intersect(
  [
    querySyntax(assetQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type AssetQuery = Static<typeof assetQuerySchema>
export const assetQueryValidator = getValidator(assetQuerySchema, queryValidator)
export const assetQueryResolver = resolve<AssetQuery, HookContext>({})
