import {
  Type,
  getValidator,
  defaultAppConfiguration,
} from "@feathersjs/typebox";
import type { Static } from "@feathersjs/typebox";

import { dataValidator } from "./validators";

export const configurationSchema = Type.Intersect([
  defaultAppConfiguration,
  Type.Object({
    host: Type.String(),
    port: Type.Number(),
    public: Type.String(),
  }),
  Type.Object({
    notifications: Type.Object({
      postmark: Type.Object({
        sender: Type.Object({
          email: Type.String()
        }),
        key: Type.String(),
      })
    })
  }),
  Type.Object({
    payments: Type.Object({
      stripe: Type.Object({
        secret_key: Type.String()
      }),
      b2b: Type.Object({
        code: Type.String()
      })
    })
  })
]);

export type ApplicationConfiguration = Static<typeof configurationSchema>;

export const configurationValidator = getValidator(
  configurationSchema,
  dataValidator
);
