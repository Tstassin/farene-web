import { app } from "../../src/app";

export const cleanAll = async () => {
  // Order matters !
  await app.service("order-items")._remove(null);
  await app.service("products")._remove(null);

  await app.service("orders")._remove(null);
  await app.service("users")._remove(null);
  await app.service("categories")._remove(null);
};
