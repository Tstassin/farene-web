// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from "@feathersjs/feathers";
import type { TransportConnection, Application } from "@feathersjs/feathers";
import authenticationClient from "@feathersjs/authentication-client";
import type { AuthenticationClientOptions } from "@feathersjs/authentication-client";

import { createPaymentIntentClient } from "./services/create-payment-intent/create-payment-intent.shared";
export type {
  CreatePaymentIntentData,
  CreatePaymentIntentReturnData,
} from "./services/create-payment-intent/create-payment-intent.shared";

import { productClient } from "./services/products/products.shared";
import { orderClient } from "./services/orders/orders.shared";
import { categoryClient } from "./services/categories/categories.shared";

export interface Configuration {
  connection: TransportConnection<ServiceTypes>;
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>;

/**
 * Returns a typed client for the backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers();

  client.configure(connection);
  client.set("connection", connection);
  client.configure(authenticationClient(authenticationOptions));
  client.configure(orderClient);
  client.configure(categoryClient);
  client.configure(productClient);
  client.configure(createPaymentIntentClient);
  return client;
};
