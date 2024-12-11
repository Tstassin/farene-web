// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from "@feathersjs/schema";
import { Type, getValidator, querySyntax } from "@feathersjs/typebox";
import type { Static } from "@feathersjs/typebox";

import type { HookContext } from "../../declarations";
import { dataValidator, queryValidator } from "../../validators";
import { resourceSchema } from "../common/resources";
import { deliveryOptionSchema } from "../delivery-options/delivery-options.schema";

// Main data model schema
export const categorySchema = Type.Intersect([
  Type.Object(
    {
      id: Type.Number(),
      name: Type.String(),
      type: deliveryOptionSchema['properties']['type']
    },
    { $id: "Category", additionalProperties: false }
  ),
  resourceSchema,
]);
export type Category = Static<typeof categorySchema>;
export const categoryValidator = getValidator(categorySchema, dataValidator);
export const categoryResolver = resolve<Category, HookContext>({});

export const categoryExternalResolver = resolve<Category, HookContext>({});

// Schema for creating new entries
export const categoryDataSchema = Type.Pick(categorySchema, ["name", 'type'], {
  $id: "CategoryData",
});
export type CategoryData = Static<typeof categoryDataSchema>;
export const categoryDataValidator = getValidator(
  categoryDataSchema,
  dataValidator
);
export const categoryDataResolver = resolve<Category, HookContext>({});

// Schema for patching existing entries
export const categoryPatchSchema = Type.Partial(categorySchema, {
  $id: "CategoryPatch",
});
export type CategoryPatch = Static<typeof categoryPatchSchema>;
export const categoryPatchValidator = getValidator(
  categoryPatchSchema,
  dataValidator
);
export const categoryPatchResolver = resolve<Category, HookContext>({});


// Schema for updating existing entries
export const categoryUpdateSchema = Type.Pick(categorySchema, ['id', 'name', 'type'], {
  $id: "CategoryUpdate",
});
export type CategoryUpdate = Static<typeof categoryUpdateSchema>;
export const categoryUpdateValidator = getValidator(
  categoryUpdateSchema,
  dataValidator
);
export const categoryUpdateResolver = resolve<Category, HookContext>({});


// Schema for allowed query properties
export const categoryQueryProperties = Type.Pick(categorySchema, [
  "id",
  "name",
  "type"
]);
export const categoryQuerySchema = Type.Intersect(
  [
    querySyntax(categoryQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
);
export type CategoryQuery = Static<typeof categoryQuerySchema>;
export const categoryQueryValidator = getValidator(
  categoryQuerySchema,
  queryValidator
);
export const categoryQueryResolver = resolve<CategoryQuery, HookContext>({});
