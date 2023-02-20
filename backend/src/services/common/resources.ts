import { Type } from "@feathersjs/typebox/";

export const resourceSchema = Type.Object({
  createdAt: Type.String(),
  updatedAt: Type.String()
})