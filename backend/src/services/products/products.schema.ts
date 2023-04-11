// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from "@feathersjs/schema";
import { Type, getValidator, querySyntax } from "@feathersjs/typebox";
import type { Static } from "@feathersjs/typebox";

import type { HookContext } from "../../declarations";
import { dataValidator, queryValidator } from "../../validators";
import { resourceSchema } from "../common/resources";

// Main data model schema
export const productSchema = Type.Intersect([
  Type.Object(
    {
      id: Type.Number(),
      name: Type.String(),
      description: Type.String(),
      price: Type.Number({}),
      weight: Type.Number(),
      categoryId: Type.Number(),
    },
    { $id: "Product", additionalProperties: false }
  ),
  resourceSchema,
]);
export type Product = Static<typeof productSchema>;
export const productValidator = getValidator(productSchema, dataValidator);
export const productResolver = resolve<Product, HookContext>({});

export const productExternalResolver = resolve<Product, HookContext>({});

// Schema for creating new entries
export const productDataSchema = Type.Pick(
  productSchema,
  ["name", "description", "price", "weight", "categoryId"],
  {
    $id: "ProductData",
  }
);
export type ProductData = Static<typeof productDataSchema>;
export const productDataValidator = getValidator(
  productDataSchema,
  dataValidator
);
export const productDataResolver = resolve<Product, HookContext>({
  price: async (value, data, context) => Math.round(data.price * 100) / 100
});

// Schema for patching existing entries
export const productPatchSchema = Type.Partial(productSchema, {
  $id: "ProductPatch",
});
export type ProductPatch = Static<typeof productPatchSchema>;
export const productPatchValidator = getValidator(
  productPatchSchema,
  dataValidator
);
export const productPatchResolver = resolve<Product, HookContext>({});

// Schema for updating existing entries
export const productUpdateSchema = Type.Pick(
  productSchema,
  ['id', 'name', 'description', 'price', 'weight', 'categoryId'],
  {
    $id: "ProductUpdate",
  }
);
export type ProductUpdate = Static<typeof productUpdateSchema>;
export const productUpdateValidator = getValidator(
  productUpdateSchema,
  dataValidator
);
export const productUpdateResolver = resolve<Product, HookContext>({});

// Schema for allowed query properties
export const productQueryProperties = Type.Pick(productSchema, [
  "id",
  "name",
  "categoryId",
]);
export const productQuerySchema = Type.Intersect(
  [
    querySyntax(productQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
);
export type ProductQuery = Static<typeof productQuerySchema>;
export const productQueryValidator = getValidator(
  productQuerySchema,
  queryValidator
);
export const productQueryResolver = resolve<ProductQuery, HookContext>({});
