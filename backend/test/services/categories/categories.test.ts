// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from "assert";
import { app } from "../../../src/app";
import { cleanAll } from "../../utils/clean-all";
import { getProductMock } from "../products/products.mocks";
import { getCategoryMock } from "./categories.mocks";
import { describe } from "mocha";

describe("categories service", () => {
  beforeEach(cleanAll);
  it("registered the service", () => {
    const service = app.service("categories");

    assert.ok(service, "Registered the service");
  });
  it("creates a category", async () => {
    const category = await app.service("categories").create(getCategoryMock());

    assert.ok(category, "object returned");
    assert.ok(category.name === getCategoryMock().name, "name is set");
    assert.ok(category.createdAt !== null, "Creation date is set");
    assert.ok(category.updatedAt !== null, "Last update date is set");
    assert.ok(
      category.createdAt === category.updatedAt,
      "Creation and last update dates are equal"
    );
  });
  it("Doesnt remove a category if products exists within this category", async () => {
    const category = await app.service("categories").create(getCategoryMock());
    const productData = getProductMock(category.id);
    await app.service("products").create(productData);

    const removeCategoryFn = app.service("categories").remove(category.id);
    assert.rejects(removeCategoryFn, "object returned");
  });
});
