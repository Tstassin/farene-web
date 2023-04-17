// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import { BadRequest } from "@feathersjs/errors/lib";
import assert from "assert";
import { app } from "../../../src/app";
import { cleanAll } from "../../utils/clean-all";
import { noEmails } from "../../utils/no-emails";
import { getUserMock } from "./users.mocks";
import { describe } from 'mocha'

describe("users service", () => {
  before(noEmails)
  beforeEach(cleanAll)
  it("registered the service", () => {
    const service = app.service("users");

    assert.ok(service, "Registered the service");
  });
  describe('Create', async () => {
    it("creates a user with all info", async () => {
      const service = app.service("users");
      const userData = getUserMock();
      const user = await service.create(userData)
      assert.equal(user.firstName, userData.firstName)
      assert.equal(user.lastName, userData.lastName)
      assert.equal(user.email, userData.email)
    });
    it("Requires email", async () => {
      const service = app.service("users");
      const userData = getUserMock({ email: '' });
      const userCreateFn = service.create(userData)
      await assert.rejects(userCreateFn, (err: BadRequest) => {
        const error = err.toJSON();
        assert.match(err.message, /validation failed/);
        assert.equal(err.data[0].message, 'must match format "email"');
        assert.strictEqual(err.code, 400);
        return true;
      })
    });
    it("Requires password of length >= 1", async () => {
      const service = app.service("users");
      const userData = getUserMock({ password: '' });
      const userCreateFn = service.create(userData)
      await assert.rejects(userCreateFn, (err: BadRequest) => {
        const error = err.toJSON();
        assert.match(err.message, /validation failed/);
        assert.equal(err.data[0].message, 'must NOT have fewer than 1 characters');
        assert.strictEqual(err.code, 400);
        return true;
      })
    });
    it("Doesn't require firstName", async () => {
      const service = app.service("users");
      const userData = getUserMock({ firstName: undefined });
      const user = await service.create(userData)
      assert.equal(userData.firstName, user.firstName)
    });
    it("Doesn't require lastName", async () => {
      const service = app.service("users");
      const userData = getUserMock({ lastName: undefined });
      const user = await service.create(userData)
      assert.equal(userData.lastName, user.lastName)
    });
    it("resetCode is not creatable", async () => {
      const service = app.service("users");

      const userData = getUserMock(
        //@ts-expect-error types doesn't already allow resetCode 
        { resetCode: 'CODE' }
      );
      const userCreateFn = service.create(userData)
      await assert.rejects(userCreateFn, (err: BadRequest) => {
        const error = err.toJSON();
        assert.match(err.message, /validation failed/);
        assert.equal(err.data[0].message, 'must NOT have additional properties');
        assert.strictEqual(err.code, 400);
        return true;
      })
    });

  })
});
