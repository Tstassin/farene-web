// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from "@feathersjs/feathers";
import { KnexService } from "@feathersjs/knex";
import type { KnexAdapterParams, KnexAdapterOptions } from "@feathersjs/knex";

import type { Application } from "../../declarations";
import type { User, UserData, UserPatch, UserQuery } from "./users.schema";
import { app } from "../../app";
import { sendResetCodeEmail } from "../../hooks/send-reset-code";
import { NotFound } from "@feathersjs/errors/lib";
import hashPassword from "@feathersjs/authentication-local/lib/hooks/hash-password";
import { passwordHash } from "@feathersjs/authentication-local/lib";

export type { User, UserData, UserPatch, UserQuery };

export interface UserParams extends KnexAdapterParams<UserQuery> { }

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UserService<
  ServiceParams extends Params = UserParams
> extends KnexService<User, UserData, UserParams, UserPatch> {

  async generateResetCode({ email }: { email: User['email'] }) {
    const resetCode = parseInt(Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
    const user = (await app.service('users').find({ query: { email }, paginate: false }))?.[0]
    if (user && user.email === email) {
      await app.service('users').patch(user.id, { resetCode }).then(user => sendResetCodeEmail(user))
      console.debug(resetCode)
      return user
    }
    // We don't throw an error to avoid leaking users 
    return { email }
  }

  async verifyResetCode({ email, resetCode }: { email: User['email'], resetCode: User['resetCode'] }) {
    const user = (await app.service('users').find({ query: { email }, paginate: false }))?.[0]
    if (user && user.email === email && user.resetCode === resetCode) {
      return user
    }
    // Bad resetCode or user does not exist
    throw new NotFound()
  }

  async changePassword({ email, resetCode, password }: { email: User['email'], resetCode: User['resetCode'], password: User['password'] }) {
    const user = (await app.service('users').find({ query: { email }, paginate: false }))?.[0]
    if (user && user.email === email && user.resetCode === resetCode) {
      await app.service('users').patch(user.id, { password }).then(user => sendResetCodeEmail(user))
      return user
    }
    // Bad resetCode or user does not exist
    throw new NotFound()
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get("paginate"),
    Model: app.get("sqliteClient"),
    name: "users",
    multi: ["remove"],
  };
};
