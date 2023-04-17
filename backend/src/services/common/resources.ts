import { resolve } from "@feathersjs/schema";
import { Static, Type } from "@feathersjs/typebox/";
import { HookContext } from "../../declarations";

export const resourceSchema = Type.Object({
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export type ResourceSchema = Static<typeof resourceSchema>;
export const resourceSchemaCreateResolver = resolve<
  ResourceSchema,
  HookContext
>({
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString(),
});
export const resourceSchemaPatchResolver = resolve<
  ResourceSchema,
  HookContext
>({
  updatedAt: async () => new Date().toISOString(),
});
export const resourceSchemaUpdateResolver = resolve<
  ResourceSchema,
  HookContext
>({
  updatedAt: async () => new Date().toISOString(),
  createdAt: async (value, data, context) =>  await (await context.app.service('products').get(context.id!)).createdAt
});
