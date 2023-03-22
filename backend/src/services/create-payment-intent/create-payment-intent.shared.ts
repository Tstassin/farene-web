// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from "@feathersjs/feathers";
import type { ClientApplication } from "../../client";
import type {
  CreatePaymentIntentData,
  CreatePaymentIntentService,
  CreatePaymentIntentReturnData,
} from "./create-payment-intent.class";

export type { CreatePaymentIntentData, CreatePaymentIntentReturnData };

export type CreatePaymentIntentClientService = Pick<
  CreatePaymentIntentService,
  (typeof createPaymentIntentMethods)[number]
>;

export const createPaymentIntentPath = "create-payment-intent";

export const createPaymentIntentMethods = ["update"] as const;

export const createPaymentIntentClient = (client: ClientApplication) => {
  const connection = client.get("connection");

  client.use(
    createPaymentIntentPath,
    connection.service(createPaymentIntentPath),
    {
      methods: createPaymentIntentMethods,
    }
  );
};

// Add this service to the client service type index
declare module "../../client" {
  interface ServiceTypes {
    [createPaymentIntentPath]: CreatePaymentIntentClientService;
  }
}
