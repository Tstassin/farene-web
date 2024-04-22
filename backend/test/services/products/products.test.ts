// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from "assert";
import { app } from "../../../src/app";
import { describe } from "mocha";
import { getCategoryMock } from "../categories/categories.mocks";
import { getProductMock } from "./products.mocks";
import { cleanAll } from "../../utils/clean-all";
import { getUserMock } from "../users/users.mocks";
import { BadRequest, Forbidden } from "@feathersjs/errors/lib";

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
    assert.equal(product.disabled, productData.disabled);
  });
  it("rounds prices to two decimals", async () => {
    const category = await app.service("categories").create(getCategoryMock());

    const product = await app
      .service("products")
      .create(getProductMock(category.id, { price: 1 }));
    assert.ok(product.price === 1);

    const product1 = await app
      .service("products")
      .create(getProductMock(category.id, { price: 1.1 }));
    assert.equal(product1.price, 1.1);

    const product2 = await app
      .service("products")
      .create(getProductMock(category.id, { price: 1.12345 }));
    assert.equal(product2.price, 1.12);
    assert.equal(product2.price, 1.1200000);

    const product3 = await app
      .service("products")
      .create(getProductMock(category.id, { price: 1.10 }));
    assert.equal(product3.price, 1.1);

    const patchedPrice = await app.service('products').patch(product3.id, { price: 2000.233 })
    assert.equal(patchedPrice.price, 2000.23);
    const { createdAt, updatedAt, id, ...updateProductData } = product3
    const updatedPrice = await app.service('products').update(product3.id, { ...updateProductData, price: 2000.233 })
    assert.equal(updatedPrice.price, 2000.23);

  });
  it("users cannot create a product", async () => {
    const user = await app.service('users').create(getUserMock())
    const category = await app.service("categories").create(getCategoryMock());
    const productData = getProductMock(category.id);
    const createProductFn = () => app
      .service("products")
      .create(getProductMock(category.id), { user });
    await assert.rejects(createProductFn, (err: Forbidden) => {
      const error = err.toJSON();
      assert.match(err.message, /Error/);
      assert.match(err.name, /Forbidden/);
      assert.strictEqual(err.code, 403);
      return true;
    });
  })
  it("admins can create products", async () => {
    const user = await app.service('users').create(getUserMock())
    const admin = await app.service('users').patch(user.id, { admin: 1 })
    const category = await app.service("categories").create(getCategoryMock());
    const productData = getProductMock(category.id);
    const product = await app
      .service("products")
      .create(getProductMock(category.id), { user: admin });
    assert.ok(product)
  })

  it("cannot create two products with same SKU", async () => {
    const user = await app.service('users').create(getUserMock())
    const admin = await app.service('users').patch(user.id, { admin: 1 })
    const category = await app.service("categories").create(getCategoryMock());
    const sku = 'SKU'
    await app
      .service("products")
      .create(getProductMock(category.id, { sku }), { user: admin });
    const product2CreateFn = () => app
      .service("products")
      .create(getProductMock(category.id, { sku }), { user: admin });
    await assert.rejects(product2CreateFn, (err: BadRequest) => {
      assert.match(err.message, /Error/);
      assert.match(err.name, /BadRequest/);
      assert.match(err.data.sku.name, /Forbidden/);
      assert.match(err.data.sku.message, /Ce code unique de produit est déjà utilisé/);
      assert.strictEqual(err.code, 400);
      assert.strictEqual(err.data.sku.code, 403);
      return true;
    });
  })

  it("cannot update a product with an existing sku", async () => {
    const user = await app.service('users').create(getUserMock())
    const admin = await app.service('users').patch(user.id, { admin: 1 })
    const category = await app.service("categories").create(getCategoryMock());
    const product1 = await app
      .service("products")
      .create(getProductMock(category.id), { user: admin });
    const product2 = await app
      .service("products")
      .create(getProductMock(category.id), { user: admin });

    const { id, createdAt, updatedAt, ...updatePayload } = product2
    updatePayload['sku'] = product1.sku

    const productUpdateFn = () => app
      .service("products")
      .update(product2.id, updatePayload, { user: admin });

    await assert.rejects(productUpdateFn, (err: BadRequest) => {
      assert.match(err.message, /Error/);
      assert.match(err.name, /BadRequest/);
      assert.match(err.data.sku.name, /Forbidden/);
      assert.match(err.data.sku.message, /Ce code unique de produit est déjà utilisé/);
      assert.strictEqual(err.code, 400);
      assert.strictEqual(err.data.sku.code, 403);
      return true;
    });
  });

  it("can update a product with it's existing sku", async () => {
    const user = await app.service('users').create(getUserMock())
    const admin = await app.service('users').patch(user.id, { admin: 1 })
    const category = await app.service("categories").create(getCategoryMock());
    const product = await app
      .service("products")
      .create(getProductMock(category.id), { user: admin });

    const { id, createdAt, updatedAt, ...updatePayload } = product

    const updated = await app
      .service("products")
      .update(product.id, updatePayload, { user: admin });

    assert.equal(product.sku, updated.sku)
  });

  it("cannot patch a product with an existing sku", async () => {
    const user = await app.service('users').create(getUserMock())
    const admin = await app.service('users').patch(user.id, { admin: 1 })
    const category = await app.service("categories").create(getCategoryMock());
    const product1 = await app
      .service("products")
      .create(getProductMock(category.id), { user: admin });
    const product2 = await app
      .service("products")
      .create(getProductMock(category.id), { user: admin });

    const productUpdateFn = () => app
      .service("products")
      .patch(product2.id, { sku: product1.sku }, { user: admin });

    await assert.rejects(productUpdateFn, (err: BadRequest) => {
      assert.match(err.message, /Error/);
      assert.match(err.name, /BadRequest/);
      assert.match(err.data.sku.name, /Forbidden/);
      assert.match(err.data.sku.message, /Ce code unique de produit est déjà utilisé/);
      assert.strictEqual(err.code, 400);
      assert.strictEqual(err.data.sku.code, 403);
      return true;
    });
  });

  it("can patch a product with it's existing sku", async () => {
    const user = await app.service('users').create(getUserMock())
    const admin = await app.service('users').patch(user.id, { admin: 1 })
    const category = await app.service("categories").create(getCategoryMock());
    const product = await app
      .service("products")
      .create(getProductMock(category.id), { user: admin });

    const patched = await app
      .service("products")
      .patch(product.id, { sku: product.sku }, { user: admin });

    assert.equal(product.sku, patched.sku)
  });

  // TODO users cannot / admins can patch/update

});
