// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from "@feathersjs/authentication";

import { hooks as schemaHooks } from "@feathersjs/schema";

import {
  userDataValidator,
  userPatchValidator,
  userQueryValidator,
  userResolver,
  userExternalResolver,
  userDataResolver,
  userPatchResolver,
  userQueryResolver,
  User,
} from "./users.schema";

import type { Application } from "../../declarations";
import { UserService, getOptions } from "./users.class";
import { userPath, userMethods } from "./users.shared";
import {
  resourceSchemaCreateResolver,
  resourceSchemaPatchResolver,
} from "../common/resources";
import { logErrorToConsole } from "../../hooks/log-error";
import { sendNewAccountEmail } from "../../hooks/send-new-account-email";

export * from "./users.class";
export * from "./users.schema";

// A configure function that registers the service and its hooks via `app.configure`
export const user = (app: Application) => {
  // Register our service on the Feathers application
  app.use(userPath, new UserService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: userMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
  });
  // Initialize hooks
  app.service(userPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(userExternalResolver),
        schemaHooks.resolveResult(userResolver),
      ],
      find: [authenticate("jwt")],
      get: [authenticate("jwt")],
      create: [],
      update: [authenticate("jwt")],
      patch: [authenticate("jwt")],
      remove: [authenticate("jwt")],
      generateResetCode: [],
      verifyResetCode: [],
      changePassword: []
    },
    before: {
      all: [
        schemaHooks.validateQuery(userQueryValidator),
        schemaHooks.resolveQuery(userQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(userDataValidator),
        schemaHooks.resolveData(userDataResolver, resourceSchemaCreateResolver),
      ],
      patch: [
        schemaHooks.validateData(userPatchValidator),
        schemaHooks.resolveData(
          userPatchResolver,
          resourceSchemaPatchResolver
        ),
      ],
      remove: [],
    },
    after: {
      all: [],
      create: [
        async (context) => {
          if (context.result === undefined) {
            logErrorToConsole('created user but contexts result is undefined ????')
            return context
          }
          const user = context.result as User // No multi = true, no pagination allowed
          sendNewAccountEmail(user)
          return context
        }
      ]
    },
    error: {
      all: [],
    },
  });
};

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    [userPath]: UserService;
  }
}
