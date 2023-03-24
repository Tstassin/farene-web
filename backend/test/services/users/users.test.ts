// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from "assert";
import { app } from "../../../src/app";
import { cleanAll } from "../../utils/clean-all";

describe("users service", () => {
  beforeEach(cleanAll)
  it("registered the service", () => {
    const service = app.service("users");

    assert.ok(service, "Registered the service");
  });
});
