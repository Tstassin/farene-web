import { FeathersError } from "@feathersjs/errors/lib";
import assert from "assert";

export const assertRejects = async (fn: () => Promise<any>, ErrorType: typeof FeathersError, errMessage: RegExp | string, data?: any) => {
  await assert.rejects(fn, (err: FeathersError) => {
    if (typeof errMessage === 'string') {
      assert.ok(err.message.includes(errMessage));
    } else {
      assert.match(err.message, errMessage);
    }
    console.log(err instanceof ErrorType)
    assert.ok(err instanceof ErrorType);
    if (data) assert.deepEqual(err.data, data)
    return true;
  });
}