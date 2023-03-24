// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from "assert";
import { app } from "../../../src/app";
import { describe } from "mocha";
import { getCategoryMock } from "../categories/categories.mocks";
import { getProductMock } from "./products.mocks";
import { cleanAll } from "../../utils/clean-all";

describe("products service", () => {
  beforeEach(cleanAll)
  it("registered the service", () => {
    const service = app.service("products");

    assert.ok(service, "Registered the service");
  });
  it("creates a product", async () => {
    const category = await app.service("categories").create(getCategoryMock());
    const productData = getProductMock(category.id);
    const product = await app
      .service("products")
      .create(getProductMock(category.id));

    assert.ok(product);
    assert.ok(product.name === productData.name, "with name");
    assert.ok(product.description === productData.description);
    assert.ok(product.categoryId === productData.categoryId, "with category");
    assert.ok(product.createdAt !== null);
    assert.ok(product.updatedAt !== null);
    assert.ok(product.createdAt === product.updatedAt);
    assert.ok(product.price === productData.price);
    assert.ok(product.weight === productData.weight);
  });
});
