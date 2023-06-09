// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from "@feathersjs/schema";
import { Type, getValidator, querySyntax } from "@feathersjs/typebox";
import type { Static } from "@feathersjs/typebox";
import { passwordHash } from "@feathersjs/authentication-local";

import type { HookContext } from "../../declarations";
import { dataValidator, queryValidator } from "../../validators";
import { resourceSchema } from "../common/resources";
import { restrictResource } from "./users.utils";

// Main data model schema
export const userSchema = Type.Intersect([
  Type.Object(
    {
      id: Type.Number(),
      email: Type.String({ format: 'email' }),
      firstName: Type.Optional(Type.String()),
      lastName: Type.Optional(Type.String()),
      password: Type.Optional(Type.String({ minLength: 1 })), //TODO.. optional ??
      resetCode: Type.Optional(Type.Number()),
      admin: Type.Integer()
    },
    { $id: "User", additionalProperties: false }
  ),
  resourceSchema,
]);
export type User = Static<typeof userSchema>;
export const userValidator = getValidator(userSchema, dataValidator);
export const userResolver = resolve<User, HookContext>({});

export const userExternalResolver = resolve<User, HookContext>({
  // The password should never be visible externally
  password: async () => undefined,
  // The reset code should never be visible externally
  resetCode: async () => undefined
});

// Schema for creating new entries
export const userDataSchema = Type.Pick(userSchema, ["email", "password", "firstName", "lastName"], {
  $id: "UserData", additionalProperties: false
});
export type UserData = Static<typeof userDataSchema>;
export const userDataValidator = getValidator(userDataSchema, dataValidator);
export const userDataResolver = resolve<User, HookContext>({
  password: passwordHash({ strategy: "local" }),
  admin: async () => 0
});

// Schema for updating existing entries
export const userPatchSchema =
  Type.Partial(
    Type.Pick(
      userSchema,
      ["password", "firstName", "lastName", "resetCode", "admin"],
      {
        $id: "UserPatch", additionalProperties: false
      }
    )
  );
export type UserPatch = Static<typeof userPatchSchema>;
export const userPatchValidator = getValidator(userPatchSchema, dataValidator);
export const userPatchResolver = resolve<User, HookContext>({
  password: passwordHash({ strategy: "local" }),
});

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, ["id", "email", "admin"]);
export const userQuerySchema = Type.Intersect(
  [
    querySyntax(userQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
);
export type UserQuery = Static<typeof userQuerySchema>;
export const userQueryValidator = getValidator(userQuerySchema, queryValidator);
export const userQueryResolver = resolve<UserQuery, HookContext>({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  id: restrictResource,
});
