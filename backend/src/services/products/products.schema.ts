// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const productSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'Product', additionalProperties: false }
)
export type Product = Static<typeof productSchema>
export const productValidator = getValidator(productSchema, dataValidator)
export const productResolver = resolve<Product, HookContext>({})

export const productExternalResolver = resolve<Product, HookContext>({})

// Schema for creating new entries
export const productDataSchema = Type.Pick(productSchema, ['text'], {
  $id: 'ProductData'
})
export type ProductData = Static<typeof productDataSchema>
export const productDataValidator = getValidator(productDataSchema, dataValidator)
export const productDataResolver = resolve<Product, HookContext>({})

// Schema for updating existing entries
export const productPatchSchema = Type.Partial(productSchema, {
  $id: 'ProductPatch'
})
export type ProductPatch = Static<typeof productPatchSchema>
export const productPatchValidator = getValidator(productPatchSchema, dataValidator)
export const productPatchResolver = resolve<Product, HookContext>({})

// Schema for allowed query properties
export const productQueryProperties = Type.Pick(productSchema, ['id', 'text'])
export const productQuerySchema = Type.Intersect(
  [
    querySyntax(productQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ProductQuery = Static<typeof productQuerySchema>
export const productQueryValidator = getValidator(productQuerySchema, queryValidator)
export const productQueryResolver = resolve<ProductQuery, HookContext>({})
